import internal from "stream";
import prismaClient from "../../prisma";

interface PeriodRequest{
  id: string,
  month: number;
  year: number;
  updated_by: string;
}

class UpdatePeriodService{
  async execute({ id, month, year,  updated_by}: PeriodRequest){

    if(!id)throw new Error('Id invalid')
    if(!month)throw new Error('Month invalid')
    if(!year)throw new Error('Year invalid')

    const period = await prismaClient.period.update({
      where:{
        id: id
      },
      data:{
        month: month,
        year: year,
        updated_at: new Date(),
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

export { UpdatePeriodService }