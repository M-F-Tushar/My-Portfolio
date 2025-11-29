-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "resumeUrl" TEXT,
    "avatarUrl" TEXT,
    "aboutImage" TEXT,
    "yearsOfExperience" TEXT NOT NULL DEFAULT '0+',
    "modelsDeployed" TEXT NOT NULL DEFAULT '0+',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Profile" ("aboutImage", "avatarUrl", "bio", "createdAt", "email", "id", "location", "name", "resumeUrl", "summary", "title", "updatedAt") SELECT "aboutImage", "avatarUrl", "bio", "createdAt", "email", "id", "location", "name", "resumeUrl", "summary", "title", "updatedAt" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
