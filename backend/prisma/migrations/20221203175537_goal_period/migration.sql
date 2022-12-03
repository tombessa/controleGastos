/*
  Warnings:

  - Added the required column `category_id` to the `goalPeriods` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "goalPeriods" ADD COLUMN     "category_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "goalPeriods" ADD CONSTRAINT "goalPeriods_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
