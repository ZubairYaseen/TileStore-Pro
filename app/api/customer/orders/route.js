const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../../lib/db");
const { Order, OrderItem, Inventory, Customer } = require("../../../../models");
const { getSession } = require("../../../../lib/auth");

function getCustomerSession(request) {
  const session = getSession(request);
  if (!session || session.role !== "Customer") {
    return null;
  }
  return session;
}

async function GET(request) {
  const session = getCustomerSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  await connectToDatabase();
  const customer = await Customer.findById(session.id).select("name email phone address").lean();

  const orders = await Order.find({ customerId: session.id })
    .sort({ orderDate: -1 })
    .lean();

  const orderIds = orders.map((o) => o._id);
  const items = await OrderItem.find({ orderId: { $in: orderIds } })
    .populate("productId", "design company price imageUrl size unitType")
    .lean();

  const itemsByOrder = {};
  items.forEach((item) => {
    const oid = item.orderId.toString();
    if (!itemsByOrder[oid]) itemsByOrder[oid] = [];
    itemsByOrder[oid].push({
      ...item,
      _id: item._id.toString(),
      orderId: oid,
      productId: item.productId ? { ...item.productId, _id: item.productId._id.toString() } : null,
    });
  });

  return NextResponse.json(
    orders.map((o) => ({
      ...o,
      _id: o._id.toString(),
      customerId: o.customerId.toString(),
      customer: customer ? { ...customer, _id: customer._id.toString() } : null,
      items: itemsByOrder[o._id.toString()] || [],
    }))
  );
}

async function POST(request) {
  const session = getCustomerSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await request.json();
  const { items, orderType } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  await connectToDatabase();

  let totalAmount = 0;
  for (const item of items) {
    totalAmount += Number(item.price) * Number(item.quantity);
  }

  const order = await Order.create({
    customerId: session.id,
    orderType: orderType || "COD",
    status: "Pending",
    totalAmount,
    orderDate: new Date(),
  });

  const orderItemsData = items.map((item) => ({
    orderId: order._id,
    productId: item.productId,
    boxQuantity: Number(item.quantity),
    unitPrice: Number(item.price),
  }));

  await OrderItem.insertMany(orderItemsData);

  // Real Multi-Location Inventory Deduction:
  // Deducts boxCount from available storage locations for the ordered product
  for (const item of items) {
    let needed = Number(item.quantity);
    const inventories = await Inventory.find({ productId: item.productId, boxCount: { $gt: 0 } }).sort({ locationType: 1 });
    for (const inv of inventories) {
      if (needed <= 0) break;
      const deduct = Math.min(inv.boxCount, needed);
      inv.boxCount -= deduct;
      inv.updatedAt = new Date();
      await inv.save();
      needed -= deduct;
    }
  }

  return NextResponse.json({ success: true, orderId: order._id.toString() }, { status: 201 });
}

// Allow Customer to Cancel their own Pending order
async function PATCH(request) {
  const session = getCustomerSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await request.json();
  const { orderId, action } = body;

  if (!orderId || action !== "cancel") {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  await connectToDatabase();
  const order = await Order.findOne({ _id: orderId, customerId: session.id });
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  if (order.status !== "Pending") {
    return NextResponse.json({ error: "Only Pending orders can be cancelled." }, { status: 400 });
  }

  order.status = "Cancelled";
  await order.save();

  // Restore inventory
  const items = await OrderItem.find({ orderId: order._id });
  for (const item of items) {
    // Add back to the first available inventory or warehouse
    await Inventory.findOneAndUpdate(
      { productId: item.productId },
      { $inc: { boxCount: item.boxQuantity }, updatedAt: new Date() }
    );
  }

  return NextResponse.json({ success: true, message: "Order cancelled successfully." });
}

module.exports = { GET, POST, PATCH };
