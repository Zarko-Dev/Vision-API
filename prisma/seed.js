import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Criar Roles
  const roles = [
    {
      name: 'admin',
      description: 'Administrador do Sistema',
      permissionKeys: ['users.create', 'users.update', 'users.delete', 'orders.view', 'orders.create', 'orders.update'],
    },
    {
      name: 'financeiro',
      description: 'Acesso Financeiro',
      permissionKeys: ['orders.view', 'finance.view', 'finance.export'],
    },
    {
      name: 'vendas',
      description: 'Vendedor',
      permissionKeys: ['orders.create', 'orders.view'],
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        permissionKeys: role.permissionKeys,
        description: role.description,
      },
      create: role,
    });
  }

  console.log('Roles criadas/atualizadas.');

  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@erp.com' },
    update: {
      passwordHash,
      roleIds: [adminRole.id], 
    },
    create: {
      name: 'Administrador',
      email: 'admin@erp.com',
      passwordHash,
      document: '00000000000',
      phone: '85999999999',
      active: true,
      roleIds: [adminRole.id],
    },
  });

  console.log('Usuário admin criado com role:', adminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
