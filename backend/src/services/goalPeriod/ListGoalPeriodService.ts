import prismaClient from "../../prisma";

interface GoalPeriodRequest{
  id?: string,
  amount?: number;
  category_id?: string;
  period_id?: string;
  amount_compare?: string;
}


class ListGoalPeriodService{
  async execute({ id, amount, category_id, period_id, amount_compare}: GoalPeriodRequest){

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

    const goalPeriod = await prismaClient.goalPeriod.findMany(query);
    return goalPeriod;

  }
}

export { ListGoalPeriodService }