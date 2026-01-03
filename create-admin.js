
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'pedronisahi@gmail.com';
  const password = '123456789';
  const name = 'Admin User';

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`User ${email} already exists.`);
    
    // Optional: Update password if needed
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
        where: { email },
        data: { passwordHash, active: true }
    });
    console.log('Password updated.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      active: true,
    },
  });

  console.log(`Created user: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
