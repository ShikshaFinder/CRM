import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    if (!code) {
      return NextResponse.json(
        { error: "Organization code is required" },
        { status: 400 }
      );
    }

    // Find organization by code
    const organization = await prisma.organization.findUnique({
      where: { code: code.toUpperCase() },
      select: {
        id: true,
        name: true,
        code: true,
        // Don't expose sensitive data
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        name: organization.name,
        code: organization.code,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Organization code lookup error:", error);
    return NextResponse.json(
      { error: "Failed to lookup organization" },
      { status: 500 }
    );
  }
}

