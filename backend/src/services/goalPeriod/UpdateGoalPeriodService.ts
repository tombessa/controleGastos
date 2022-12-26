import internal from "stream";
import prismaClient from "../../prisma";

interface GoalPeriodRequest{
  id: string,
  amount: number;
  period_id: string;
  category_id: string;
  updated_by: string;
}

class UpdateGoalPeriodService{
  async execute({ id, amount, category_id, period_id,  updated_by}: GoalPeriodRequest){

    if(!id)throw new Error('Id invalid')
    if(amount===undefined)throw new Error('Amount invalid')
    if(!period_id)throw new Error('Period invalid')
    if(!category_id)throw new Error('Period invalid')

    const goalPeriod = await prismaClient.goalPeriod.update({
      where:{
        id: id
      },
      data:{
        amount: amount,
        period_id: period_id,
        category_id: category_id,
        updated_at: new Date(),
        updated_by: updated_by,
      },
      select:{
        id: true,
        amount: true,
        period_id: true,
        category_id: true
      }
    })


    return goalPeriod;

  }
}

export { UpdateGoalPeriodService }