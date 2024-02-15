
import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// convert messages from the Vercel AI SDK Format to the format
// that is expected by the Google GenAI SDK
const buildGoogleGenAIPrompt = (messages: Message[]) => ({
    contents: messages
      .filter(message => message.role === 'user' || message.role === 'assistant')
      .map(message => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }],
      })),
  });

export async function POST(req: Request) {
    
    try {
        // Extract the `prompt` from the body of the request
        const { messages, chatId } = await req.json();
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
        if (_chats.length != 1) {
          return NextResponse.json({ error: "chat not found" }, { status: 404 });
        }
        const fileKey = _chats[0].fileKey;
        console.log('fileKey',fileKey);

        const lastMessage = messages[messages.length - 1];
        
        const context = await getContext(lastMessage.content, fileKey);
        console.log(context);
        

       
        const prompt ={
         
          Text: ` 
          
          AI assistant is a brand new, powerful, human-like artificial intelligence.
          The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
          AI is a well-behaved and well-mannered individual.
          AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
          AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
          AI assistant is a big fan of Pinecone and Vercel.
          START CONTEXT BLOCK
          ${context}
          END OF CONTEXT BLOCK
          AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
          If the context does not provide the answer to question, the AI assistant will Read the context carefully and answer the related possible answer".
          If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
          AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
          AI assistant will not invent anything that is not drawn directly from the context.
          `,
        };
        console.log('prompt',prompt.Text);
       

        const geminiStream = await genAI
          .getGenerativeModel({ model: 'gemini-pro' })
          .generateContentStream({
            contents: [{ role: 'user', parts: [{ text: prompt.Text  }] }],
          });

        // const geminiStream = await model.generateContentStream([prompt, ...messages]);

        // Convert the response into a friendly text-stream
        const stream = GoogleGenerativeAIStream(geminiStream);
        

 
        // Respond with the stream
        return new StreamingTextResponse(stream);

    } catch (error) {
        console.log(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}