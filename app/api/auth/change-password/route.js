const { NextResponse } = require("next/server");
const bcrypt = require("bcryptjs");
const { connectToDatabase } = require("../../../../lib/db");
const { Admin, Customer } = require("../../../../models");
const { getSession } = require("../../../../lib/auth");

async function POST(request) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both current and new passwords are required." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
    }

    await connectToDatabase();

    const isAdmin = session.role === "Admin" || session.role === "Super Admin";
    const Model = isAdmin ? Admin : Customer;
    const user = await Model.findById(session.id);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}

module.exports = { POST };
