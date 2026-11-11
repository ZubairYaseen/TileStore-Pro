const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../../lib/db");
const { Inventory, TileProduct, Warehouse, Outlet } = require("../../../../models");
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
  const items = await Inventory.find({})
    .populate("productId", "design size company price")
    .lean();

  const warehouses = await Warehouse.find({}).lean();
  const outlets = await Outlet.find({}).lean();
  const locationMap = {};
  warehouses.forEach((w) => { locationMap[w._id.toString()] = w.name; });
  outlets.forEach((o) => { locationMap[o._id.toString()] = o.name; });

  return NextResponse.json(
    items.map((item) => ({
      ...item,
      _id: item._id.toString(),
      productId: item.productId ? { ...item.productId, _id: item.productId._id.toString() } : null,
      locationId: item.locationId ? item.locationId.toString() : null,
      locationName: item.locationId ? locationMap[item.locationId.toString()] || "Unknown" : "Unknown",
    }))
  );
}

async function POST(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const body = await request.json();
  const { productId, locationId, locationType, boxCount, areaCovered } = body;
  if (!productId || !locationId || !locationType) {
    return NextResponse.json({ error: "Product, location, and type are required." }, { status: 400 });
  }
  await connectToDatabase();
  const item = await Inventory.create({ productId, locationId, locationType, boxCount: boxCount || 0, areaCovered: areaCovered || 0, updatedAt: new Date() });
  return NextResponse.json({ ...item.toObject(), _id: item._id.toString() }, { status: 201 });
}

module.exports = { GET, POST };
