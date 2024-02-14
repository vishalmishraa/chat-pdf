import { ModeToggle } from '@/components/global/mode-toggle'
import { UserButton, auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { LogIn } from 'lucide-react'


const Navigation =  async() => {
    const {userId} = await auth();
    const isAuth = !!userId;
  return (
    <div className="fixed  top-0 right-0 left-0 p-4 flex items-center justify-between z-10">
      <aside className=" md:ml-40 flex items-center gap-2">
        <span className="text-xl font-bold"> Chat PDF</span>
      </aside>    
      <aside className=" hidden md:mr-7 md:ml-auto md:flex gap-2 items-center">
        <nav>
            <ul className="flex gap-4 font-medium">
                <li>
                <Link href={'/'}>Home</Link>
                </li>
                <li>
                <Link href={'/about'}>About</Link>
                </li>
                
            </ul>
        </nav>
      </aside>
      <aside className=" md:mr-40 flex gap-4 items-center">
        {
            isAuth ? (
                <UserButton /> 
            ) :(
              <Link href="/sign-in">
                    
              <Button>
                Login
                <LogIn className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            )
        }       
     
      </aside>
    </div>
  )
}

export default Navigation