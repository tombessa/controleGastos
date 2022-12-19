import prismaClient from "../../prisma";

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
}


class ListEarnService{
  async execute({ id, date, description, value, category_id, goal_period_id, date_compare,date_ini, date_fim}: EarnRequest){

    let query = {
      where:{
      },
      include:{
        category: true,
        goalPeriod: true
      }
    };

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