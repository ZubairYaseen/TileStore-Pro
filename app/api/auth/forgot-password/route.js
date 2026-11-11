const { NextResponse } = require("next/server");
const bcrypt = require("bcryptjs");
const { connectToDatabase } = require("../../../../lib/db");
const { Customer, Admin } = require("../../../../models");

async function POST(request) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    await connectToDatabase();
    const normalizedEmail = email.toLowerCase().trim();

    // Check customer or admin
    let user = await Customer.findOne({ email: normalizedEmail });
    let isCustomer = true;

    if (!user) {
      user = await Admin.findOne({ email: normalizedEmail });
      isCustomer = false;
    }

    if (!user) {
      return NextResponse.json({ error: "No account found with this email address." }, { status: 404 });
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return NextResponse.json({
        success: true,
        message: "Password has been successfully reset! You can now log in with your new password.",
      });
    }

    // Account verified, prompt user to enter new password
    return NextResponse.json({
      success: true,
      verified: true,
      userName: user.name,
      message: `Account found for ${user.name}. Please enter your new password.`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}

module.exports = { POST };
