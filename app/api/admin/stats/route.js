const { NextResponse } = require("next/server");
const { connectToDatabase } = require("../../../../lib/db");
const { Order, TileProduct, Admin, Customer, Inventory } = require("../../../../models");
const { getSession } = require("../../../../lib/auth");

async function GET(request) {
  const session = getSession(request);
  if (!session || (session.role !== "Admin" && session.role !== "Super Admin")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await connectToDatabase();

  const [products, orders, inventory, admins, customers] = await Promise.all([
    TileProduct.countDocuments(),
    Order.find({}).lean(),
    Inventory.find({}).lean(),
    Admin.countDocuments(),
    Customer.countDocuments(),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const lowStock = inventory.filter((i) => i.boxCount < 10).length;

  return NextResponse.json({
    totalProducts: products,
    pendingOrders,
    totalRevenue,
    lowStockAlerts: lowStock,
    totalCustomers: customers,
    totalAdmins: admins,
  });
}

module.exports = { GET };
