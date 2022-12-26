import prismaClient from "../../prisma";
import { ListEarnService } from "../earn/ListEarnService";
import { ListExpenseService } from "../expense/ListExpenseService";
import { ListGoalPeriodService } from "../goalPeriod/ListGoalPeriodService";
import { PeriodRequest } from "../period/ListPeriodService";

interface CategoryRequest{
  id?: string,
  name?: string;
  expense?: boolean;
  includeGoal?: boolean;
  priority?: number;
  created_by: string;
}

interface CategoryResumeRequest{
  id?: string,
  name?: string;
  expense?: boolean;
  includeGoal?: boolean;
  priority?: number;
  period: PeriodRequest;
  created_by: string;
}



export {CategoryRequest};

class ListCategoryService{
  
  async resume({ id, name, expense, includeGoal, priority, period, created_by}: CategoryResumeRequest){
    let query = {
      where:{
      },
      include:{
        goalPeriods: true
      }
    };
    query.where = {...query.where, created_by:created_by};
    if(id) query.where = {...query.where, id:id};
    if(name) query.where = {...query.where, name:name};
    if(expense!==undefined) query.where = {...query.where, expense:expense};
    if(includeGoal) query.where = {...query.where, expense:includeGoal};
    if(priority) query.where = {...query.where, expense:priority};
    if(!period) throw new Error('Period invalid');
    /*Filter Period*/
    let period_id_filtered;
    if((period.month)&&(period.year)){
      let category, goalPeriodList;
      if(name) category = {...category, name, created_by};
      goalPeriodList = await new ListGoalPeriodService().execute({period, category});
      if(goalPeriodList.length===0) throw new Error('Period invalid');
      period_id_filtered = goalPeriodList[0].period_id;
    }else throw new Error('Period invalid');

    /*Summarize*/
    let periodSum = [];
    const periodSumExpense = await new ListExpenseService().resume({period});
    const periodSumEarn = await new ListEarnService().resume({period});
    periodSumExpense.forEach(item => periodSum.push(item));
    periodSumEarn.forEach(item => periodSum.push(item));
    const categorySearch = await prismaClient.category.findMany(query);
    let categoryReturn = [];
    categorySearch.forEach(item=>{
      item.goalPeriods = item.goalPeriods.filter(t => t.period_id === period_id_filtered);
      let periodSumList = periodSum.filter(sum => sum.category_id===item.id);
      let periodSumItem={amount:0, total: 0};
      if(periodSumList) if(periodSumList.length>0) periodSumItem = {...periodSumItem, amount: periodSumList[0]._sum.value};
      if(item.goalPeriods) if(item.goalPeriods.length>0) periodSumItem = {...periodSumItem, total: item.goalPeriods[0].amount};
      
      categoryReturn.push({...item, periodSumItem});
    });
    return categoryReturn;

  }

  async execute({ id, name, expense, includeGoal, priority, created_by}: CategoryRequest){

    let query = {
      where:{
      },
      select:{
        id: true,
        name: true,
        expense: true,
        includeGoal: true
      }
    };
    query.where = {...query.where, created_by:created_by};
    if(id) query.where = {...query.where, id:id};
    if(name) query.where = {...query.where, name:name};
    if(expense!==undefined) query.where = {...query.where, expense:expense};
    if(includeGoal) query.where = {...query.where, expense:includeGoal};
    if(priority) query.where = {...query.where, expense:priority};

    const category = await prismaClient.category.findMany(query);
    return category;

  }
}

export { ListCategoryService }