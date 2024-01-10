import ChatHeader from '@/components/chat/ChatHeader';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { FC } from 'react'

interface MemberIdPageProps {
  params:{
    memberId:string;
    serverId:string;
  }
}

const MemberIdPage: FC<MemberIdPageProps> = async({params}) => {
  const profile=await currentProfile();
  if(!profile){
    return redirectToSignIn();
  }
  const member=await db.member.findFirst({
    where:{
      serverId:params.serverId,
      profileId:profile.id,
    },
    include:{
      profile:true
    }
  });
  if(!member){
    return redirect('/');
  }
  const conv=await getOrCreateConversation(member.id,params.memberId);
  if(!conv){
    return redirect(`/servers/${params.serverId}`);
  }
  const {member1,member2}=conv;

  const otherMember=member1.profileId===profile.id?member2:member1;
  return (
  <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
    <ChatHeader
      imageUrl={otherMember.profile.imageUrl}
      name={otherMember.profile.name}
      serverId={params.serverId}
      type='conversation'
    />
  </div>
  )
}

export default MemberIdPage;
