import express, { Request, Response } from "express";
import { PrismaClient } from "./generated/client";

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

// Create Product
app.post("/products", async (req: Request, res: Response) => {
  try {
    const { productName, productDescription, unitsLeft } = req.body;
    const product = await prisma.product.create({
      data: { productName, productDescription, unitsLeft },
    });
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Products
app.get("/products", async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// Get Product by ID
app.get("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// Update Product
app.put("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productName, productDescription, unitsLeft } = req.body;
  try {
    const updated = await prisma.product.update({
      where: { id },
      data: { productName, productDescription, unitsLeft },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Product
app.delete("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);