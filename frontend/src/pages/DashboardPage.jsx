import { useState, useEffect } from "react";
import api from "../services/api";
import "@material/web/icon/icon.js";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBuku: 0,
    totalUser: 0,
    peminjamanAktif: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard", error);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="page-container">
      <h2 className="page-title">Dashboard Overview</h2>
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div
          className="stat-card"
          style={{ "--accent-color": "var(--primary)" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <h3>Total Books</h3>
            <md-icon style={{ color: "var(--primary)", fontSize: "1.5rem" }}>
              library_books
            </md-icon>
          </div>
          <div className="value">{stats.totalBuku}</div>
        </div>
        <div
          className="stat-card"
          style={{ "--accent-color": "var(--secondary)" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <h3>Total User</h3>
            <md-icon style={{ color: "var(--secondary)", fontSize: "1.5rem" }}>
              group
            </md-icon>
          </div>
          <div className="value">{stats.totalUser}</div>
        </div>
        <div
          className="stat-card"
          style={{ "--accent-color": "var(--tertiary)" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <h3>Borrowed Books</h3>
            <md-icon style={{ color: "var(--tertiary)", fontSize: "1.5rem" }}>
              bookmark_added
            </md-icon>
          </div>
          <div className="value">{stats.peminjamanAktif}</div>
        </div>
      </div>
    </div>
  );
}
