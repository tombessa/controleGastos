import prismaClient from "../../prisma";
import {ListGoalPeriodService} from "./ListGoalPeriodService";

interface GoalPeriodRequest{
  amount: number;
  created_by: string;
  updated_by:string;
  category_id: string;
  period_id: string;
}

class CreateGoalPeriodService{
  async execute({ amount, created_by, updated_by, category_id, period_id}: GoalPeriodRequest){
    
    if(amount===undefined)throw new Error('amount invalid')

    //Verify first if exists the Goal Period
    const listGoalPeriodService = new ListGoalPeriodService();
    const goalPeriodExists = await listGoalPeriodService.execute({ id: null, amount: null, category_id:category_id, period_id: period_id, amount_compare:null, created_by: created_by});

    if(goalPeriodExists) if(goalPeriodExists[0]) return goalPeriodExists[0];

    let create = {
      data:{
        amount: amount,
        category_id: category_id,
        period_id: period_id,
        created_by: created_by,
        updated_by: updated_by
      },
      select:{
        id: true,
        amount: true,
        period_id: true,
        category_id: true
      }
    }

    const goalPeriod = await prismaClient.goalPeriod.create(create)


    return goalPeriod;

  }
}

export { CreateGoalPeriodService }