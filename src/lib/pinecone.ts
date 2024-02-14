import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";



export const getPineconeClient = () => {
    return new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT_ID!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
    
  };

  type PDFPage = {
    pageContent: string;
    metadata: {
      loc: { pageNumber: number };
    };
  };

export async function loadS3IntoPinecone(filekey:string){
    //1. obtain pdf -> download and read from pdf
    console.log("downloading file from s3");
    const file_name = await downloadFromS3(filekey);
    if(!file_name){
        throw new Error("Error downloading file from s3");
    }
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];//will return all the pages within the pdf

    //2. split and segment the pdf into pages
    const documents = await Promise.all(pages.map(prepearePDF));
    console.log("__________documents", documents);

    // 3. vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    //4. Upload to pinecone 
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("chatpdf");
    const namespace = pineconeIndex.namespace(convertToAscii(filekey));

    console.log("inserting vectors into pinecone");
    await namespace.upsert(vectors);

    return documents[0];


}

async function embedDocument(doc: Document) {
 
  
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);//it is  basically id of data , like we use v4
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}


//it will trucate the content to acceptable to pinecone
export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

//preparing pDF as , we need small chucks of content to store in pinecone
async function prepearePDF(page : PDFPage){
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}