const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../../lib/db");
const { Order, OrderItem } = require("../../../../models");
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

  const orders = await Order.find({})
    .populate("customerId", "name email phone")
    .sort({ orderDate: -1 })
    .lean();

  const orderIds = orders.map((o) => o._id);
  const items = await OrderItem.find({ orderId: { $in: orderIds } })
    .populate("productId", "design company")
    .lean();

  const itemsByOrder = {};
  items.forEach((item) => {
    const oid = item.orderId.toString();
    if (!itemsByOrder[oid]) itemsByOrder[oid] = [];
    itemsByOrder[oid].push({ ...item, _id: item._id.toString(), orderId: oid, productId: item.productId ? { ...item.productId, _id: item.productId._id.toString() } : null });
  });

  return NextResponse.json(
    orders.map((o) => ({
      ...o,
      _id: o._id.toString(),
      customerId: o.customerId ? { ...o.customerId, _id: o.customerId._id.toString() } : null,
      items: itemsByOrder[o._id.toString()] || [],
    }))
  );
}

async function PATCH(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const body = await request.json();
  const { id, status } = body;
  await connectToDatabase();
  const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ ...updated.toObject(), _id: updated._id.toString() });
}

module.exports = { GET, PATCH };
