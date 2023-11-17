'use client'

import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle} from '@/components/ui/dialog'

import { useModal } from '@/hooks/useModalHook';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrigin } from './../../hooks/useOrigin';
import { useState } from 'react';
import axios from 'axios';


const InviteModal = ({}) => {
  const {onOpen,isOpen,onClose,type,data}=useModal();

  const isModalOpen=isOpen&&type==='invite';
  
  const origin=useOrigin();
  const {server}=data;

  const inviteUrl=`${origin}/invite/${server?.inviteCode}`;
  
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy=(txt:string)=>{
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(()=>{
      setCopied(false);
    },1000)
  }

  const handleGenerate=async()=>{
    try {
      setIsLoading(true);
      const response=await axios.patch(`/api/servers/${server?.id}/invite-code`);
      onOpen('invite',{server:response.data})
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server

          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <div className='p-6'>
          <label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>Server invite link</label>
          <div className='flex items-center mt-2 gap-x-2 '>
            <Input className='bg-zinc-300/50 border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
              value={inviteUrl}
              disabled={isLoading}
            />
            
            <Button size="icon" onClick={()=>handleCopy(inviteUrl)} disabled={isLoading}>
              {copied?
                <Check className='w-4 h-4'/>
                :
                <Copy className='w-4 h-4'/>
              }
            </Button>
          </div>
          <Button className='text-xs text-zinc-500 mt-4' variant='link' size='sm'
            disabled={isLoading}
            onClick={handleGenerate}
          >
            Generate a new link
            <RefreshCw className='h-4 w-4 ml-2'/>
          </Button>
        </div>
      </DialogContent>

    </Dialog>
  )
}

export default InviteModal;
