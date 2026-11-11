async function testEndpoints() {
  console.log("--- Testing TileStore Pro Endpoints ---");

  // 1. Home page
  const homeRes = await fetch("http://localhost:3000");
  console.log("1. GET /:", homeRes.status === 200 ? "PASS (200 OK)" : "FAIL " + homeRes.status);

  // 2. Public products API
  const prodRes = await fetch("http://localhost:3000/api/products");
  const products = await prodRes.json();
  console.log("2. GET /api/products:", Array.isArray(products) && products.length > 0 ? `PASS (${products.length} products found)` : "FAIL");
  console.log("   First product:", products[0]?.design, "| Image:", products[0]?.imageUrl?.slice(0, 45) + "...");

  // 3. Public single product API
  const firstId = products[0]?._id;
  const singleRes = await fetch(`http://localhost:3000/api/products/${firstId}`);
  const single = await singleRes.json();
  console.log("3. GET /api/products/[id]:", single?.design === products[0]?.design ? `PASS (Fetched ${single.design} successfully)` : "FAIL");

  // 4. Route protection (unauthenticated /admin/dashboard)
  const adminRes = await fetch("http://localhost:3000/admin/dashboard", { redirect: "manual" });
  console.log("4. Route protection /admin/dashboard:", adminRes.status === 307 || adminRes.status === 308 ? `PASS (Redirect ${adminRes.status} to ${adminRes.headers.get("location")})` : "FAIL " + adminRes.status);

  // 5. Admin Login
  const loginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@tilestore.com", password: "admin123", role: "admin" })
  });
  const loginData = await loginRes.json();
  const setCookie = loginRes.headers.get("set-cookie");
  console.log("5. POST /api/auth/login (Admin):", loginData.success ? `PASS (Role: ${loginData.role}, Name: ${loginData.name})` : "FAIL");

  // 6. Admin Reports (Previously had requireAdmin bug)
  const reportRes = await fetch("http://localhost:3000/api/admin/reports?type=sales", {
    headers: { "cookie": setCookie }
  });
  const reportData = await reportRes.json();
  console.log("6. GET /api/admin/reports:", reportRes.status === 200 && reportData.type ? `PASS (${reportData.type}, Orders: ${reportData.totalOrders})` : "FAIL " + reportRes.status);

  // 7. Admin Transfers (Previously had requireAdmin bug)
  const transferRes = await fetch("http://localhost:3000/api/admin/transfers", {
    headers: { "cookie": setCookie }
  });
  const transferData = await transferRes.json();
  console.log("7. GET /api/admin/transfers:", transferRes.status === 200 && Array.isArray(transferData) ? `PASS (${transferData.length} transfers found)` : "FAIL " + transferRes.status);

  // 8. Super Admin login & Users API
  const superLoginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "superadmin@tilestore.com", password: "admin123", role: "admin" })
  });
  const superSetCookie = superLoginRes.headers.get("set-cookie");
  const usersRes = await fetch("http://localhost:3000/api/admin/users", {
    headers: { "cookie": superSetCookie }
  });
  const usersData = await usersRes.json();
  console.log("8. GET /api/admin/users (Super Admin):", usersRes.status === 200 && Array.isArray(usersData) ? `PASS (${usersData.length} staff accounts found)` : "FAIL " + usersRes.status);

  console.log("--- All Automated Tests Completed ---");
}

testEndpoints().catch(console.error);
