import prismaClient from "../../prisma";

interface PeriodRequest{
  id?: string,
  month?: number;
  year?: number;
}


class ListPeriodService{
  async execute({ id, month, year}: PeriodRequest){

    let query = {
      where:{
      },
      select:{
        id: true,
        month: true,
        year: true
      }
    };
    if(id) query.where = {...query.where, id:id};
    if(month) query.where = {...query.where, month:month};
    if(year) query.where = {...query.where, year:year};
    const period = await prismaClient.period.findMany(query);
    return period;

  }
}

export { ListPeriodService }