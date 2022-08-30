/*
  Warnings:

  - Added the required column `jobTitle` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Employee` ADD COLUMN `jobTitle` VARCHAR(255) NOT NULL;
