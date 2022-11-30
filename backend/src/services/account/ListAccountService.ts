import prismaClient from "../../prisma";

interface AccountRequest{
  id?:string,
  name?: string;
  type?: string;
}

class ListAccountService{
  async execute({id,type,name}:AccountRequest){
    if(id){
      const category = await prismaClient.account.findFirst({
        where :{
          id: id,
        },
        select:{
          id: true,
          name: true,
          type: true
        }
      })
      return category;
    }

    if(type){
      const category = await prismaClient.account.findMany({
        where :{
          type: type,
        },
        select:{
          id: true,
          name: true,
          type: true
        }
      })
      return category;
    }

    if(name){
      const category = await prismaClient.account.findMany({
        where :{
          name: name,
        },
        select:{
          id: true,
          name: true,
          type: true
        }
      })
      return category;
    }

    const category = await prismaClient.account.findMany({
      select:{
        id: true,
        name: true,
        type: true
      }
    })

    return category;

  }
}

export { ListAccountService }