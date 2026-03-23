-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "username" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rule_name" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rules" (
    "rule_name" VARCHAR(55) NOT NULL,

    CONSTRAINT "rules_pkey" PRIMARY KEY ("rule_name")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_rule_name_fkey" FOREIGN KEY ("rule_name") REFERENCES "rules"("rule_name") ON DELETE RESTRICT ON UPDATE CASCADE;
