import prismaClient from "../../prisma";

interface EarnRequest{
    id: string
}


class DeleteEarnService{
    async execute({id}: EarnRequest){
        if(id === undefined) throw new Error('Id invalid')
        const earn = await prismaClient.earn.delete({
            where:{
                id: id,
            }
        });
        return earn;
    }
}

export {DeleteEarnService}