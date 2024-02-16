"use client"
import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { AlignLeft, PlusCircle , ChevronFirst, ChevronLast, MessageCircle } from 'lucide-react'
import { createContext, useContext, useState } from "react"



type Props = {
  chats: DrizzleChat[];
  chatId: number;
    
}

  const ChatSidebar = ({ chats, chatId }: Props) => {
  const [expanded, setExpanded] = useState(false)
 
  
  return (
    <div className = {`flex gap-2 p-4 md:ml-0 transition-shadow  ${expanded ? "bg-slate-100 " : "bg-none"} `}>
            <aside className="h-screen ">
                <nav className="h-full   shadow-sm">
                    <div className=" flex flex-col pb-2">
                        
                        <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg  ">
                            {expanded ? <ChevronFirst className='ml-0 mr-auto' /> : <ChevronLast />}
                        </button>
                        {/* New Chat   */}
                        <Link href='/' className=''>
                            <li  className={` relative flex items-center py-2 px-2 my-1 font-medium rounded-md cursor-pointer transition-all group }`}>
                          <PlusCircle className=' w-6 h-6'/>  
                          <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3 rounded-lg  " : "w-0 hidden"}`}>New Chat</span>

                          {!expanded && (
                              <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-slate-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                                  New Chat
                              </div>
                          )}
                            </li>
                        </Link>
                          {
                            chats.map((chat) => (
                                <Link href={`/chat/${chat.id}`} key={chat.id} >
                                    <li  className={` relative flex items-center py-2 px-2 my-0 font-medium rounded-md cursor-pointer transition-all group `}>
                                        <MessageCircle className={`  ${!expanded ? 'hidden':'w-6 h-6'}`}/>  
                                        <span className={` transition-all ${expanded ? (`w-52 ml-2 gap-0  hover:bg-slate-300  overflow-hidden p-2 text-sm truncate whitespace-nowrap text-ellipsis rounded-lg ${(chat.id==chatId)&&('bg-slate-300 ')} `) : "w-0 hidden"}`}>{chat.pdfName}</span>
                                        {!expanded && (
                                            <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-slate-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                                                {chat.pdfName}
                                            </div>
                                        )}
                                    </li>
                                </Link>
                            ))
                          }      
                        
                            
                        
                    </div>
                </nav>
            </aside>
    </div>
  )
}



export default ChatSidebar

