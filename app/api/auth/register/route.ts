import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      );
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
      },
    });

    // Crear cuenta personal por defecto
    const personalAccount = await prisma.account.create({
      data: {
        name: "Cuenta Personal",
        type: "PERSONAL",
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    });

    // Crear categorías predefinidas
    const defaultCategories = [
      { name: "Salario", type: "INCOME", color: "#10b981" },
      { name: "Freelance", type: "INCOME", color: "#10b981" },
      { name: "Inversiones", type: "INCOME", color: "#10b981" },
      { name: "Alimentación", type: "EXPENSE", color: "#ef4444" },
      { name: "Transporte", type: "EXPENSE", color: "#ef4444" },
      { name: "Entretenimiento", type: "EXPENSE", color: "#ef4444" },
      { name: "Salud", type: "EXPENSE", color: "#ef4444" },
      { name: "Educación", type: "EXPENSE", color: "#ef4444" },
      { name: "Ropa", type: "EXPENSE", color: "#ef4444" },
      { name: "Hogar", type: "EXPENSE", color: "#ef4444" },
    ];

    await prisma.category.createMany({
      data: defaultCategories.map((cat) => ({
        ...cat,
        userId: null, // Categorías predefinidas
      })),
    });

    return NextResponse.json(
      {
        message: "Usuario creado exitosamente",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}

