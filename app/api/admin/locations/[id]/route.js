const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../../../lib/db");
const { Warehouse, Outlet } = require("../../../../../models");
const { getSession } = require("../../../../../lib/auth");

async function requireAdmin(request) {
  const session = getSession(request);
  if (!session || (session.role !== "Admin" && session.role !== "Super Admin")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

async function PUT(request, { params }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json();
  const { locationType } = body;
  await connectToDatabase();
  const Model = locationType === "Outlet" ? Outlet : Warehouse;
  const updated = await Model.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ error: "Location not found." }, { status: 404 });
  return NextResponse.json({ ...updated.toObject(), _id: updated._id.toString() });
}

async function DELETE(request, { params }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const locationType = searchParams.get("type");
  await connectToDatabase();
  const Model = locationType === "Outlet" ? Outlet : Warehouse;
  const deleted = await Model.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Location not found." }, { status: 404 });
  return NextResponse.json({ success: true });
}

module.exports = { PUT, DELETE };
