const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../../lib/db");
const { StockTransfer, Inventory } = require("../../../../models");
const { getSession } = require("../../../../lib/auth");

function getAdminSession(request) {
  const session = getSession(request);
  if (!session || (session.role !== "Admin" && session.role !== "Super Admin")) {
    return null;
  }
  return session;
}

async function GET(request) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  await connectToDatabase();
  const transfers = await StockTransfer.find({})
    .populate("productId", "design company")
    .populate("sourceWarehouseId", "name")
    .populate("destinationOutletId", "name")
    .sort({ transferDate: -1 })
    .lean();

  return NextResponse.json(
    transfers.map((t) => ({
      ...t,
      _id: t._id.toString(),
      productId: t.productId ? { ...t.productId, _id: t.productId._id.toString() } : null,
      sourceWarehouseId: t.sourceWarehouseId ? { ...t.sourceWarehouseId, _id: t.sourceWarehouseId._id.toString() } : null,
      destinationOutletId: t.destinationOutletId ? { ...t.destinationOutletId, _id: t.destinationOutletId._id.toString() } : null,
    }))
  );
}

async function POST(request) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await request.json();
  const { productId, sourceWarehouseId, destinationOutletId, boxCount } = body;

  if (!productId || !sourceWarehouseId || !destinationOutletId || !boxCount) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  await connectToDatabase();

  const transfer = await StockTransfer.create({
    productId,
    sourceWarehouseId,
    destinationOutletId,
    adminId: session.id,
    boxCount: Number(boxCount),
    status: "Pending",
    transferDate: new Date(),
  });

  // Update inventory: deduct from warehouse, add to outlet
  await Inventory.findOneAndUpdate(
    { productId, locationId: sourceWarehouseId, locationType: "Warehouse" },
    { $inc: { boxCount: -Number(boxCount) }, updatedAt: new Date() }
  );
  await Inventory.findOneAndUpdate(
    { productId, locationId: destinationOutletId, locationType: "Outlet" },
    { $inc: { boxCount: Number(boxCount) }, updatedAt: new Date() },
    { upsert: true }
  );

  return NextResponse.json({ ...transfer.toObject(), _id: transfer._id.toString() }, { status: 201 });
}

async function PATCH(request) {
  const session = getAdminSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await request.json();
  const { id, status } = body;
  await connectToDatabase();
  const updated = await StockTransfer.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated) return NextResponse.json({ error: "Transfer not found." }, { status: 404 });
  return NextResponse.json({ ...updated.toObject(), _id: updated._id.toString() });
}

module.exports = { GET, POST, PATCH };
