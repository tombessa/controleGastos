import prismaClient from "../../prisma";

interface CategoryRequest{
  id?: string,
  name?: string;
  expense?: boolean;
  includeGoal?: boolean;
  priority?: number;
}


class ListCategoryService{
  async execute({ id, name, expense, includeGoal, priority}: CategoryRequest){

    let query = {
      where:{
      },
      select:{
        id: true,
        name: true,
        expense: true,
        includeGoal: true
      }
    };
    if(id) query.where = {...query.where, id:id};
    if(name) query.where = {...query.where, name:name};
    if(expense!==undefined) query.where = {...query.where, expense:expense};
    if(includeGoal) query.where = {...query.where, expense:includeGoal};
    if(priority) query.where = {...query.where, expense:priority};

    const category = await prismaClient.category.findMany(query);
    return category;

  }
}

export { ListCategoryService }