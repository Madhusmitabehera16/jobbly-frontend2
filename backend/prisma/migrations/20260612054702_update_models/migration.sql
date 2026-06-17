-- AlterTable
ALTER TABLE "JobTarget" ADD COLUMN     "jobReadinessScore" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ResumeAnalysis" ADD COLUMN     "matchPercentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "SkillGap" ADD COLUMN     "learningPriority" TEXT NOT NULL DEFAULT 'Medium',
ADD COLUMN     "weakSkills" TEXT[] DEFAULT ARRAY[]::TEXT[];
