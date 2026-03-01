import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
async function main() {
  const customers = Array.from({ length: 1000 }).map((_, i) => ({
    first_name: `Customer${i}`,
    last_name: `Test${i}`,
    email: `customer${i}@example.com`,
    tax_exempt: false,
  }));

  await prisma.customer.createMany({
    data: customers,
    skipDuplicates: true,
  });

  console.log('Seeded successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());