/*
  Warnings:

  - You are about to drop the column `period_id` on the `earn` table. All the data in the column will be lost.
  - You are about to drop the column `period_id` on the `expenses` table. All the data in the column will be lost.
  - Added the required column `goal_period_id` to the `earn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goal_period_id` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "earn" DROP CONSTRAINT "earn_period_id_fkey";

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_period_id_fkey";

-- AlterTable
ALTER TABLE "earn" DROP COLUMN "period_id",
ADD COLUMN     "goal_period_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "period_id",
ADD COLUMN     "goal_period_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_goal_period_id_fkey" FOREIGN KEY ("goal_period_id") REFERENCES "goalPeriods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "earn" ADD CONSTRAINT "earn_goal_period_id_fkey" FOREIGN KEY ("goal_period_id") REFERENCES "goalPeriods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
