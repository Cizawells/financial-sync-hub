-- CreateTable
CREATE TABLE "qb_tokens" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qb_tokens_pkey" PRIMARY KEY ("id")
);
