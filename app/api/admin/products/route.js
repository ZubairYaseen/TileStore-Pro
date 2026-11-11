const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../../lib/db");
const { TileProduct, TileCategory } = require("../../../../models");
const { getSession } = require("../../../../lib/auth");

async function requireAdmin(request) {
  const session = getSession(request);
  if (!session || (session.role !== "Admin" && session.role !== "Super Admin")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

async function GET(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  await connectToDatabase();
  const products = await TileProduct.find({}).populate("categoryId", "categoryName").lean();
  return NextResponse.json(
    products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      categoryId: p.categoryId ? { ...p.categoryId, _id: p.categoryId._id.toString() } : null,
    }))
  );
}

async function POST(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const body = await request.json();
  const { categoryId, design, imageUrl, size, company, price, tilesPerBox, unitType } = body;
  if (!categoryId || !design || !size || !company || !price || !tilesPerBox) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  await connectToDatabase();
  const product = await TileProduct.create({ categoryId, design, imageUrl: imageUrl || "", size, company, price, tilesPerBox, unitType });
  return NextResponse.json({ ...product.toObject(), _id: product._id.toString() }, { status: 201 });
}

module.exports = { GET, POST };
