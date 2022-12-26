import prismaClient from "../../prisma";
import { ListCategoryService } from "./ListCategoryService";
import { UpdateCategoryService } from "./UpdateCategoryService";

interface CategoryRequest{
  name: string;
  expense: boolean;
  includeGoal: boolean;
  priority: number;
  created_by: string;
  updated_by: string;
}

class CreateCategoryService{
  async execute({ name, expense, priority, includeGoal, created_by, updated_by}: CategoryRequest){
    
    if(name === ''){
      throw new Error('Name invalid')
    }

    //Verify if exists
    let listCategory = await new ListCategoryService().execute({name, created_by});
    let category={};
    if(listCategory.length>0){
      //Update it
      const id = listCategory[0].id;
      category = await new UpdateCategoryService().execute({ id, name, expense, priority, includeGoal, updated_by});
    }else{
      category = await prismaClient.category.create({
        data:{
          name: name,
          expense: expense,
          priority: priority,
          includeGoal: includeGoal,
          created_by: created_by,
          updated_by: updated_by,
        },
        select:{
          id: true,
          name: true,
          expense: true,
          priority: true,
          includeGoal: true
        }
      });
    }

    return category;

  }
}

export { CreateCategoryService }