const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function setupAdmin() {
  try {
    const email = "admin@lib.com";
    const password = "admin123";
    const nama = "Administrator";
    const hashed = await bcrypt.hash(password, 10);

    // Cek jika user sudah ada
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      // Update jika sudah ada
      await db.query(
        "UPDATE users SET password = ?, nama = ? WHERE email = ?",
        [hashed, nama, email],
      );
      console.log(
        "✅ SUKSES! User admin ditemukan dan password berhasil direset menjadi: admin123",
      );
    } else {
      // Insert jika belum ada
      await db.query(
        "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)",
        [nama, email, hashed],
      );
      console.log(
        "✅ SUKSES! User admin belum ada dan telah berhasil dibuat dengan email: admin@lib.com dan password: admin123",
      );
    }
    process.exit();
  } catch (error) {
    console.error("❌ Gagal:", error.message);
    process.exit(1);
  }
}

setupAdmin();
