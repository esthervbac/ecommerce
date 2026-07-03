import { prisma } from "./lib/prisma";

async function promoteUser() {
  const email = "esther@teste.com";

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(
      `✨ Sucesso! O utilizador ${updatedUser.name} agora é um ADMIN. 🚀`,
    );
  } catch (error) {
    console.error(
      "❌ Erro ao promover utilizador. Verifique se o e-mail está correto.",
    );
  } finally {
    await prisma.$disconnect();
  }
}

promoteUser();
