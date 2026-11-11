const { NextResponse } = require("next/server");
const path = require("path");
const fs = require("fs");
const { getSession } = require("../../../../lib/auth");

async function requireAdmin(request) {
  const session = getSession(request);
  if (!session || (session.role !== "Admin" && session.role !== "Super Admin")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

async function POST(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const mimeType = file.type || "";
    if (!mimeType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files (JPG, PNG, WebP, GIF, SVG) are allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    const rawExt = path.extname(file.name || "") || ".jpg";
    const safeExt = rawExt.toLowerCase().replace(/[^a-z0-9.]/g, "") || ".jpg";
    const filename = `tile_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${safeExt}`;
    const targetPath = path.join(uploadsDir, filename);

    await fs.promises.writeFile(targetPath, buffer);

    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: fileUrl, filename });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}

module.exports = { POST };
