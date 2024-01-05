import ChatHeader from '@/components/chat/ChatHeader';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { FC } from 'react'

interface ChannelIdPageProps {
  params:{
    serverId:string;
    channelId:string;
  }
}

const ChannelIdPage: FC<ChannelIdPageProps> = async({params}) => {
  const profile=await currentProfile();
  if(!profile)
    return redirectToSignIn();
   
  const channel=await db.channel.findUnique({
    where:{
      id:params.channelId,
    }
  });
  const member=await db.member.findFirst({
    where:{
      serverId:params.serverId,
      profileId:profile.id
    }
  });
  if(!member||!channel){
    redirect("/");
  }
  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader 
        name={channel.name}
        serverId={params.serverId}
        type='channel'
      />
    </div>
  )
}

export default ChannelIdPage
