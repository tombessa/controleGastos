import internal from "stream";
import prismaClient from "../../prisma";

interface GoalRequest{
  id: string,
  amount: number;
  category_id: string;
  updated_by: string;
}

class UpdateGoalService{
  async execute({ id, amount, category_id,  updated_by}: GoalRequest){

    if(!id)throw new Error('Id invalid')
    if(amount===undefined)throw new Error('Amount invalid')
    if(!category_id)throw new Error('Category invalid')

    const goal = await prismaClient.goal.update({
      where:{
        id: id
      },
      data:{
        amount: amount,
        category_id: category_id,
        updated_at: new Date(),
        updated_by: updated_by,
      },
      select:{
        id: true,
        amount: true,
        category_id: true
      }
    })


    return goal;

  }
}

export { UpdateGoalService }