-- CreateEnum
CREATE TYPE "SecretType" AS ENUM ('SECRET_KEY', 'PUBLISHABLE_KEY');

-- CreateEnum
CREATE TYPE "UsageType" AS ENUM ('EVENT', 'WEBHOOK', 'API_CALL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secret" (
    "id" TEXT NOT NULL,
    "type" "SecretType" NOT NULL,
    "secret" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Secret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditUsage" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "type" "UsageType" NOT NULL,
    "credits" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeriodCreditUsage" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "credits" BIGINT NOT NULL DEFAULT 0,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeriodCreditUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_stripeId_key" ON "Account"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "Secret_secret_key" ON "Secret"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "Secret_hash_key" ON "Secret"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "PeriodCreditUsage_appId_start_end_key" ON "PeriodCreditUsage"("appId", "start", "end");

-- AddForeignKey
ALTER TABLE "Secret" ADD CONSTRAINT "Secret_appId_fkey" FOREIGN KEY ("appId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditUsage" ADD CONSTRAINT "CreditUsage_appId_fkey" FOREIGN KEY ("appId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
