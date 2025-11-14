import prisma from "../../../lib/prisma";

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { priceHistory: true },
      orderBy: { name: "asc" },
    });

    return jsonResponse(products);
  } catch (error) {
    console.error("Failed to fetch products", error);
    return jsonResponse({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      organizationId,
      name,
      category,
      subCategory,
      description,
      unit,
      packSize,
      unitPrice,
      costPrice,
      minFatPercent,
      minSnfPercent,
      shelfLifeDays,
      storageTempMin,
      storageTempMax,
      requiresColdChain,
      currentStock,
      reorderLevel,
      minOrderQuantity,
    } = body;

    if (!organizationId || !name || !category || !unit) {
      return jsonResponse(
        { error: "organizationId, name, category and unit are required" },
        { status: 400 }
      );
    }

    const parseOptionalNumber = (value: unknown) => {
      if (value === undefined || value === null || value === "") return null;
      const num = Number(value);
      return Number.isNaN(num) ? NaN : num;
    };

    const parsedUnitPrice = parseOptionalNumber(unitPrice);
    const parsedCostPrice = parseOptionalNumber(costPrice);
    const parsedMinFat = parseOptionalNumber(minFatPercent);
    const parsedMinSnf = parseOptionalNumber(minSnfPercent);
    const parsedShelfLife = parseOptionalNumber(shelfLifeDays);
    const parsedTempMin = parseOptionalNumber(storageTempMin);
    const parsedTempMax = parseOptionalNumber(storageTempMax);
    const parsedCurrentStock = parseOptionalNumber(currentStock);
    const parsedReorderLevel = parseOptionalNumber(reorderLevel);
    const parsedMOQ = parseOptionalNumber(minOrderQuantity);

    const numericFields = [
      { label: "unitPrice", value: parsedUnitPrice },
      { label: "costPrice", value: parsedCostPrice },
      { label: "minFatPercent", value: parsedMinFat },
      { label: "minSnfPercent", value: parsedMinSnf },
      { label: "shelfLifeDays", value: parsedShelfLife },
      { label: "storageTempMin", value: parsedTempMin },
      { label: "storageTempMax", value: parsedTempMax },
      { label: "currentStock", value: parsedCurrentStock },
      { label: "reorderLevel", value: parsedReorderLevel },
      { label: "minOrderQuantity", value: parsedMOQ },
    ];

    for (const field of numericFields) {
      if (field.value !== null && Number.isNaN(field.value)) {
        return jsonResponse(
          { error: `${field.label} must be a valid number` },
          { status: 400 }
        );
      }
    }

    const requiresColdChainInt = requiresColdChain ? 1 : 0;
    const now = Math.floor(Date.now() / 1000);

    const product = await prisma.product.create({
      data: {
        organization: { connect: { id: organizationId } },
        name,
        category,
        subCategory: subCategory ?? null,
        description: description ?? null,
        unit,
        packSize: packSize ?? null,
        unitPrice: parsedUnitPrice,
        costPrice: parsedCostPrice,
        minFatPercent: parsedMinFat,
        minSnfPercent: parsedMinSnf,
        shelfLifeDays:
          parsedShelfLife !== null ? Math.trunc(parsedShelfLife) : null,
        storageTempMin: parsedTempMin,
        storageTempMax: parsedTempMax,
        requiresColdChain: requiresColdChainInt,
        currentStock: parsedCurrentStock,
        reorderLevel: parsedReorderLevel,
        minOrderQuantity: parsedMOQ,
        priceHistory:
          parsedUnitPrice !== null || parsedCostPrice !== null
            ? {
                create: {
                  unitPrice: parsedUnitPrice ?? 0,
                  costPrice: parsedCostPrice,
                  startDate: now,
                },
              }
            : undefined,
      },
      include: { priceHistory: true },
    });

    return jsonResponse(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product", error);
    return jsonResponse({ error: "Failed to create product" }, { status: 500 });
  }
}
