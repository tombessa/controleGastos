import prismaClient from "../../prisma";

interface AccountRequest{
  id?:string,
  name?: string;
  type?: string;
}

class ListAccountService{
  async execute({id,type,name}:AccountRequest){

    let query = {
      where:{

      },
      select:{
        id: true,
        name: true,
        type: true
      }
    }
    if(id) query.where = {...query.where, id:id};
    if(type) query.where = {...query.where, type:type};
    if(name) query.where = {...query.where, name:name};
    
    const account = await prismaClient.account.findMany(query);
    return account;

  }
}

export { ListAccountService }