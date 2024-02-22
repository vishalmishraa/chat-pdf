import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";


export default async function Home() {
  const {userId} = await auth();
  const isAuth = !!userId;
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute mt-28 md:mt-10 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="">
            <h1 className=" mr-3 text-4xl w-screen md:text-6xl font-semibold">Chat with any PDF</h1>
          </div>
          
          <p className="max-w-sm mt-2 mb-2 md:max-w-xl text-lg text-slate-600">
            Join millions of students, researchers and professionals to instantly
            answer questions and understand research with AI.
          </p>
          <div className="flex flex-row justify-between mt-2 gap-4 items-center">
              <div className="">
                {
                  isAuth && firstChat && (

                    <Link href={`/chat/${firstChat.id}`}>      
                        <Button>Go to Chats</Button>
                    </Link>
                    
                  )
                }
              </div>
              <div className="">
                  {
                      isAuth ? (
                        // <FileUpload />
                        
                        <Button className="bg-slate-100 text-black hover:opacity-90 hover:bg-gray-300">Manage your subscription.</Button>
                      ) : (
                            <Link href="/sign-in">
                              
                              <Button>
                                Login to get Started!
                                <LogIn className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          )
                  }
              </div>
          </div>
          <div className="w-full px-12 mt-4 md:px-80  ">
            {
              isAuth && (
                <FileUpload />
              )
            }
          </div>
         

          
        </div>
      </div>
    </div>
  );
}
