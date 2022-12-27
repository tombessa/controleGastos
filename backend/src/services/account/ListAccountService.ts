import prismaClient from "../../prisma";
import { EarnResumeAccountRequest, ListEarnService } from "../earn/ListEarnService";
import { ExpenseResumeAccountRequest, ListExpenseService } from "../expense/ListExpenseService";
import { PeriodRequest } from "../period/ListPeriodService";

interface AccountRequest{
  id?:string,
  name?: string;
  type?: string;
  created_by: string;
}
export {AccountRequest}

interface AccountResumeRequest{
  expense: ExpenseResumeAccountRequest;
  earn: EarnResumeAccountRequest;
  period: PeriodRequest;
  created_by: string;
}

class ListAccountService{
  formatDate(dateParam : Date){
    var mm = dateParam.getMonth() + 1;
    var month = (mm>9 ? '' : '0') + mm;
    var dd = dateParam.getDate();
    var day = (dd>9 ? '' : '0') + dd;
    return day+"/"+month+"/"+dateParam.getFullYear();
  }
  
  async resume({expense, earn, period, created_by}: AccountResumeRequest){
    if(!expense.account) new Error("Account invalid")
    if(!earn.account) new Error("Account invalid")
    if(expense.account.name!==earn.account.name) new Error("Account inconsistent between Expense and Earn")
    if(expense.account.type!==earn.account.type) new Error("Account inconsistent between Expense and Earn")
    let query = {
      where:{
        
      },
      
    }
    
    query.where = {...query.where, created_by:created_by};
    query.where = {...query.where, name:expense.account.name};
    query.where = {...query.where, type:expense.account.type};
    const accountReturn = await prismaClient.account.findMany(query);
    //Adding the Resume
    let account = earn.account;
    const earns = await new ListEarnService().list({period, account, created_by});
    const totalEarns = await new ListEarnService().resumByPeriod({period, account, created_by});
    account = expense.account;
    const expenses = await new ListExpenseService().list({period, account, created_by});
    expenses.forEach(t=> t.value = -1*t.value);
    const totalExpenses = await new ListExpenseService().resumByPeriod({period, account, created_by});

    const extrato = [];
    earns.forEach(t => extrato.push({...t, dateFormat: this.formatDate(t.date)}));
    expenses.forEach(t => extrato.push({...t, dateFormat: this.formatDate(t.date)}));
    extrato.sort((a,b) => (a.date.getDate() > b.date.getDate()) ? 1 : ((b.date.getDate() > a.date.getDate()) ? -1 : 0));
    
    return {accountReturn, totalEarns,totalExpenses, extrato};
  }

  async execute({id,type,name, created_by}:AccountRequest){

    let query = {
      where:{
        
      },
      select:{
        id: true,
        name: true,
        type: true
      }
    }
    query.where = {...query.where, created_by:created_by};
    if(id) query.where = {...query.where, id:id};
    if(type) query.where = {...query.where, type:type};
    if(name) query.where = {...query.where, name:name};
    const account = await prismaClient.account.findMany(query);
    return account;

  }
}

export { ListAccountService }