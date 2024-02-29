/*
  Warnings:

  - The `lama_sewa` column on the `rent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `rent` DROP COLUMN `lama_sewa`,
    ADD COLUMN `lama_sewa` INTEGER NOT NULL DEFAULT 0;
