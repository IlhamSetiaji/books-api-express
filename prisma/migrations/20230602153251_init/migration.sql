-- AlterTable
ALTER TABLE `user` ADD COLUMN `emailVerifiedAt` DATETIME(3) NULL,
    ADD COLUMN `token` VARCHAR(191) NULL;
