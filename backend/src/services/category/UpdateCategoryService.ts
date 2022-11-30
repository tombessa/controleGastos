import internal from "stream";
import prismaClient from "../../prisma";

interface CategoryRequest{
  id: string,
  name: string;
  expense: boolean;
  includeGoal: boolean;
  priority: number;
  updated_by: string;
}

class UpdateCategoryService{
  async execute({ id, name, expense, includeGoal, priority,  updated_by}: CategoryRequest){
    
    if(name === ''){
      throw new Error('Name invalid')
    }

    const category = await prismaClient.category.update({
      where:{
        id: id
      },
      data:{
        name: name,
        expense: expense,
        priority: priority,
        includeGoal: includeGoal,
        updated_at: new Date(),
        updated_by: updated_by,
      },
      select:{
        id: true,
        name: true,
        expense: true,
        priority: true,
        includeGoal: true
      }
    })


    return category;

  }
}

export { UpdateCategoryService }