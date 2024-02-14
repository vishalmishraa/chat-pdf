
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { chats } from "@/lib/db/schema";
import React from 'react';
import ChatSideBar from '@/components/chat/ChatSidebar';
import PdfViewer from '@/components/chat/PdfViewer';
import ChatComponent from '@/components/chat/ChatComponent';
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
      <div className="flex mt-14 max-h-screen overflow-scroll">
        <div className="flex w-full max-h-screen overflow-scroll">
          
          {/* chat sidebar */}
          <div className='flex-[2] max-w-xs'>
             <ChatSideBar chats={_chats} />
          </div>
          {/* pdf viewer */}
          <div className='hidden md:block md:-hidden max-h-screen  overflow-scroll flex-[5] '>
            <PdfViewer pdf_url={pdfUrl}/>
          </div>

          {/* chat component */}
          <div className='flex-[3] border-1-4 border-1-slate-200'>
            {/* <ChatComponent/> */}
          </div>
        </div>
      </div>
    
    </>
  )
}

export default chatPage