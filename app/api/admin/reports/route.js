const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../../lib/db");
const { Order, Inventory, TileProduct, Report } = require("../../../../models");
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

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "sales";
  const from = searchParams.get("from") ? new Date(searchParams.get("from")) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to = searchParams.get("to") ? new Date(searchParams.get("to")) : new Date();

  await connectToDatabase();

  let data = {};

  if (type === "sales") {
    const orders = await Order.find({ orderDate: { $gte: from, $lte: to } })
      .populate("customerId", "name email")
      .lean();
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    data = {
      type: "Sales Report",
      totalOrders: orders.length,
      totalRevenue,
      pending: orders.filter((o) => o.status === "Pending").length,
      confirmed: orders.filter((o) => o.status === "Confirmed").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
      orders: orders.map((o) => ({
        ...o,
        _id: o._id.toString(),
        customerId: o.customerId ? { ...o.customerId, _id: o.customerId._id.toString() } : null,
      })),
    };
  } else if (type === "stock") {
    const inventory = await Inventory.find({})
      .populate("productId", "design company price tilesPerBox")
      .lean();
    data = {
      type: "Stock Report",
      totalItems: inventory.length,
      lowStock: inventory.filter((i) => i.boxCount < 10).length,
      items: inventory.map((i) => ({
        ...i,
        _id: i._id.toString(),
        productId: i.productId ? { ...i.productId, _id: i.productId._id.toString() } : null,
        locationId: i.locationId ? i.locationId.toString() : null,
      })),
    };
  } else if (type === "outlet") {
    const inventory = await Inventory.find({ locationType: "Outlet" })
      .populate("productId", "design company price")
      .lean();
    data = {
      type: "Outlet Summary",
      totalItems: inventory.length,
      items: inventory.map((i) => ({
        ...i,
        _id: i._id.toString(),
        productId: i.productId ? { ...i.productId, _id: i.productId._id.toString() } : null,
        locationId: i.locationId ? i.locationId.toString() : null,
      })),
    };
  }

  const realSession = getSession(request);
  if (realSession) {
    await Report.create({
      adminId: realSession.id,
      reportType: data.type || type,
      dateRange: { from, to },
      generatedAt: new Date(),
    });
  }

  return NextResponse.json({ ...data, from: from.toISOString(), to: to.toISOString() });
}

module.exports = { GET };
