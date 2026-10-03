const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("123456", 10);
  const user = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: { passwordHash: hash, role: "ADMIN" },
    create: {
      name: "Admin User",
      email: "admin@gmail.com",
      passwordHash: hash,
      role: "ADMIN"
    }
  });
  console.log("ADMIN USER CREATED/UPDATED SUCCESSFULLY:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
