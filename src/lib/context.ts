import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";


export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("chatpdf");
    console.log("fileKey", fileKey);  
    console.log(convertToAscii(fileKey))
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    console.log("querying embeddings" , fileKey ,embeddings);
    
    const queryResult = await pineconeIndex.namespace(convertToAscii(fileKey)).query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    console.log("queryResult", queryResult.matches);
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}


export async function getContext(query:string , fileKey:string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  console.log("matches", matches);
  
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.5
  );
  console.log("qualifyingDocs", qualifyingDocs);

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  console.log("docs", docs);
  // 5 vectors
  return docs.join("\n").substring(0, 3000);

}   