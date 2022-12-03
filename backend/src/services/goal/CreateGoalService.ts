import prismaClient from "../../prisma";
import {ListGoalService} from "./ListGoalService";

interface GoalRequest{
  amount: number,
  created_by: string,
  updated_by:string
  category_id: string
}

class CreateGoalService{
  async execute({ amount, created_by, updated_by, category_id}: GoalRequest){
    
    if(!amount)throw new Error('amount invalid')

    //Verify first if exists
    const listGoalService = new ListGoalService();
    const goalExists = await listGoalService.execute({ id: null, amount: null, category_id: category_id, amount_compare:"="});

    if(goalExists) if(goalExists[0]) return goalExists[0];

    let create = {
      data:{
        amount: amount,
        category_id: category_id,
        created_by: created_by,
        updated_by: updated_by
      },
      select:{
        id: true,
        amount: true,
        category_id: true
      }
    }

    const goal = await prismaClient.goal.create(create)


    return goal;

  }
}

export { CreateGoalService }