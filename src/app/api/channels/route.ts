
import { currentProfile } from './../../../lib/current-profile';
import { NextResponse } from 'next/server';
import { db } from './../../../lib/db';
import { MemberRole } from '@prisma/client';
export const POST=async(req:Request)=>{
  try {
    const profile=await currentProfile();

    const {name,type}=await req.json();
    const {searchParams}=new URL(req.url);
    
    const serverId=searchParams.get("serverId");
    if(!profile){
      return NextResponse.json({success:false,msg:'Unauthorized',data:null},{status:401});
    }
    if(!serverId){
      return NextResponse.json({success:false,msg:'Server id missing',data:null},{status:400});
    }
    if(name==='general'){
      return NextResponse.json({success:false,msg:'Name cannot be `general`',data:null},{status:400});
    }

    const server= await db.server.update({
      where:{
        id:serverId,
        members:{
          some:{
            profileId:profile.id,
            role:{
              in:[MemberRole.ADMIN,MemberRole.MODERATOR]
            }
          }
        }
      },
      data:{
        channels:{
          create:{
            profileId:profile.id,
            name,
            type
          }
        }
      }
    });
    return NextResponse.json({success:true,msg:'Channel created',data:server},{status:200})
  } catch (error) {
    console.log("CHANNEL_POST_ERROR: ",error);
  }
}
