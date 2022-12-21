import prismaClient from "../../prisma";
import { CategoryRequest } from "../category/ListCategoryService";
import { PeriodRequest } from "../period/ListPeriodService";

interface GoalPeriodRequest{
  id?: string,
  amount?: number;
  category_id?: string;
  period_id?: string;
  amount_compare?: string;
  period?: PeriodRequest;
  category?: CategoryRequest;
}


class ListGoalPeriodService{
  async execute({ id, amount, category_id, period_id, amount_compare, period, category}: GoalPeriodRequest){
    
    let query = {
      where:{
      },
      include:{
        category:true,
        period:true,
      }
    };

    if(id) query.where = {...query.where, id:id};
    if((amount)&&(amount_compare==='=')) query.where = {...query.where, amount:amount};
    if((amount)&&(amount_compare==='>='))
      query.where = {...query.where, amount:{gt:amount-0.01}};
    if((amount)&&(amount_compare==='<='))
      query.where = {...query.where, amount:{lt:amount+0.01}};
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
    if(period){
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
    const goalPeriod = await prismaClient.goalPeriod.findMany(query);
    return goalPeriod;

  }
}

export { ListGoalPeriodService }