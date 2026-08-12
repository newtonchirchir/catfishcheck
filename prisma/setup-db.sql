CREATE TYPE "ScanStatus" AS ENUM (
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED'
);

CREATE TYPE "RiskLevel" AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH'
);

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Scan" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "status" "ScanStatus" NOT NULL DEFAULT 'PENDING',
  "aiGenerated" BOOLEAN,
  "aiConfidence" DOUBLE PRECISION,
  "manipulationDetected" BOOLEAN,
  "reuseDetected" BOOLEAN,
  "riskLevel" "RiskLevel",
  "explanation" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key"
ON "User"("email");

CREATE INDEX "User_email_idx"
ON "User"("email");

CREATE INDEX "Scan_userId_idx"
ON "Scan"("userId");

CREATE INDEX "Scan_status_idx"
ON "Scan"("status");

CREATE INDEX "Scan_createdAt_idx"
ON "Scan"("createdAt");

ALTER TABLE "Scan"
ADD CONSTRAINT "Scan_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
