import prismaClient from "../../prisma";
import {ListGoalService} from "./ListGoalService";
import { UpdateGoalService } from "./UpdateGoalService";

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
    const goalExists = await listGoalService.execute({ id: null, amount: null, category_id: category_id, amount_compare:null, created_by: created_by});

    let goal;
    if(goalExists) if(goalExists[0]) {
      const id = goalExists[0].id;
      goal = await new UpdateGoalService().execute({id, amount, category_id, updated_by});      
    }else{
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
  
      goal = await prismaClient.goal.create(create);
    }
    return goal;

  }
}

export { CreateGoalService }