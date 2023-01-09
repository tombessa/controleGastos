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

  lastPeriod(period: PeriodRequest){
    if(period.month==1){
      return {month: 12, year: period.year-1};
    }else{
      return {month: period.month-1, year: period.year};
    }
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

    let usePeriod = false; 
    if(period) usePeriod = true;
    
    query.where = {...query.where, created_by:created_by};
    query.where = {...query.where, name:expense.account.name};
    query.where = {...query.where, type:expense.account.type};
    const accountReturn = await prismaClient.account.findMany(query);
    //Adding the Resume
    let account = earn.account;
    const earns = await new ListEarnService().list({period, account, created_by});
    let totalEarns = undefined;
    let totalEarnsLastPeriod = undefined;
    let totalEarnsUntilLastPeriod = await new ListEarnService().resumUntilPeriod({period, account, created_by});
    if(usePeriod){
      totalEarns = await new ListEarnService().resumByPeriod({period, account, created_by});
      const paramEarnLast = {period: this.lastPeriod(period), account: account, created_by: created_by} as EarnResumeAccountRequest;
      totalEarnsLastPeriod = await new ListEarnService().resumByPeriod(paramEarnLast);
    }


    account = expense.account;
    const expenses = await new ListExpenseService().list({period, account, created_by});
    expenses.forEach(t=> t.value = -1*t.value);
    let totalExpenses = undefined;
    let totalExpensesLastPeriod = undefined;
    let totalExpensesUntilLastPeriod = await new ListExpenseService().resumUntilPeriod({period, account, created_by});
    if(usePeriod){
      totalExpenses = await new ListExpenseService().resumByPeriod({period, account, created_by});
      const paramExpenseLast = {period: this.lastPeriod(period), account: account, created_by: created_by} as ExpenseResumeAccountRequest;
      totalExpensesLastPeriod = await new ListExpenseService().resumByPeriod(paramExpenseLast);
    }

    const extrato = [];
    earns.forEach(t => extrato.push({...t, dateFormat: this.formatDate(t.date)}));
    expenses.forEach(t => extrato.push({...t, dateFormat: this.formatDate(t.date)}));
    extrato.sort((a,b) => (a.date.getDate() > b.date.getDate()) ? 1 : ((b.date.getDate() > a.date.getDate()) ? -1 : 0));
    
    return {accountReturn, totalEarnsUntilLastPeriod, totalEarnsLastPeriod, totalEarns, totalExpensesUntilLastPeriod, totalExpensesLastPeriod, totalExpenses, extrato};
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