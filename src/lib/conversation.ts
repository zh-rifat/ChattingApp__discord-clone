import { db } from "./db";

export const getOrCreateConversation=async(member1Id:string,member2Id:string)=>{
  let conversation = await findConversation(member1Id,member2Id)||await findConversation(member2Id,member1Id);

  if(!conversation){
    conversation=await createNewConversation(member1Id,member2Id);
  }
  return conversation;
}



const findConversation=async (member1Id:string, member2Id:string)=>{
  try {
    return await db.conversation.findFirst({
      where:{
        AND:[
          {member1Id},
          {member2Id}
        ]
      },
      include:{
        member1:{
          include:{
            profile:true
          }
        },
        member2:{
          include:{
            profile:true
          }
        }
      }
    });
      
  } catch (error) {
    console.log("[conversation.findConversation] ",error)
    return null;
    
  }
}


const createNewConversation=async(member1Id:string,member2Id:string)=>{
  try {
      return await db.conversation.create({
        data:{
          member1Id,
          member2Id
        },
        include:{
          member1:{
            include:{
              profile:true
            }
          },
          member2:{
            include:{
              profile:true
            }
          }
        }
      })
  } catch (error) {
    console.log("[conversation.createNewConversation] ",error)
    return null;
  }

}
