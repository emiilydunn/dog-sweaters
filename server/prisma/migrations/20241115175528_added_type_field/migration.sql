/*
  Warnings:

  - Added the required column `type` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_product" (
    "product_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cost" DECIMAL NOT NULL,
    "colour" TEXT NOT NULL,
    "image_filename" TEXT NOT NULL
);
INSERT INTO "new_product" ("colour", "cost", "description", "image_filename", "name", "product_id") SELECT "colour", "cost", "description", "image_filename", "name", "product_id" FROM "product";
DROP TABLE "product";
ALTER TABLE "new_product" RENAME TO "product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
