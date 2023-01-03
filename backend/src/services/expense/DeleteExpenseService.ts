import prismaClient from "../../prisma";

interface ExpenseRequest{
    id: string
}


class DeleteExpenseService{
    async execute({id}: ExpenseRequest){
        if(id === undefined) throw new Error('Id invalid')
        const expense = await prismaClient.expense.delete({
            where:{
                id: id,
            }
        });
        return expense;
    }
}

export {DeleteExpenseService}