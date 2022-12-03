import internal from "stream";
import prismaClient from "../../prisma";

interface ExpenseRequest{
  id: string;
  date: string;
  description: string;
  value: number;
  category_id: string;
  period_id: string;
  updated_by: string;
}

class UpdateExpenseService{
  async execute({ id, date, description, value, category_id, period_id,  updated_by}: ExpenseRequest){

    if(!id)throw new Error('Id invalid')
    if(!date)throw new Error('Date invalid')
    if(!description)throw new Error('Description invalid')
    if(!value)throw new Error('Value invalid')
    if(!category_id)throw new Error('Category invalid')
    if(!period_id)throw new Error('Period invalid')

    const expense = await prismaClient.expense.update({
      where:{
        id: id
      },
      data:{
        date: date,
        description: description,
        value: value,
        category_id: category_id,
        period_id: period_id,
        updated_at: new Date(),
        updated_by: updated_by,
      },
      include:{
        period: true,
        category: true
      }
    })


    return expense;

  }
}

export { UpdateExpenseService }