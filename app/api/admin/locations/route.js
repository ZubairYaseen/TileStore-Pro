const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../../lib/db");
const { Warehouse, Outlet } = require("../../../../models");
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
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "outlet") {
    const outlets = await Outlet.find({}).lean();
    return NextResponse.json(outlets.map((o) => ({ ...o, _id: o._id.toString(), locationType: "Outlet" })));
  }
  const warehouses = await Warehouse.find({}).lean();
  return NextResponse.json(warehouses.map((w) => ({ ...w, _id: w._id.toString(), locationType: "Warehouse" })));
}

async function POST(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const body = await request.json();
  const { name, address, contactNumber, locationType } = body;
  if (!name || !address || !contactNumber || !locationType) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  await connectToDatabase();
  const Model = locationType === "Outlet" ? Outlet : Warehouse;
  const loc = await Model.create({ name, type: locationType, address, contactNumber });
  return NextResponse.json({ ...loc.toObject(), _id: loc._id.toString(), locationType }, { status: 201 });
}

module.exports = { GET, POST };
