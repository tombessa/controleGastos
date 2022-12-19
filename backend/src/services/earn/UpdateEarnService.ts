import internal from "stream";
import prismaClient from "../../prisma";

interface EarnRequest{
  id: string;
  date: string;
  description: string;
  value: number;
  category_id: string;
  goal_period_id: string;
  updated_by: string;
}

class UpdateEarnService{
  async execute({ id, date, description, value, category_id, goal_period_id,  updated_by}: EarnRequest){

    if(!id)throw new Error('Id invalid')
    if(!date)throw new Error('Date invalid')
    if(!description)throw new Error('Description invalid')
    if(!value)throw new Error('Value invalid')
    if(!category_id)throw new Error('Category invalid')
    if(!goal_period_id)throw new Error('Goal Period invalid')

    const earn = await prismaClient.earn.update({
      where:{
        id: id
      },
      data:{
        date: date,
        description: description,
        value: value,
        category_id: category_id,
        goal_period_id: goal_period_id,
        updated_at: new Date(),
        updated_by: updated_by,
      },
      include:{
        goalPeriod: true,
        category: true
      }
    })


    return earn;

  }
}

export { UpdateEarnService }