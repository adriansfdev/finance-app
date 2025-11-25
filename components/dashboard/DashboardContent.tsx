"use client";

import { signOut } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

interface Account {
  id: string;
  name: string;
  type: string;
  members: Array<{
    user: {
      id: string;
      name: string | null;
      email: string;
    };
    role: string;
  }>;
  _count: {
    transactions: number;
  };
}

interface DashboardContentProps {
  accounts: Account[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export default function DashboardContent({
  accounts,
  totalIncome,
  totalExpenses,
  balance,
}: DashboardContentProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Finance App</h1>
            <div className="flex gap-4 items-center">
              <Button
                variant="light"
                onPress={() => router.push("/dashboard/transactions")}
              >
                Transacciones
              </Button>
              <Button
                variant="light"
                onPress={() => router.push("/dashboard/budgets")}
              >
                Presupuestos
              </Button>
              <Button
                variant="light"
                onPress={() => router.push("/dashboard/accounts")}
              >
                Cuentas
              </Button>
              <Button color="danger" variant="light" onPress={handleSignOut}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Resumen del Mes</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-0 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ingresos
              </p>
            </CardHeader>
            <CardBody>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(totalIncome)}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="pb-0 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gastos
              </p>
            </CardHeader>
            <CardBody>
              <p className="text-2xl font-bold text-danger">
                {formatCurrency(totalExpenses)}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="pb-0 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Balance
              </p>
            </CardHeader>
            <CardBody>
              <p
                className={`text-2xl font-bold ${
                  balance >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {formatCurrency(balance)}
              </p>
            </CardBody>
          </Card>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Mis Cuentas</h3>
            <Button
              color="primary"
              onPress={() => router.push("/dashboard/accounts/new")}
            >
              Nueva Cuenta
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <Card
                key={account.id}
                isPressable
                onPress={() => router.push(`/dashboard/accounts/${account.id}`)}
              >
                <CardHeader className="pb-0 pt-4">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <p className="font-bold">{account.name}</p>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={account.type === "SHARED" ? "primary" : "default"}
                      >
                        {account.type === "SHARED" ? "Compartida" : "Personal"}
                      </Chip>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {account._count.transactions} transacciones
                  </p>
                  {account.type === "SHARED" && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        Miembros: {account.members.length}
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

