
import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { chats ,messages as _messages} from '@/lib/db/schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// convert messages from the Vercel AI SDK Format to the format
// that is expected by the Google GenAI SDK
const buildGoogleGenAIPrompt = (messages: Message[] ) => {
   console.log(messages);
   return { contents: messages
      .filter(message => message.role === 'user' || message.role === 'assistant')
      .map(message => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }],
      }))
    }
  };


export async function POST(req: Request) {
    
    try {
        // Extract the `prompt` from the body of the request
    
        const { messages, chatId } = await req.json();
        console.log('messages',messages);
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
        if (_chats.length != 1) {
          return NextResponse.json({ error: "chat not found" }, { status: 404 });
        }
        const fileKey = _chats[0].fileKey;
        console.log('fileKey',fileKey);

        const lastMessage = messages[messages.length - 1];

        console.log('lastMessage',lastMessage);
        
        const context = await getContext(lastMessage.content, fileKey);
        console.log(context);
        const prompt  = ` ${process.env.PROMPT_P1}  ${context} ${process.env.PROMPT_P2}` ;

        
                        const geminiStream = await genAI
                            .getGenerativeModel({ model: 'gemini-1.5-flash' })
                            .startChat({
                              history: [
                                {
                                  role: "user",
                                  parts: `Hello, your answer should be related to the context the copntext is " ${prompt} " . `,
                                },
                                {
                                  role: "model",
                                  parts: "Great to meet you. What would you like to know?",
                                },
                              ],
                              generationConfig: {
                                maxOutputTokens: 1000,
                              },
                            })
                            .sendMessageStream(lastMessage.content);                            

                              // Convert the response into a friendly text-stream
                        const stream = GoogleGenerativeAIStream(geminiStream,{
                          onStart: async () => {
                            // save user message into db
                            await db.insert(_messages).values({
                              chatId,
                              content: lastMessage.content,
                              role: "user",
                            });
                          },
                          onCompletion: async (completion) => {
                            // save ai message into db
                            await db.insert(_messages).values({
                              chatId,
                              content: completion,
                              role: "model",
                            });
                          },
                        });
                      
                        // Respond with the stream
                        return new StreamingTextResponse(stream);

    } catch (error) {
        console.log(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}