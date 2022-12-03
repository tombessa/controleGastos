import prismaClient from "../../prisma";

interface PeriodRequest{
  month: number;
  year: number;
  created_by: string;
  updated_by: string;
}

class CreatePeriodService{
  async execute({ month, year, created_by, updated_by}: PeriodRequest){
    
    if(!month)throw new Error('Month invalid')
    if(!year)throw new Error('Year invalid')

    const period = await prismaClient.period.create({
      data:{
        month: month,
        year: year,
        created_by: created_by,
        updated_by: updated_by,
      },
      select:{
        id: true,
        month: true,
        year: true
      }
    })


    return period;

  }
}

export { CreatePeriodService }