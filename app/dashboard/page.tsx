import { redirect } from "next/navigation";
import { auth } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Obtener cuentas del usuario
  const accounts = await prisma.account.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          transactions: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Obtener resumen del mes actual
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const transactions = await prisma.transaction.findMany({
    where: {
      account: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    include: {
      category: true,
    },
  });

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardContent
      accounts={accounts}
      totalIncome={totalIncome}
      totalExpenses={totalExpenses}
      balance={totalIncome - totalExpenses}
    />
  );
}

