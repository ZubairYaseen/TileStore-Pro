const { NextResponse } = require("next/server");
const { buildClearCookie } = require("../../../../lib/auth");

async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", buildClearCookie());
  return response;
}

module.exports = { POST };
