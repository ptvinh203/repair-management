-- CreateTable
CREATE TABLE "Common" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cd" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL,
    "extra_1" TEXT,
    "extra_2" TEXT,
    "extra_3" TEXT,
    "extra_4" TEXT,
    "extra_5" TEXT,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Repair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repair_date" DATETIME NOT NULL,
    "finish_date" DATETIME,
    "customer_id" INTEGER,
    "description" TEXT NOT NULL,
    "cost" REAL NOT NULL,
    "payment_status" INTEGER NOT NULL DEFAULT 0,
    "warranty_period" INTEGER,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Repair_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repair_id" INTEGER NOT NULL,
    "payment_method" INTEGER NOT NULL,
    "payment_amount" REAL NOT NULL,
    "payment_date" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_repair_id_fkey" FOREIGN KEY ("repair_id") REFERENCES "Repair" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Warranty" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repair_id" INTEGER NOT NULL,
    "warranty_date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Warranty_repair_id_fkey" FOREIGN KEY ("repair_id") REFERENCES "Repair" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
