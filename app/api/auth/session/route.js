const { NextResponse } = require("next/server");
const { getSession } = require("../../../../lib/auth");

async function GET(request) {
  try {
    const session = getSession(request);
    if (!session || !session.role) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      name: session.name || "User",
      role: session.role,
      email: session.email,
      id: session.id,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}

module.exports = { GET };
