'use client'

import { Member, MemberRole, Profile } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import UserAvatar from '../UserAvatar';
import ActionTooltip from '../ActionTooltip';
import { roleIconMap } from '@/lib/iconmap';
import Image from 'next/image';
import { Delete, Edit, FileIcon, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Form,FormControl,FormField,FormItem
} from '@/components/ui/form';
import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
 import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/useModalHook';
import {useRouter,useParams} from 'next/navigation';






interface ChatItemProps {
  id:string;
  content:string;
  member:Member&{
    profile:Profile;
  },
  timestamp:string;
  fileUrl:string|null;
  deleted:boolean;
  currentMember:Member;
  isUpdated:boolean;
  socketUrl:string;
  socketQuery:Record<string,string>
}
const formSchema = z.object({
  content:z.string().min(1)
});


const ChatItem: FC<ChatItemProps> = (p:ChatItemProps) => {
  const fileType=p.fileUrl?.split('.').pop();
  const [isEditing, setIsEditing] = useState(false);

  const {onOpen} = useModal();
  
  const form=useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      content:p.content,
    }
  });

  const isLoading=form.formState.isSubmitting;
  const onSubmit= async(values:z.infer<typeof formSchema>)=>{
    try {
      const url=qs.stringifyUrl({
        url:`${p.socketUrl}/${p.id}`,
        query:p.socketQuery
      });
      await axios.patch(url,values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error)
    }
  }

  const params=useParams();
  const router=useRouter();
  const onMemberClick=()=>{
    if(p.member.id===p.currentMember.id){
      return;
    }
    router.push(`/server/${params?.serverId}/conversations/${p.member.id}`);
  }

  useEffect(()=>{
    const handleKeydown=(e:any)=>{
      if(e.key==='Escape'||e.keyCode===27){
        setIsEditing(false);
      }
    }
    window.addEventListener('keydown',handleKeydown);

    return ()=>window.removeEventListener('keydown',handleKeydown);
  },[]);


  useEffect(() => {
    form.reset({
      content:p.content
    })
  }, [p.content]);

  const isAdmin=p.currentMember.role===MemberRole.ADMIN;
  const isModerator=p.currentMember.role===MemberRole.MODERATOR;
  const isOwner=p.currentMember.id===p.member.id;
  const canDeleteMsg=!p.deleted&&(isAdmin||isModerator||isOwner);
  const canEditMsg=!p.deleted&&isOwner&&!p.fileUrl;
  const isPdf=fileType==='pdf'&&p.fileUrl;
  const isImage=!isPdf&&p.fileUrl;







  return (
    <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
      <div className='group flex gap-x-2 items-start w-full'>
        <div onClick={onMemberClick} className='cursor-pointer hover:drop-shadow-md transition'>
          <UserAvatar src={p.member.profile.imageUrl}/> 
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex items-center gap-x-2'>
            <div className='flex items-center'>
              <p onClick={onMemberClick} className='font-semibold text-sm hover:underline cursor-pointer'>
                {p.member.profile.name}
              </p>
              <ActionTooltip label={p.member.role}>
                {roleIconMap[p.member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {p.timestamp}
            </span>
          </div>
          {isImage&&p.fileUrl&&(
            <a href={p.fileUrl} target='_blank' rel='noopener noreferrer'
              className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'  
            >
              <Image
                src={p.fileUrl}
                alt={p.content}
                fill
                className='object-cover'
              />
            </a>
          )}
          {isPdf&&p.fileUrl&&(
            <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
            <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400'/>
            <a 
              href={p.fileUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
            >
              PDF file
            </a>
          </div>
          )}
          {!p.fileUrl&&!isEditing&&(
            <p className={cn(
              "text-sm text-zinc-600 dark:text-zinc-300 ",
              p.deleted&&"italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
            )}>
              {p.content}
              {p.isUpdated&&!p.deleted&&(
                <span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'>
                  (edited)
                </span>
              )}
            </p>
          )}
          {!p.fileUrl&&isEditing&&(
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}
                className='flex items-center w-full gap-x-2 pt-2 '
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({field})=>(
                    <FormItem className='flex-1'>
                        
                      <FormControl>
                        <div>
                          <Input
                            disabled={isLoading}
                            className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                            placeholder='Edited message'
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                    Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
            
          )

          }

        </div>
      </div>
      {canDeleteMsg&&(
        <div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm'>
          {canEditMsg&&(
            <ActionTooltip label='edit'>
              <Edit className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
                onClick={()=>setIsEditing(true)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label='delete'>
            <Trash className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
              onClick={()=>onOpen('deleteMessage',{apiUrl:`${p.socketUrl}/${p.id}`,query:p.socketQuery})}
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}

export default ChatItem;
