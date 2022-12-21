import internal from "stream";
import prismaClient from "../../prisma";
import { AccountRequest, ListAccountService } from "../account/ListAccountService";
import { ListGoalPeriodService } from "../goalPeriod/ListGoalPeriodService";

interface EarnRequest{
  id: string;
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

class UpdateEarnService{
  async execute({ id, date, description, value, category_id, goal_period_id,  bank_id, account, created_by, updated_by}: EarnRequest){

    if(id===undefined)throw new Error('Id invalid')
    if(date===undefined)throw new Error('Date invalid')
    if((goal_period_id === undefined) && (category_id)){
      //Try to get goalPeriodId by Date
      try{
        const year = Number(date.substring(0,4));
        const month = Number(date.substring(5,7));
        if((year)&&(month)){
          const period = {year: year, month: month, created_by: created_by};
          const goalPeriodService = new ListGoalPeriodService();
          const goalPeriod = await goalPeriodService.execute({category_id, period});
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

    if(description===undefined)throw new Error('Description invalid')
    if(!value)throw new Error('Value invalid')
    if(category_id===undefined)throw new Error('Category invalid')
    if(goal_period_id===undefined)throw new Error('Goal Period invalid')
    if(bank_id===undefined)throw new Error('Account invalid')

    const earn = await prismaClient.earn.update({
      where:{
        id: id
      },
      data:{
        date: date,
        description: description,
        value: value,
        category_id: category_id,
        goal_period_id: goal_period_id,
        bank_id: bank_id,
        updated_at: new Date(),
        updated_by: updated_by,
      },
      include:{
        goalPeriod: true,
        category: true,
        account: true
      }
    })


    return earn;

  }
}

export { UpdateEarnService }