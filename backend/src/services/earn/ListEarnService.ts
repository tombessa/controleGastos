import prismaClient from "../../prisma";
import { AccountRequest } from "../account/ListAccountService";
import {  PeriodRequest } from "../period/ListPeriodService";

import { ListGoalPeriodService } from "../goalPeriod/ListGoalPeriodService";

interface EarnRequest{
  id?: string,
  date?: string;
  description?: string;
  value?: number;
  category_id?: string;
  goal_period_id?: string;
  date_compare?: string;
  date_ini?: string;
  date_fim?: string;
  created_by: string;
  account: AccountRequest;
}

interface EarnResumeRequest{
  period: PeriodRequest;
  created_by: string;
}

interface EarnResumeAccountRequest{
  period: PeriodRequest;
  account: AccountRequest;
  created_by: string;
}
export {EarnResumeAccountRequest};

class ListEarnService{

  async list({period, account, created_by}: EarnResumeAccountRequest){
    let goalPeriodList = [];
    if((!account.name)&&(!account.type)) new Error("Account invalid")
    if(period){
      const goalPeriodService = new ListGoalPeriodService();
      const goalPeriods = await goalPeriodService.execute({period, created_by});

      if(goalPeriods.length>0) goalPeriods.forEach(itemPeriod => goalPeriodList.push(itemPeriod.id));
    }

    const earn = await prismaClient.earn.findMany({
      where:{
        goal_period_id: {in: goalPeriodList},
        account: {name: account.name, type: account.type},
        created_by: created_by
      },
      include:{
        category: true
      }
    });
    return earn;
  }

  async resumByPeriod({period, account, created_by}: EarnResumeAccountRequest){
    let goalPeriodList = [];
    if((!account.name)&&(!account.type)) new Error("Account invalid")
    if(period){
      const goalPeriodService = new ListGoalPeriodService();
      const goalPeriods = await goalPeriodService.execute({period, created_by});

      if(goalPeriods.length>0) goalPeriods.forEach(itemPeriod => goalPeriodList.push(itemPeriod.id));
    }

    const earn = await prismaClient.earn.aggregate( {
      _sum:{
        value: true,
      },
      where:{
        goal_period_id: {in: goalPeriodList},
        account: {name: account.name, type: account.type},
        created_by: created_by
      }
    });
    return earn;
  }

  async resume({period, created_by}: EarnResumeRequest){
    let goalPeriodList = [];

    if(period){
      const goalPeriodService = new ListGoalPeriodService();
      const goalPeriods = await goalPeriodService.execute({period, created_by});

      if(goalPeriods.length>0) goalPeriods.forEach(itemPeriod => goalPeriodList.push(itemPeriod.id));
    }
    
    const expense = await prismaClient.earn.groupBy({
      by: ['category_id'],
      _sum:{
        value: true,
      },
      where:{
        goal_period_id: {in: goalPeriodList},
        created_by: created_by
      }
    });
    return expense;
  }

  async execute({ id, date, description, value, category_id, goal_period_id, date_compare,date_ini, date_fim, created_by, account}: EarnRequest){

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
    query.where = {...query.where, created_by: created_by};
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

    const earn = await prismaClient.earn.findMany(query);
    return earn;

  }
}

export { ListEarnService }