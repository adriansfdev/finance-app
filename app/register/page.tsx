"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Link,
} from "@heroui/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al registrar usuario");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 pb-0">
          <h1 className="text-2xl font-bold">Crear Cuenta</h1>
          <p className="text-small text-default-500">
            Regístrate para comenzar a gestionar tus finanzas
          </p>
        </CardHeader>
        <CardBody className="gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              variant="bordered"
            />
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
            <Input
              label="Confirmar Contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              Registrarse
            </Button>
            <div className="text-center text-sm">
              <span className="text-default-500">¿Ya tienes cuenta? </span>
              <Link href="/login" size="sm">
                Inicia sesión
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

