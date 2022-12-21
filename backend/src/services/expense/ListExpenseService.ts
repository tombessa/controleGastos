import prismaClient from "../../prisma";
import { AccountRequest } from "../account/ListAccountService";
import { ListGoalPeriodService } from "../goalPeriod/ListGoalPeriodService";
import {  PeriodRequest } from "../period/ListPeriodService";

interface ExpenseRequest{
  id?: string,
  date?: string;
  description?: string;
  value?: number;
  category_id?: string;
  goal_period_id?: string;
  date_compare?: string;
  date_ini?: string;
  date_fim?: string;
  account?: AccountRequest;
  created_by: string;
}
interface ExpenseResumeRequest{
  period: PeriodRequest;
}


class ListExpenseService{

  async resume({period}: ExpenseResumeRequest){
    let goal_period_id = undefined;
    if(period){
      const goalPeriodService = new ListGoalPeriodService();
      const goalPeriods = await goalPeriodService.execute({period});
      if(goalPeriods.length>0) goal_period_id = goalPeriods[0].id;
    }
    const expense = await prismaClient.expense.groupBy({
      by: ['category_id'],
      _sum:{
        value: true,
      },
      where:{
        goal_period_id: goal_period_id
      }
    });
    return expense;
  }

  async execute({ id, date, description, value, category_id, goal_period_id, date_compare,date_ini, date_fim, created_by, account}: ExpenseRequest){

    let query = {
      where:{
      },
      include:{
        category: true,
        goalPeriod: true,
        account: true
      }
    };
    if(account){
      if(account.id) query.where = {...query.where, 
        account:{...account,
          id:account.id
        }
      };
      if(account.type) query.where = {...query.where, 
        account:{...account,
          type:account.type
        }
      };
      if(account.name) query.where = {...query.where, 
        account:{...account,
          name:account.name
        }
      };
    }
    query.where = {...query.where, created_by:created_by};
    if(id) query.where = {...query.where, id:id};
    if(description) query.where = {...query.where, description:description};
    if(value) query.where = {...query.where, value:value};
    if(category_id) query.where = {...query.where, category_id:category_id};
    if(goal_period_id) query.where = {...query.where, goal_period_id:goal_period_id};

    //Compare one Date
    if(date_compare){
      if(date_compare==='=') query.where = {...query.where, date:date};
      if(date_compare==='>') query.where = {...query.where, date:{gt:date}};
      if(date_compare==='<') query.where = {...query.where, date:{lt:date}};
      if(date_compare==='=>') query.where = {...query.where, date:{gte:date}};
      if(date_compare==='=<') query.where = {...query.where, date:{lte:date}};
    }
    if((date_ini)&&(date_fim)) query.where = {...query.where, date:{gte:date_ini,lte:date_fim}};

    const expense = await prismaClient.expense.findMany(query);
    return expense;

  }
}

export { ListExpenseService }