import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const procurements = await prisma.milkProcurementEntry.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
      },
      include: { supplier: true, collectionCenter: true },
      orderBy: { datetime: "desc" },
    });

    return NextResponse.json(procurements);
  } catch (error) {
    console.error("Failed to fetch procurements", error);
    return NextResponse.json(
      { error: "Failed to fetch procurements" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      supplierId,
      collectionCenterId,
      datetime,
      quantityL,
      fatPercent,
      snfPercent,
      clrReading,
      temperatureC,
      qualityGrade,
      ratePerLitre,
      totalAmount,
      paymentStatus,
      milkType,
    } = body;

    if (
      !supplierId ||
      quantityL === undefined ||
      ratePerLitre === undefined
    ) {
      return NextResponse.json(
        {
          error: "supplierId, quantityL and ratePerLitre are required",
        },
        { status: 400 }
      );
    }

    // Verify supplier belongs to user's organization
    const supplier = await prisma.connection.findFirst({
      where: {
        id: supplierId,
        organizationId: session.user.currentOrganizationId,
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found or does not belong to your organization" },
        { status: 404 }
      );
    }

    const parsedQuantity = Number(quantityL);
    const parsedRate = Number(ratePerLitre);
    const parsedDatetime = datetime
      ? Math.floor(new Date(datetime).getTime() / 1000)
      : Math.floor(Date.now() / 1000);

    if (Number.isNaN(parsedQuantity) || Number.isNaN(parsedRate)) {
      return new Response(
        JSON.stringify({ error: "quantityL and ratePerLitre must be numbers" }),
        { status: 400 }
      );
    }

    const entry = await prisma.milkProcurementEntry.create({
      data: {
        supplierId,
        organizationId: session.user.currentOrganizationId,
        collectionCenterId: collectionCenterId ?? null,
        datetime: parsedDatetime,
        quantityL: parsedQuantity,
        fatPercent: fatPercent !== undefined ? Number(fatPercent) : null,
        snfPercent: snfPercent !== undefined ? Number(snfPercent) : null,
        clrReading: clrReading !== undefined ? Number(clrReading) : null,
        temperatureC: temperatureC !== undefined ? Number(temperatureC) : null,
        qualityGrade: qualityGrade ?? "A",
        ratePerLitre: parsedRate,
        totalAmount: totalAmount
          ? Number(totalAmount)
          : parsedQuantity * parsedRate,
        paymentStatus: paymentStatus ?? "PENDING",
        milkType: milkType ?? null,
        createdAt: Math.floor(Date.now() / 1000),
      },
      include: { supplier: true, collectionCenter: true },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Failed to create procurement entry", error);
    return NextResponse.json(
      { error: "Failed to create procurement entry" },
      { status: 500 }
    );
  }
}
