/*
  Warnings:

  - You are about to drop the column `password_hash` on the `device_passwords` table. All the data in the column will be lost.
  - You are about to alter the column `encrypted_password` on the `device_passwords` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `ip` on the `entrances` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[encrypted_password]` on the table `device_passwords` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "device_passwords_password_hash_key";

-- AlterTable
ALTER TABLE "device_passwords" DROP COLUMN "password_hash",
ALTER COLUMN "encrypted_password" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "entrances" DROP COLUMN "ip";

-- CreateIndex
CREATE UNIQUE INDEX "device_passwords_encrypted_password_key" ON "device_passwords"("encrypted_password");
