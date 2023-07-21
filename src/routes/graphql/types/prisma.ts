import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library.js";

export type PrismaType = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;