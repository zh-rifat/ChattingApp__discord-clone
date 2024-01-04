
import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Member } from '@prisma/client';
export const PATCH=async(req:Request,{params}:{params:{serverId:string}})=>{
  try {
    const profile=await currentProfile();
    if(!profile){
      return NextResponse.json({success:false,msg:'Unauthorized',data:null},{status:401});
    }
    if(!params.serverId){
      return NextResponse.json({success:false,msg:'Server id missing',data:null},{status:400});
    }
    const server=await db.server.update({
      where:{
        id:params.serverId,
        profileId:{
          not:profile.id
        },
        members:{
          some:{
            profileId:profile.id
          }
        }
      },
      data:{
        members:{
          deleteMany:{
            profileId:profile.id
          }
        }
      }
    });
    return NextResponse.json({success:true,msg:'You left the server.',data:server},{status:200});
  } catch (error) {
      console.log('SERVER_ID_LEAVE',error);
      return NextResponse.json({success:false,msg:'Internal error',data:null},{status:500});
  }
}
