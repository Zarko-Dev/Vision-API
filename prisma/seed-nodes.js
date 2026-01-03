
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const initialNodes = [
    { id: 'headquarters', label: 'Headquarters', type: 'input', x: 0, y: 0, status: 'active' },
    { id: 'production-unit-1', label: 'Production Unit 1', type: 'default', x: 0, y: 150, parentId: 'headquarters', status: 'active' },
    { id: 'production-unit-2', label: 'Production Unit 2', type: 'default', x: 150, y: 150, parentId: 'headquarters', status: 'active' },
    { id: 'warehouse-a', label: 'Warehouse A', type: 'output', x: -100, y: 300, parentId: 'production-unit-1', status: 'active' },
    { id: 'warehouse-b', label: 'Warehouse B', type: 'output', x: 100, y: 300, parentId: 'production-unit-2', status: 'active' }
];

async function main() {
  console.log('Seeding nodes...');

  for (const node of initialNodes) {
    const exists = await prisma.node.findUnique({ where: { id: node.id } });
    if (!exists) {
        await prisma.node.create({ data: node });
        console.log(`Created node: ${node.label}`);
    } else {
        console.log(`Node ${node.label} already exists.`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
