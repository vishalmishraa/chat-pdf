"use client"
import { uploadToS3 } from '@/lib/s3'
import { useMutation } from '@tanstack/react-query'
import { Inbox,Loader2 } from 'lucide-react'
import React from 'react'
import {useDropzone} from 'react-dropzone'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from "next/navigation";
import { useState } from 'react'


const FileUpload = () => {
    const router = useRouter();
    const [uploading, setUploading] = React.useState(false);
    const { mutate, isLoading } = useMutation({
        mutationFn: async ({
          file_key,
          file_name,
        }: {
          file_key: string;
          file_name: string;
        }) => {
          const response = await axios.post("/api/create-chat", {
            file_key,
            file_name,
          });
          return response.data;
        },
    });
    const {getRootProps , getInputProps} = useDropzone({
            accept: { "application/pdf": [".pdf"] },
            maxFiles: 1,
            onDrop: async (acceptedFiles) => {
               
                const file = acceptedFiles[0];
                if(file.size > 10000000){
                    toast.error("File size should be less than 10 MB");
                    return;
                }
                try{
                    setUploading(true);
                    const data  = await uploadToS3(file);

                    if(!data.file_key || !data.file_name){
                        toast.error("Error uploading file");
                        return;
                    }
                    console.log(data);
                    mutate(data, {
                        onSuccess: ({chat_id}) => {
                          toast.success("Chat Created.");
                          console.log("chat_id", chat_id);
                          router.push(`/chat/${chat_id}`);
                        },
                        onError: (err) => {
                          toast.error("Error creating chat");
                          console.error(err);
                        },
                    });
                }catch(err){
                    toast.error("Error uploading file");
                    console.log(err);
                }finally{
                    setUploading(false);
                }

                
            }
        })


  return (
    <div className="p-2 bg-white rounded-xl">
        <div  {...getRootProps({
            className : 'border-dashed rounded-xl cursor-pointer bg-gray-50 p-8 flex justify-center items-center flex-col'
        })}>
            <input {...getInputProps()} />
            {
                uploading || isLoading ? (
                    <>
                        {/* loading state */}
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="mt-2 text-sm text-slate-400">
                        Spilling Tea to GPT...
                        </p>
                    </>
                ):
                (
                    <>
                    
                        <Inbox className='w-10 h-10 text-blue-500'></Inbox>
                        <p className='mt-2 text-sm text-slate-400'>Drop PDF here (Max : 10 MB) </p>
                    </>
                )
            }
        
            
        </div>
    </div>
  )
}

export default FileUpload