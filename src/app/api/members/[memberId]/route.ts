
import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profile';
import { db } from './../../../../lib/db';

export const DELETE=async(req:Request,{params}:{params:{memberId:string}})=>{
  try {
    const profile=await currentProfile();
    if(!profile){
      return NextResponse.json({success:false,msg:'Unauthorized',data:null},{status:401});
    }
    const {searchParams}=new URL(req.url);
    const serverId=searchParams.get('serverId');
    if(!serverId){
      return NextResponse.json({success:false,msg:'Server id missing.',data:null},{status:400});
    }
    if(!params.memberId){
      return NextResponse.json({success:false,msg:'Member id missing.',data:null},{status:400});
    }

    const server=await db.server.update({
      where:{
        id:serverId,
        profileId:profile.id
      },
      data:{
        members:{
          deleteMany:{
            id:params.memberId,
            profileId:{not:profile.id}
          }
        }
      },
      include:{
        members:{
          include:{
            profile:true
          },
          orderBy:{
            role:'asc'
          }
        }
      }
    });
    
    return NextResponse.json({success:true,msg:'Member deleted.',data:server},{status:200});


      
  } catch (error) {
      console.log("[MEMBER_ID] DELETE ERROR: ",error);
      return NextResponse.json({success:false,msg:'Internal Error',data:null},{status:500});
  }

}


export const PATCH=async(req:Request,{params}:{params:{memberId:string}})=>{
  try {
    const profile=await currentProfile();
    if(!profile){
      return NextResponse.json({success:false,msg:'Unauthorized',data:null},{status:401});
    }


    const {searchParams}=new URL(req.url);
    const {role}=await req.json();

    const serverId=searchParams.get('serverId');
    if(!serverId){
      return NextResponse.json({success:false,msg:'Server id missing.',data:null},{status:400});
    }
    if(!params.memberId){
      return NextResponse.json({success:false,msg:'Member id missing.',data:null},{status:400});
    }

    const server=await db.server.update({
      where:{
        id:serverId,
        profileId:profile.id
      },
      data:{
        members:{
          update:{
            where:{
              id:params.memberId,
              profileId:{not:profile.id}
            },
            data:{
              role
            }
          }
        }
      },
      include:{
        members:{
          include:{
            profile:true
          },
          orderBy:{
            role:'asc'
          }
        }
      }
    });
    return NextResponse.json({success:true,msg:'Member updated.',data:server},{status:200});

  } catch (error) {
    console.log("[MEMBER_ID] PATCH ERROR: ",error);
    return NextResponse.json({success:false,msg:'Internal Error',data:null},{status:500});
  }
}
