import prismaClient from "../../prisma";

interface AccountRequest{
  id?:string,
  name?: string;
  type?: string;
  created_by: string;
}
export {AccountRequest}

class ListAccountService{

  async execute({id,type,name, created_by}:AccountRequest){

    let query = {
      where:{
        
      },
      select:{
        id: true,
        name: true,
        type: true
      }
    }
    query.where = {...query.where, created_by:created_by};
    if(id) query.where = {...query.where, id:id};
    if(type) query.where = {...query.where, type:type};
    if(name) query.where = {...query.where, name:name};
    const account = await prismaClient.account.findMany(query);
    return account;

  }
}

export { ListAccountService }