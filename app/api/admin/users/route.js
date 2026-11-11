const { NextResponse } = require("next/server");
const bcrypt = require("bcryptjs");
const { connectToDatabase } = require("../../../../lib/db");
const { Admin } = require("../../../../models");
const { getSession } = require("../../../../lib/auth");

function requireSuperAdmin(request) {
  const session = getSession(request);
  if (!session || session.role !== "Super Admin") {
    return null;
  }
  return session;
}

async function GET(request) {
  const session = requireSuperAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Access denied. Super Admin privileges required." }, { status: 403 });
  }

  await connectToDatabase();
  const admins = await Admin.find({}).select("-password").sort({ createdAt: -1 }).lean();

  return NextResponse.json(
    admins.map((a) => ({
      ...a,
      _id: a._id.toString(),
    }))
  );
}

async function POST(request) {
  const session = requireSuperAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Access denied. Super Admin privileges required." }, { status: 403 });
  }

  const body = await request.json();
  const { name, email, password, role } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  await connectToDatabase();
  const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return NextResponse.json({ error: "An admin account with this email already exists." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = await Admin.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: role === "Super Admin" ? "Super Admin" : "Admin",
    createdAt: new Date(),
  });

  return NextResponse.json(
    {
      _id: newAdmin._id.toString(),
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      createdAt: newAdmin.createdAt,
    },
    { status: 201 }
  );
}

async function DELETE(request) {
  const session = requireSuperAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Access denied. Super Admin privileges required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Staff ID required." }, { status: 400 });
  }

  if (id === session.id) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }

  await connectToDatabase();
  await Admin.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}

module.exports = { GET, POST, DELETE };
