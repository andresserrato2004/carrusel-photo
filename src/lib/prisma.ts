import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Función para añadir parámetros de conexión segura
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) return "";
  // Si ya tiene parámetros, añade connection_limit=1, si no, lo crea.
  // Esto fuerza a que cada instancia serverless use máximo 1 conexión.
  const separator = url.includes("?") ? "&" : "?";
  if (!url.includes("connection_limit")) {
     return `${url}${separator}connection_limit=1&pool_timeout=10`;
  }
  return url;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
