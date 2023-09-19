-- CreateEnum
CREATE TYPE "GPTModel" AS ENUM ('gpt_4', 'gpt_4_0613', 'gpt_4_32k', 'gpt_4_32k_0613', 'gpt_4_0314', 'gpt_4_32k_0314', 'gpt_3_5_turbo', 'gpt_3_5_turbo_16k', 'gpt_3_5_turbo_instruct', 'gpt_3_5_turbo_0613', 'gpt_3_5_turbo_16k_0613', 'gpt_3_5_turbo_0301');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gptModel" "GPTModel";
