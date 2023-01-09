import prismaClient from "../../prisma";
import { CategoryRequest } from "../category/ListCategoryService";
import { ListPeriodService, PeriodRequest } from "../period/ListPeriodService";

interface GoalPeriodRequest{
  id?: string,
  amount?: number;
  category_id?: string;
  period_id?: string;
  amount_compare?: string;
  period?: PeriodRequest;
  period_compare?: string;
  category?: CategoryRequest;
  created_by: string;
}


class ListGoalPeriodService{

  generatePeriodFromDate(dateParam: Date, dateLimit: Date, forward: Boolean){    
    let periodParam = [];
    
    if(forward){ //para frente
      while(dateParam<dateLimit){
        dateParam.setMonth(dateParam.getMonth() + 1);
        periodParam.push({period:{month: dateParam.getMonth()+1, year: dateParam.getFullYear()}});
        
      }
    }else{
      while(dateParam>dateLimit){
        dateParam.setMonth(dateParam.getMonth() - 1);
        periodParam.push({period:{month: dateParam.getMonth()+1, year: dateParam.getFullYear()}});
      }
    }
    return periodParam;
  }

  async execute({ id, amount, category_id, period_id, amount_compare, period, period_compare, category, created_by}: GoalPeriodRequest){
    
    let query = {
      where:{
      },
      include:{
        category:true,
        period:true,
      }
    };
    query.where = {...query.where, created_by: created_by};
    if(id) query.where = {...query.where, id:id};
    if((amount)&&(amount_compare==='=')) query.where = {...query.where, amount:amount};
    if((amount)&&(amount_compare==='>='))
      query.where = {...query.where, amount:{gte:amount}};
    if((amount)&&(amount_compare==='<='))
      query.where = {...query.where, amount:{lte:amount}};
    if((amount)&&(amount_compare==='>'))
      query.where = {...query.where, amount:{gt:amount}};
    if((amount)&&(amount_compare==='<'))
      query.where = {...query.where, amount:{lt:amount}};

    if(period_id) query.where = {...query.where, period_id:period_id};
    if(category_id) query.where = {...query.where, category_id:category_id};

    if(category){
      if(category.id) query.where = {...query.where, 
        category:{...category,
          id: category.id
        }
      }
      if(category.name) query.where = {...query.where, 
        category:{...category,
          name: category.name
        }
      }
      if(category.expense!==undefined) query.where = {...query.where, 
        category:{...category,
          expense: category.expense
        }
      }
      if(category.includeGoal!==undefined) query.where = {...query.where, 
        category:{...category,
          includeGoal: category.includeGoal
        }
      }
      if(category.priority) query.where = {...query.where, 
        category:{...category,
          priority: category.priority
        }
      }
    }
    let usePeriodCompare = false;
    if(period){      
      if(period_compare) usePeriodCompare = true;
      if(usePeriodCompare){
        
        if((period_compare==='=')&&(period.year)&&(period.month)) query.where = {...query.where, period: {year: period.year, month: period.month}};
        
        let queryPeriod;
        let dateParam = new Date(period.year, period.month-1, 1);
        
        if((period_compare==='<=')||(period_compare==='<')){
          let periodListReturn = await new ListPeriodService().findFirst({created_by});
          let dateLimit  = new Date(periodListReturn.year, periodListReturn.month-1, 1);
          
          let periodParam = this.generatePeriodFromDate(dateParam, dateLimit, false);
          query.where = {...query.where, OR: periodParam};
          
        }else new Error("Period Compare Error. Valid: < or <=")
        
      }else{
        if(period.id) query.where = {...query.where, 
          period:{...period,
            id: period.id
          }
        }
        if(period.year) query.where = {...query.where, 
          period:{...period,
            year: period.year
          }
        }
        if(period.month) query.where = {...query.where, 
          period:{...period,
            month: period.month
          }
        }
      }
    }
    
    const goalPeriod = await prismaClient.goalPeriod.findMany(query);
    
    return goalPeriod;

  }
}

export { ListGoalPeriodService }