const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Super Admin"], default: "Admin" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "Admins" }
);

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "Customers" }
);

const tileCategorySchema = new Schema(
  {
    categoryName: { type: String, required: true },
    description: { type: String, required: true },
  },
  { collection: "TileCategories" }
);

const tileProductSchema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "TileCategory", required: true },
    design: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    size: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      unit: { type: String, enum: ["mm", "cm", "in"], default: "mm" },
    },
    company: { type: String, required: true },
    price: { type: Number, required: true },
    tilesPerBox: { type: Number, required: true },
    unitType: { type: String, enum: ["Box", "Piece", "Sqm"], default: "Box" },
  },
  { collection: "TileProducts" }
);

const inventorySchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "TileProduct", required: true },
    locationId: { type: Schema.Types.ObjectId, required: true },
    locationType: { type: String, enum: ["Warehouse", "Outlet"], required: true },
    boxCount: { type: Number, default: 0 },
    areaCovered: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Inventory" }
);

const warehouseSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
  },
  { collection: "Warehouses" }
);

const outletSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
  },
  { collection: "Outlets" }
);

const stockTransferSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "TileProduct", required: true },
    sourceWarehouseId: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true },
    destinationOutletId: { type: Schema.Types.ObjectId, ref: "Outlet", required: true },
    adminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    boxCount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "In Transit", "Completed"], default: "Pending" },
    transferDate: { type: Date, default: Date.now },
  },
  { collection: "StockTransfers" }
);

const orderSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    orderType: { type: String, enum: ["COD", "Quotation"], default: "COD" },
    status: { type: String, enum: ["Pending", "Confirmed", "Delivered", "Cancelled"], default: "Pending" },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
  },
  { collection: "Orders" }
);

const orderItemSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "TileProduct", required: true },
    boxQuantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { collection: "OrderItems" }
);

const reportSchema = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    reportType: { type: String, required: true },
    dateRange: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
    generatedAt: { type: Date, default: Date.now },
  },
  { collection: "Reports" }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);
const TileCategory = mongoose.models.TileCategory || mongoose.model("TileCategory", tileCategorySchema);
const TileProduct = mongoose.models.TileProduct || mongoose.model("TileProduct", tileProductSchema);
const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
const Warehouse = mongoose.models.Warehouse || mongoose.model("Warehouse", warehouseSchema);
const Outlet = mongoose.models.Outlet || mongoose.model("Outlet", outletSchema);
const StockTransfer = mongoose.models.StockTransfer || mongoose.model("StockTransfer", stockTransferSchema);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
const OrderItem = mongoose.models.OrderItem || mongoose.model("OrderItem", orderItemSchema);
const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

module.exports = {
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
};
