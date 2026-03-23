-- CreateTable
CREATE TABLE "list_address" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "ip_address" VARCHAR(45),
    "createdById" INTEGER,

    CONSTRAINT "list_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entrances" (
    "id" SERIAL NOT NULL,
    "name_entrance" VARCHAR(100) NOT NULL,
    "port" INTEGER NOT NULL,
    "ip" VARCHAR(45),
    "passwordId" INTEGER,
    "addressId" INTEGER NOT NULL,

    CONSTRAINT "entrances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_passwords" (
    "id" SERIAL NOT NULL,
    "encrypted_password" TEXT NOT NULL,
    "password_hash" VARCHAR(64) NOT NULL,

    CONSTRAINT "device_passwords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "list_address_address_key" ON "list_address"("address");

-- CreateIndex
CREATE UNIQUE INDEX "entrances_addressId_name_entrance_key" ON "entrances"("addressId", "name_entrance");

-- CreateIndex
CREATE UNIQUE INDEX "device_passwords_password_hash_key" ON "device_passwords"("password_hash");

-- AddForeignKey
ALTER TABLE "list_address" ADD CONSTRAINT "list_address_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrances" ADD CONSTRAINT "entrances_passwordId_fkey" FOREIGN KEY ("passwordId") REFERENCES "device_passwords"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrances" ADD CONSTRAINT "entrances_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "list_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
