/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `banks` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_id` on the `banks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "banks" DROP COLUMN "created_by_id",
DROP COLUMN "updated_by_id",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;
