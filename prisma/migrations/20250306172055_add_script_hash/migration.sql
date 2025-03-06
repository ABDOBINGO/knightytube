/*
  Warnings:

  - Added the required column `hash` to the `Script` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Script" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "youtubeUrl" TEXT,
    "transcript" TEXT,
    "enhancedScript" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hash" TEXT NOT NULL,
    CONSTRAINT "Script_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Script" ("content", "createdAt", "enhancedScript", "id", "title", "transcript", "updatedAt", "userId", "youtubeUrl") SELECT "content", "createdAt", "enhancedScript", "id", "title", "transcript", "updatedAt", "userId", "youtubeUrl" FROM "Script";
DROP TABLE "Script";
ALTER TABLE "new_Script" RENAME TO "Script";
CREATE UNIQUE INDEX "Script_hash_key" ON "Script"("hash");
CREATE INDEX "Script_hash_idx" ON "Script"("hash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
