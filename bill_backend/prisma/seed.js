import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeds two ready-to-use demo accounts so they can log in directly.
 * Idempotent: re-running updates the password instead of failing on
 * the unique email/number constraints.
 *
 *   Citizen   -> citizen@gmail.com   / Asdf@123
 *   Authority -> authority@gmail.com / Asdf@123
 */
async function main() {
  const password = await bcrypt.hash("Asdf@123", 10);

  const citizen = await prisma.userAuth.upsert({
    where: { email: "citizen@gmail.com" },
    update: { password, name: "Demo Citizen", userType: "citizen" },
    create: {
      name: "Demo Citizen",
      email: "citizen@gmail.com",
      number: "9000000001",
      password,
      userType: "citizen",
    },
  });

  const authority = await prisma.authorityAuth.upsert({
    where: { email: "authority@gmail.com" },
    update: { password, name: "Demo Authority" },
    create: {
      name: "Demo Authority",
      email: "authority@gmail.com",
      number: "9000000002",
      password,
    },
  });

  console.log("✅ Seeded demo accounts:");
  console.log(`   Citizen   -> ${citizen.email} (id ${citizen.id})`);
  console.log(`   Authority -> ${authority.email} (id ${authority.id})`);
  console.log("   Password  -> Asdf@123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
