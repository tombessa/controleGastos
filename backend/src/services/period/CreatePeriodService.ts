import prismaClient from "../../prisma";
import { ListGoalService } from "../goal/ListGoalService";
import { CreateGoalPeriodService } from "../goalPeriod/CreateGoalPeriodService";
import { ListPeriodService } from "./ListPeriodService";

interface PeriodRequest{
  month: number;
  year: number;
  created_by: string;
  updated_by: string;
}

class CreatePeriodService{
  async execute({ month, year, created_by, updated_by}: PeriodRequest){
    
    if(!month)throw new Error('Month invalid')
    if(!year)throw new Error('Year invalid')

    //Verify if exists
    const periodExists = await new ListPeriodService().execute({month, year, created_by});
    let period;
    if(periodExists.length===0){
      period = await prismaClient.period.create({
        data:{
          month: month,
          year: year,
          created_by: created_by,
          updated_by: updated_by,
        },
        select:{
          id: true,
          month: true,
          year: true
        }
      });
      //Quando se cria um período, automaticamente, cria-se seus objetivos
      const listGoal = new ListGoalService();
      const goals = await listGoal.execute({created_by});
      goals.forEach(goal => {
        const createGoalPeriod = new CreateGoalPeriodService();
        const category_id = goal.category_id;
        const period_id = period.id;
        const amount = goal.amount;
        createGoalPeriod.execute({amount, category_id, period_id, created_by, updated_by});
      });
    }else period = periodExists[0];
    

    return period;

  }
}

export { CreatePeriodService }