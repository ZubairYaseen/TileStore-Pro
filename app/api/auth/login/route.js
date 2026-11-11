const { NextResponse } = require("next/server");
const bcrypt = require("bcryptjs");
const { connectToDatabase } = require("../../../../lib/db");
const { Admin, Customer } = require("../../../../models");
const { buildSessionCookie } = require("../../../../lib/auth");

async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    await connectToDatabase();

    let user = null;
    let userRole = null;

    if (role === "admin") {
      user = await Admin.findOne({ email: email.toLowerCase().trim() }).lean();
      userRole = user ? user.role : null;
    } else {
      user = await Customer.findOne({ email: email.toLowerCase().trim() }).lean();
      userRole = "Customer";
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const sessionPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: userRole,
    };

    const response = NextResponse.json({
      success: true,
      role: userRole,
      name: user.name,
    });

    response.headers.set("Set-Cookie", buildSessionCookie(sessionPayload));
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}

module.exports = { POST };
