import prismaClient from "../../prisma";

interface CategoryRequest{
  name: string;
  expense: boolean;
  includeGoal: boolean;
  created_by: string;
  updated_by: string;
}

class CreateCategoryService{
  async execute({ name, expense, includeGoal, created_by, updated_by}: CategoryRequest){
    
    if(name === ''){
      throw new Error('Name invalid')
    }

    const category = await prismaClient.category.create({
      data:{
        name: name,
        expense: expense,
        includeGoal: includeGoal,
        created_by: created_by,
        updated_by: updated_by,
      },
      select:{
        id: true,
        name: true,
        expense: true,
        includeGoal: true
      }
    })


    return category;

  }
}

export { CreateCategoryService }