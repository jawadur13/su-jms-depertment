-- AlterTable
ALTER TABLE "about_innovation_hub" RENAME CONSTRAINT "about_mecha_club_pkey" TO "about_innovation_hub_pkey";

-- AlterTable
ALTER TABLE "innovation_hub_application" RENAME CONSTRAINT "mecha_club_application_pkey" TO "innovation_hub_application_pkey";

-- CreateTable
CREATE TABLE "admission_lead_popup_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "delaySeconds" INTEGER NOT NULL DEFAULT 15,
    "heading" TEXT NOT NULL,
    "subheading" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "footerNote" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admission_lead_popup_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admission_lead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "programName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admission_lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admission_lead_status_submittedAt_idx" ON "admission_lead"("status", "submittedAt");

-- CreateIndex
CREATE INDEX "admission_lead_submittedAt_idx" ON "admission_lead"("submittedAt");

-- RenameIndex
ALTER INDEX "mecha_club_application_status_submittedAt_idx" RENAME TO "innovation_hub_application_status_submittedAt_idx";

-- RenameIndex
ALTER INDEX "mecha_club_application_submittedAt_idx" RENAME TO "innovation_hub_application_submittedAt_idx";
