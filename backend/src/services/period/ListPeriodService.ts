import prismaClient from "../../prisma";

interface PeriodRequest{
  id?: string,
  month?: number;
  year?: number;
  created_by: string;
}

export {PeriodRequest};

class ListPeriodService{
  async findFirst({ id, month, year, created_by}: PeriodRequest){
    let query = {
      where:{
      },
      select:{
        id: true,
        month: true,
        year: true
      }
    };
    query.where = {...query.where, created_by:created_by};
    const period = await prismaClient.period.findFirst(query);    
    return period;
  }


  async execute({ id, month, year, created_by}: PeriodRequest){

    let query = {
      where:{
      },
      select:{
        id: true,
        month: true,
        year: true
      }
    };
    
    query.where = {...query.where, created_by:created_by};
    if(id) query.where = {...query.where, id:id};
    if(month) query.where = {...query.where, month:month};
    if(year) query.where = {...query.where, year:year};
    const period = await prismaClient.period.findMany(query);    
    return period;

  }
}

export { ListPeriodService }