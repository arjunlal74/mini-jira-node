-- AlterTable
ALTER TABLE `user` ADD COLUMN `merchant_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
