// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Madhu",
      email: "madhu@example.com",
      password: "hashedpassword",
      role: "user",
    },
  });

  console.log("Seeded user");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());