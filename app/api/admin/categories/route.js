const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../../lib/db");
const { TileCategory } = require("../../../../models");
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
  const categories = await TileCategory.find({}).lean();
  return NextResponse.json(categories.map((c) => ({ ...c, _id: c._id.toString() })));
}

async function POST(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const body = await request.json();
  const { categoryName, description } = body;
  if (!categoryName || !description) {
    return NextResponse.json({ error: "Category name and description are required." }, { status: 400 });
  }
  await connectToDatabase();
  const existing = await TileCategory.findOne({ categoryName });
  if (existing) return NextResponse.json({ error: "Category already exists." }, { status: 409 });
  const cat = await TileCategory.create({ categoryName, description });
  return NextResponse.json({ ...cat.toObject(), _id: cat._id.toString() }, { status: 201 });
}

module.exports = { GET, POST };
