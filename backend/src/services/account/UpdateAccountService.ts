import prismaClient from "../../prisma";

interface AccountRequest{
  id:string,
  name: string;
  type: string;
  updated_by: string;
}

class UpdateAccountService{
  async execute({ id, name, type, updated_by}: AccountRequest){
    
    if(name === ''){
        throw new Error('Name invalid')
    }

    if(type === ''){
        throw new Error('Type invalid')
    }

    const account = await prismaClient.account.update({
      where:{
        id: id
      },
      data:{        
        name: name,
        type: type,
        updated_at: new Date(),
        updated_by: updated_by
      },
      select:{
        id: true,
        name: true,
        type: true
      }
    })


    return account;

  }
}

export { UpdateAccountService }