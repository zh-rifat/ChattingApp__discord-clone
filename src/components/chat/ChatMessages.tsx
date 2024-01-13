'use client'

import { Member, Message, Profile } from '@prisma/client';
import { FC, Fragment } from 'react'
import ChatWelcome from './ChatWelcome';
import { useChatQuery } from '@/hooks/useChatQuery';
import { Loader2, ServerCrash } from 'lucide-react';
import { MessageWithMemberWithProfile } from '@/types';
import ChatItem from './ChatItem';
import {format} from 'date-fns';
import { DATE_FORMAT } from '@/lib/utils';


interface ChatMessagesProps {
  name:string;
  member:Member;
  chatId:string;
  apiUrl:string;
  socketUrl:string;
  socketQuery:Record<string,string>;
  paramKey:'channelId'|'conversationId';
  paramValue:string;
  type:"channel"|"conversation";
}

const ChatMessages: FC<ChatMessagesProps> = ({name,member,chatId,apiUrl,socketQuery,socketUrl,paramKey,paramValue,type}) => {

  const queryKey=`chat:${chatId}`

  const {data,fetchNextPage,hasNextPage,isFetchingNextPage,status}=useChatQuery({
    queryKey,
    paramKey,
    paramValue,
    apiUrl
  });
  if(status==='loading'){
    return(
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4'/>
        <p className='text-x text-zinc-500 dark:text-zinc-400'>Loading messages...</p>
      </div>
    )
  }
  if(status==='error'){
    return(
      <div className='flex flex-col flex-1 justify-center items-center'>
        <ServerCrash className='h-7 w-7 text-zinc-500 my-4'/>
        <p className='text-x text-zinc-500 dark:text-zinc-400'>Something went wrong!</p>
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
      <div className='flex-1'/>
      <ChatWelcome type={type} name={name}/>
      <div className='flex flex-col-reverse mt-auto'>
        {data?.pages?.map((group,i)=>(
          <Fragment key={i}>
            {group.data.items.map((message:MessageWithMemberWithProfile)=>(
              <ChatItem
                key={message.id}
                id={message.id}
                member={message.member}
                currentMember={member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt),DATE_FORMAT)}
                isUpdated={message.updatedAt!==message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))

        }

      </div>
    </div>
  )
}

export default ChatMessages
