import { prisma } from "@mcw/database";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type Params = {
  params: {
    id: string;
  };
};

const serviceUpdateSchema = z.object({
  description: z.string().min(1, "Description is required"),
  rate: z
    .string()
    .or(z.number())
    .transform((val) => parseFloat(String(val))),
  duration: z
    .string()
    .or(z.number())
    .transform((val) => parseInt(String(val))),
  color: z.string().optional().default("#2D8467"),
  code: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const id = params.id;

  try {
    const body = await req.json();
    const validatedData = serviceUpdateSchema.parse(body);

    const updatedService = await prisma.practiceService.update({
      where: { id },
      data: {
        description: validatedData.description,
        rate: new Prisma.Decimal(validatedData.rate),
        duration: validatedData.duration,
        color: validatedData.color || "#2D8467",
        code: validatedData.code,
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 },
    );
  }
}
