import prismaClient from "../../prisma";
import { AccountRequest } from "../account/ListAccountService";
import {ListCategoryService} from "../category/ListCategoryService";
import { ListGoalPeriodService } from "../goalPeriod/ListGoalPeriodService";
import { ListAccountService } from "../account/ListAccountService";

interface EarnRequest{
  date: string;
  description: string;
  value: number;
  category_id: string;
  goal_period_id: string;
  bank_id: string;
  account: AccountRequest;
  created_by: string;
  updated_by: string;
}

class CreateEarnService{
  async execute({ date, description, value, category_id, goal_period_id, bank_id, account, created_by, updated_by}: EarnRequest){

    if(date === undefined) throw new Error('Date invalid')
    if((goal_period_id === undefined) && (category_id)){
      //Try to get goalPeriodId by Date
      try{
        const year = Number(date.substring(0,4));
        const month = Number(date.substring(5,7));
        if((year)&&(month)){
          const period = {year: year, month: month, created_by: created_by};
          const goalPeriodService = new ListGoalPeriodService();
          const goalPeriod = await goalPeriodService.execute({category_id, period, created_by});
          if(goalPeriod){
            if(goalPeriod.length>0) goal_period_id = goalPeriod[0].id;
          }
          
        }
      }catch(e){throw new Error('Goal Period invalid');}
    }
    if(bank_id===undefined){
      try{
        const accountName = account.name;
        const accountType = account.type;
        if((accountName)&&(accountType)){
          const accountService = new ListAccountService();          
          const accounts = await accountService.execute({name: accountName, type: accountType, created_by});
          if(accounts.length>0) bank_id = accounts[0].id;
        }
      }catch(e){throw new Error ('Account invalid')}
    }
    
    if((goal_period_id === undefined)) throw new Error('Goal Period invalid');
    
    if(description === undefined) throw new Error('Description invalid')
    if(value === undefined) throw new Error('Value invalid')
    if(category_id === undefined) throw new Error('Category invalid')
    if(bank_id===undefined) throw new Error ('Account invalid')

    const category = await new ListCategoryService().execute({id:category_id, expense:false, created_by: created_by});
    
    if(category.length===0)throw new Error('Category is not an Earn')

    const earn = await prismaClient.earn.create({
      data:{
        date: date,
        description: description,
        value: value,
        category_id: category_id,
        goal_period_id: goal_period_id,
        bank_id: bank_id,
        created_by: created_by,
        updated_by: updated_by,
      },
      include:{
        account: true,
        goalPeriod: true,
        category: true
      }
    })

    return earn;

  }
}

export { CreateEarnService }