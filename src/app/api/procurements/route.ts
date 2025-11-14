import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const procurements = await prisma.milkProcurementEntry.findMany({
      include: { supplier: true, collectionCenter: true },
      orderBy: { datetime: "desc" },
    });

    return new Response(JSON.stringify(procurements), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch procurements", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch procurements" }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      supplierId,
      collectionCenterId,
      organizationId,
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
      !organizationId ||
      quantityL === undefined ||
      ratePerLitre === undefined
    ) {
      return new Response(
        JSON.stringify({
          error:
            "supplierId, organizationId, quantityL and ratePerLitre are required",
        }),
        { status: 400 }
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
        organizationId,
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

    return new Response(JSON.stringify(entry), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to create procurement entry", error);
    return new Response(
      JSON.stringify({ error: "Failed to create procurement entry" }),
      { status: 500 }
    );
  }
}
