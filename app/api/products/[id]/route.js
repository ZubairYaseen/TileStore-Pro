const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../../lib/db");
const { TileProduct } = require("../../../../models");

async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const product = await TileProduct.findById(id)
      .populate("categoryId", "categoryName description")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({
      ...product,
      _id: product._id.toString(),
      categoryId: product.categoryId
        ? {
            ...product.categoryId,
            _id: product.categoryId._id.toString(),
          }
        : null,
    });
  } catch (error) {
    console.error("Public product fetch error:", error);
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
}

module.exports = { GET };
