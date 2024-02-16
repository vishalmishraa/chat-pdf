
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { chats } from "@/lib/db/schema";
import React from 'react';
import ChatSideBar from '@/components/ChatSidebar';
import PdfViewer from '@/components/PdfViewer';
import ChatComponent from '@/components/ChatComponent';
type Props = {
  params: {
    chatId: string;
  };
};

const chatPage =async ({ params : { chatId } }:Props) => {
  const {userId} = await auth();
  if(!userId){
    return redirect('/sign-in');
  }


  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {//if there is no chats
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {// if owner of chat is not the user
    return redirect("/");
  }
  
  const pdfUrl =  _chats.find((chat) => chat.id === parseInt(chatId))!.pdfUrl;
  

  return (
    <>
      <div className="flex h-5/6 bg-gradient-to-r from-rose-100 to-teal-100">
        <div className="flex w-full max-h-screen overflow-clip">
          
          {/* chat sidebar */}
          <div className='duration-1000 mt-14'>
             <ChatSideBar chats={_chats} chatId={parseInt(chatId)}  />
          </div>
          {/* pdf viewer */}
          <div className='hidden md:block mt-14 md:-hidden max-h-screen  overflow-scroll flex-[4] '>
            <PdfViewer pdf_url={pdfUrl}/>
          </div>

          {/* chat component */}
          <div className=' relative mt-14 flex-[4] '>
            <ChatComponent chatId={parseInt(chatId)}/>
          </div>
        </div>
      </div>
    
    </>
  )
}

export default chatPage