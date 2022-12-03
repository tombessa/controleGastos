import prismaClient from "../../prisma";

interface UserRequest{
  id:string,
  update_by: string;
}

class DeleteUserService{
  async execute({ id, update_by}: UserRequest){

    const user = await prismaClient.user.update({
      where:{
        id: id
      },
      data:{
        active: false
      }
    })


    return user;

  }
}

export { DeleteUserService }