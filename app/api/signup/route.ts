import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db/prisma";
import { signupSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = signupSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: err.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    console.error("[signup]", err);
    return NextResponse.json(
      { error: "Could not create account" },
      { status: 500 }
    );
  }
}
