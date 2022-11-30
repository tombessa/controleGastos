import prismaClient from "../../prisma";

interface AccountRequest{
  name: string;
  type: string;
  created_by: string;
  updated_by: string;
}

class CreateAccountService{
  async execute({ name, type, created_by, updated_by}: AccountRequest){
    
    if(name === ''){
        throw new Error('Name invalid')
    }

    if(type === ''){
        throw new Error('Type invalid')
    }

    const account = await prismaClient.account.create({
      data:{
        name: name,
        type: type,
        created_by: created_by,
        updated_by: updated_by,
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

export { CreateAccountService }