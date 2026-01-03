import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class NodeController {
  async getNodes(req, res) {
    try {
      const nodes = await prisma.node.findMany();
      res.json(nodes);
    } catch (error) {
      console.error('Error fetching nodes:', error);
      res.status(500).json({ message: 'Error fetching nodes' });
    }
  }

  async createNode(req, res) {
    try {
      const { id, label, type, x, y, parentId } = req.body;
      
      const node = await prisma.node.create({
        data: {
          id: id || undefined, // Se id for fornecido, usa ele (atenção com o MongoDB _id se for custom string)
          label,
          type,
          x,
          y,
          parentId
        }
      });
      
      res.status(201).json(node);
    } catch (error) {
       console.error('Error creating node:', error);
       res.status(500).json({ message: 'Error creating node' });
    }
  }

  async updateNode(req, res) {
    try {
      const { id } = req.params;
      const { x, y, parentId, label, status } = req.body;

      const node = await prisma.node.update({
        where: { id },
        data: {
          x, 
          y,
          parentId,
          label,
          status
        }
      });

      res.json(node);
    } catch (error) {
      console.error('Error updating node:', error);
      res.status(500).json({ message: 'Error updating node' });
    }
  }
}

export default new NodeController();
