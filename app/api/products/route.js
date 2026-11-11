const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../lib/db");
const { TileProduct } = require("../../../models");

const fallbackProducts = [
  {
    _id: "fallback-1",
    categoryId: "floor",
    design: "Marble Luxe",
    size: { length: 600, width: 600, unit: "mm" },
    company: "Roca Tiles",
    price: 610,
    tilesPerBox: 4,
    unitType: "Box",
    categoryName: "Floor",
  },
  {
    _id: "fallback-2",
    categoryId: "floor",
    design: "Stone Grey",
    size: { length: 600, width: 600, unit: "mm" },
    company: "Ceramica",
    price: 540,
    tilesPerBox: 5,
    unitType: "Box",
    categoryName: "Floor",
  },
  {
    _id: "fallback-3",
    categoryId: "washroom",
    design: "Ocean Gloss",
    size: { length: 300, width: 600, unit: "mm" },
    company: "AquaLine",
    price: 420,
    tilesPerBox: 8,
    unitType: "Box",
    categoryName: "Washroom",
  },
];

async function getProducts() {
  try {
    await connectToDatabase();
    const products = await TileProduct.find({}).lean();

    if (!products || products.length === 0) {
      return fallbackProducts;
    }

    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      categoryId: product.categoryId ? product.categoryId.toString() : product.categoryId,
    }));
  } catch (error) {
    console.error("Database error while fetching products:", error);
    return fallbackProducts;
  }
}

async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

module.exports = { GET };
