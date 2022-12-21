/*
  Warnings:

  - Added the required column `bank_id` to the `earn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_id` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "earn" ADD COLUMN     "bank_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "bank_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "earn" ADD CONSTRAINT "earn_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
