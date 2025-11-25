"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { SignInResponse } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Link,
} from "@heroui/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 pb-0">
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
          <p className="text-small text-default-500">
            Accede a tu aplicación de finanzas
          </p>
        </CardHeader>
        <CardBody className="gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="bordered"
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="bordered"
            />
            {error && (
              <p className="text-sm text-danger">{error}</p>
            )}
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              className="w-full"
            >
              Iniciar Sesión
            </Button>
            <div className="text-center text-sm">
              <span className="text-default-500">¿No tienes cuenta? </span>
              <Link href="/register" size="sm">
                Regístrate
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

