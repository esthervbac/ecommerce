import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Limpando o banco de dados antes do seed...");
  // Apaga dados antigos para evitar erros de duplicidade ao rodar o seed de novo
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("🌱 Criando Categorias...");
  const calçados = await prisma.category.create({
    data: { name: "Calçados", slug: "calcados" },
  });

  const roupas = await prisma.category.create({
    data: { name: "Roupas", slug: "roupas" },
  });

  const acessorios = await prisma.category.create({
    data: { name: "Acessórios", slug: "acessorios" },
  });

  console.log("📦 Criando Produtos de teste...");
  await prisma.product.createMany({
    data: [
      {
        name: "Tênis Running Max",
        description:
          "Tênis de alta performance ideal para corridas de longa distância e conforto absoluto.",
        price: 349.9,
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        categoryId: calçados.id,
      },
      {
        name: "Camiseta Algodão Premium",
        description:
          "Camiseta minimalista 100% algodão fio 30.1, corte slim comfort.",
        price: 89.9,
        stock: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
        categoryId: roupas.id,
      },
      {
        name: "Mochila Urbana Impermeável",
        description:
          "Mochila com compartimento para notebook de até 15.6 polegadas e tecido resistente à água.",
        price: 199.9,
        stock: 8,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        categoryId: acessorios.id,
      },
    ],
  });

  console.log("✨ Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
