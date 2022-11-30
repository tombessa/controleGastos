import prismaClient from "../../prisma";

class ListCategoryService{
  async execute(){

    const category = await prismaClient.category.findMany({
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

export { ListCategoryService }