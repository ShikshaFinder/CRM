import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = params.id;
    const body = await req.json();
    const {
      name,
      category,
      subCategory,
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

    if (!name || !category || !unit) {
      return jsonResponse(
        { error: "name, category and unit are required" },
        { status: 400 }
      );
    }

    // Verify product belongs to user's organization
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return jsonResponse({ error: "Product not found" }, { status: 404 });
    }

    if (existingProduct.organizationId !== session.user.currentOrganizationId) {
      return jsonResponse({ error: "Unauthorized" }, { status: 403 });
    }

    const parseOptionalNumber = (value: unknown) => {
      if (value === undefined || value === null || value === "") return null;
      const num = Number(value);
      return Number.isNaN(num) ? null : num;
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

    const requiresColdChainInt = requiresColdChain ? 1 : 0;

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        category,
        subCategory: subCategory ?? null,
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
      },
      include: { priceHistory: true },
    });

    return jsonResponse(product);
  } catch (error) {
    console.error("Failed to update product", error);
    return jsonResponse({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = params.id;

    // Verify product belongs to user's organization
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return jsonResponse({ error: "Product not found" }, { status: 404 });
    }

    if (existingProduct.organizationId !== session.user.currentOrganizationId) {
      return jsonResponse({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return jsonResponse({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete product", error);
    return jsonResponse({ error: "Failed to delete product" }, { status: 500 });
  }
}

