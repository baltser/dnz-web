/*
  Warnings:

  - You are about to drop the column `user_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_user_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "user_id",
ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
