const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const {
  Admin,
  Customer,
  TileCategory,
  TileProduct,
  Inventory,
  Warehouse,
  Outlet,
  StockTransfer,
  Order,
  OrderItem,
  Report,
} = require("../models");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tileStorePrototype";

async function seedDatabase() {
  await mongoose.connect(MONGODB_URI);

  await Promise.all([
    Admin.deleteMany({}),
    Customer.deleteMany({}),
    TileCategory.deleteMany({}),
    TileProduct.deleteMany({}),
    Inventory.deleteMany({}),
    Warehouse.deleteMany({}),
    Outlet.deleteMany({}),
    StockTransfer.deleteMany({}),
    Order.deleteMany({}),
    OrderItem.deleteMany({}),
    Report.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admins = await Admin.insertMany([
    { name: "Ayesha Khan", email: "admin@tilestore.com", password: hashedPassword, role: "Admin" },
    { name: "Nadia Malik", email: "superadmin@tilestore.com", password: hashedPassword, role: "Super Admin" },
    { name: "Usman Tariq", email: "ops@tilestore.com", password: hashedPassword, role: "Admin" },
  ]);

  const customers = await Customer.insertMany([
    {
      name: "Muhammad Ali",
      email: "ali@example.com",
      password: await bcrypt.hash("customer123", 10),
      phone: "+923001234567",
      address: "House 22, Gulshan, Karachi",
    },
    {
      name: "Sana Ahmed",
      email: "sana@example.com",
      password: await bcrypt.hash("customer123", 10),
      phone: "+923007654321",
      address: "Flat 5, Clifton, Karachi",
    },
    {
      name: "Hamza Raza",
      email: "hamza@example.com",
      password: await bcrypt.hash("customer123", 10),
      phone: "+923009876543",
      address: "Street 9, DHA, Lahore",
    },
  ]);

  const categories = await TileCategory.insertMany([
    { categoryName: "Floor", description: "Durable ceramic and vitrified tiles for indoor and outdoor flooring." },
    { categoryName: "Washroom", description: "Slip-resistant and water-friendly tiles designed for wet zones." },
    { categoryName: "Front Elevation", description: "Architectural wall tiles for building exteriors and feature walls." },
    { categoryName: "Kitchen", description: "Easy-maintenance tiles that suit modern kitchen surfaces and backsplashes." },
  ]);

  const products = await TileProduct.insertMany([
    {
      categoryId: categories[0]._id,
      design: "Marble Luxe",
      imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      size: { length: 600, width: 600, unit: "mm" },
      company: "Roca Tiles",
      price: 610,
      tilesPerBox: 4,
      unitType: "Box",
    },
    {
      categoryId: categories[0]._id,
      design: "Stone Grey",
      imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
      size: { length: 600, width: 600, unit: "mm" },
      company: "Ceramica",
      price: 540,
      tilesPerBox: 5,
      unitType: "Box",
    },
    {
      categoryId: categories[1]._id,
      design: "Ocean Gloss",
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      size: { length: 300, width: 600, unit: "mm" },
      company: "AquaLine",
      price: 420,
      tilesPerBox: 8,
      unitType: "Box",
    },
    {
      categoryId: categories[1]._id,
      design: "Matte Wave",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      size: { length: 300, width: 600, unit: "mm" },
      company: "CeraCraft",
      price: 390,
      tilesPerBox: 10,
      unitType: "Box",
    },
    {
      categoryId: categories[2]._id,
      design: "Cement Texture",
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      size: { length: 400, width: 800, unit: "mm" },
      company: "UrbanStone",
      price: 720,
      tilesPerBox: 3,
      unitType: "Box",
    },
    {
      categoryId: categories[3]._id,
      design: "Pearl White",
      imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
      size: { length: 300, width: 300, unit: "mm" },
      company: "HomeTile",
      price: 280,
      tilesPerBox: 12,
      unitType: "Box",
    },
    {
      categoryId: categories[0]._id,
      design: "Royal Onyx Black",
      imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
      size: { length: 600, width: 1200, unit: "mm" },
      company: "Master Tiles",
      price: 890,
      tilesPerBox: 2,
      unitType: "Box",
    },
    {
      categoryId: categories[3]._id,
      design: "Spanish Terracotta",
      imageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
      size: { length: 400, width: 400, unit: "mm" },
      company: "Iberia Craft",
      price: 490,
      tilesPerBox: 6,
      unitType: "Box",
    },
  ]);

  const warehouses = await Warehouse.insertMany([
    { name: "Main Warehouse Karachi", type: "Warehouse", address: "Industrial Area, Karachi", contactNumber: "+922112345678" },
    { name: "North Distribution Hub", type: "Warehouse", address: "Faisalabad Road, Lahore", contactNumber: "+924455667788" },
  ]);

  const outlets = await Outlet.insertMany([
    { name: "Gulshan Outlet", type: "Outlet", address: "Gulshan-e-Iqbal, Karachi", contactNumber: "+923333221100" },
    { name: "DHA Showroom", type: "Outlet", address: "DHA Phase 6, Karachi", contactNumber: "+923334445566" },
  ]);

  const inventory = await Inventory.insertMany([
    { productId: products[0]._id, locationId: warehouses[0]._id, locationType: "Warehouse", boxCount: 48, areaCovered: 336, updatedAt: new Date() },
    { productId: products[1]._id, locationId: warehouses[1]._id, locationType: "Warehouse", boxCount: 32, areaCovered: 250, updatedAt: new Date() },
    { productId: products[2]._id, locationId: outlets[0]._id, locationType: "Outlet", boxCount: 18, areaCovered: 120, updatedAt: new Date() },
    { productId: products[4]._id, locationId: outlets[1]._id, locationType: "Outlet", boxCount: 22, areaCovered: 170, updatedAt: new Date() },
  ]);

  const stockTransfers = await StockTransfer.insertMany([
    {
      productId: products[0]._id,
      sourceWarehouseId: warehouses[0]._id,
      destinationOutletId: outlets[0]._id,
      adminId: admins[0]._id,
      boxCount: 12,
      status: "Pending",
      transferDate: new Date(),
    },
    {
      productId: products[2]._id,
      sourceWarehouseId: warehouses[1]._id,
      destinationOutletId: outlets[1]._id,
      adminId: admins[1]._id,
      boxCount: 16,
      status: "In Transit",
      transferDate: new Date(),
    },
    {
      productId: products[3]._id,
      sourceWarehouseId: warehouses[0]._id,
      destinationOutletId: outlets[1]._id,
      adminId: admins[2]._id,
      boxCount: 8,
      status: "Completed",
      transferDate: new Date(),
    },
  ]);

  const orders = await Order.insertMany([
    { customerId: customers[0]._id, orderType: "COD", status: "Pending", totalAmount: 2460, orderDate: new Date() },
    { customerId: customers[1]._id, orderType: "Quotation", status: "Confirmed", totalAmount: 3960, orderDate: new Date() },
    { customerId: customers[2]._id, orderType: "COD", status: "Delivered", totalAmount: 1680, orderDate: new Date() },
  ]);

  const orderItems = await OrderItem.insertMany([
    { orderId: orders[0]._id, productId: products[0]._id, boxQuantity: 2, unitPrice: 610 },
    { orderId: orders[0]._id, productId: products[2]._id, boxQuantity: 1, unitPrice: 420 },
    { orderId: orders[1]._id, productId: products[4]._id, boxQuantity: 3, unitPrice: 720 },
    { orderId: orders[2]._id, productId: products[5]._id, boxQuantity: 4, unitPrice: 280 },
  ]);

  const reports = await Report.insertMany([
    { adminId: admins[0]._id, reportType: "Weekly Sales", dateRange: { from: new Date("2026-08-01"), to: new Date("2026-08-07") }, generatedAt: new Date() },
    { adminId: admins[1]._id, reportType: "Stock Alert", dateRange: { from: new Date("2026-08-02"), to: new Date("2026-08-09") }, generatedAt: new Date() },
    { adminId: admins[2]._id, reportType: "Outlet Summary", dateRange: { from: new Date("2026-08-03"), to: new Date("2026-08-11") }, generatedAt: new Date() },
  ]);

  console.log("Seed data inserted successfully.");
  console.log({ admins: admins.length, customers: customers.length, categories: categories.length, products: products.length, inventory: inventory.length, warehouses: warehouses.length, outlets: outlets.length, stockTransfers: stockTransfers.length, orders: orders.length, orderItems: orderItems.length, reports: reports.length });

  await mongoose.disconnect();
}

seedDatabase().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
