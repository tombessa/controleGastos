import prismaClient from "../../prisma";

interface CategoryRequest{
  id: string,
  name: string;
  expense: boolean;
  includeGoal: boolean;
  priority: number;
  updated_by: string;
}


class ListCategoryService{
  async execute({ id, name, expense, includeGoal, priority}: CategoryRequest){
    let query = {      
      select:{
        id: true,
        name: true,
        expense: true,
        includeGoal: true
      }
    };

    const category = await prismaClient.category.findMany(query)

    return category;

  }
}

export { ListCategoryService }