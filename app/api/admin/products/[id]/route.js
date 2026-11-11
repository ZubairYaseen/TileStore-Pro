const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../../../lib/db");
const { TileProduct } = require("../../../../../models");
const { getSession } = require("../../../../../lib/auth");

async function requireAdmin(request) {
  const session = getSession(request);
  if (!session || (session.role !== "Admin" && session.role !== "Super Admin")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

async function GET(request, { params }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  await connectToDatabase();
  const product = await TileProduct.findById(id).populate("categoryId", "categoryName").lean();
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ ...product, _id: product._id.toString() });
}

async function PUT(request, { params }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json();
  await connectToDatabase();
  const updated = await TileProduct.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ ...updated.toObject(), _id: updated._id.toString() });
}

async function DELETE(request, { params }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  await connectToDatabase();
  const deleted = await TileProduct.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ success: true });
}

module.exports = { GET, PUT, DELETE };
