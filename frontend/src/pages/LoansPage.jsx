import { useState, useEffect } from "react";
import api from "../services/api";
import "@material/web/icon/icon.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    book_id: "",
    tanggal_pinjam: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
    setTimeout(() => setSnackbar({ open: false, message: "" }), 4000);
  };

  const fetchData = async () => {
    try {
      const resLoans = await api.get("/loans");
      setLoans(resLoans.data.data);

      const resUsers = await api.get("/users");
      setUsers(resUsers.data.data);

      const resBooks = await api.get("/books");
      setBooks(resBooks.data.data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/loans", form);
      setForm({ user_id: "", book_id: "", tanggal_pinjam: "" });
      fetchData();
      showSnackbar("Loan recorded successfully!");
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Failed to process loan");
    }
  };

  const handleReturn = async (id) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      await api.put(`/loans/${id}`, {
        tanggal_kembali: today,
        status: "dikembalikan",
      });
      fetchData();
      showSnackbar("Book has been returned.");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to update loan status.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(
      dateString.includes("T") ? dateString : `${dateString}T12:00:00`,
    );
    return date.toLocaleDateString("en-GB").replace(/\//g, "-");
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Loan Management</h2>

      <div
        className="section-card"
        style={{ "--accent-color": "var(--secondary)" }}
      >
        <h3
          style={{
            marginBottom: "1.5rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            color: "var(--secondary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <md-icon>add_shopping_cart</md-icon>
          New Loan Entry
        </h3>
        <form onSubmit={handleSubmit} className="form-group">
          <select
            className="input-field"
            value={form.user_id}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
            required
          >
            <option value="">-- Select Member --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nama}
              </option>
            ))}
          </select>
          <select
            className="input-field"
            value={form.book_id}
            onChange={(e) => setForm({ ...form, book_id: e.target.value })}
            required
          >
            <option value="">-- Select Book --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.judul}
              </option>
            ))}
          </select>
          <input
            className="input-field"
            type="date"
            value={form.tanggal_pinjam}
            onChange={(e) =>
              setForm({ ...form, tanggal_pinjam: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ backgroundColor: "var(--secondary)", color: "white" }}
          >
            <md-icon style={{ fontSize: "1.2rem" }}>book_online</md-icon>
            <span>Borrow Book</span>
          </button>
        </form>
      </div>

      <div className="table-container shadow-2">
        <table className="m3-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>ID</th>
              <th>Member</th>
              <th>Book Title</th>
              <th>Borrowed On</th>
              <th>Returned On</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? (
              loans.map((l) => (
                <tr key={l.id}>
                  <td>#{l.id}</td>
                  <td style={{ fontWeight: "600" }}>{l.user_nama}</td>
                  <td>{l.book_judul}</td>
                  <td>{formatDate(l.tanggal_pinjam)}</td>
                  <td>{formatDate(l.tanggal_kembali)}</td>
                  <td>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "120px",
                        textTransform: "uppercase",
                        backgroundColor:
                          l.status?.toLowerCase() === "dipinjam"
                            ? "var(--tertiary-container)"
                            : "var(--primary-container)",
                        color:
                          l.status?.toLowerCase() === "dipinjam"
                            ? "var(--on-tertiary-container)"
                            : "var(--on-primary-container)",
                      }}
                    >
                      <md-icon style={{ fontSize: "1rem", marginRight: "4px" }}>
                        {l.status?.toLowerCase() === "dipinjam"
                          ? "schedule"
                          : "check_circle"}
                      </md-icon>
                      {l.status ||
                        (l.tanggal_kembali ? "dikembalikan" : "dipinjam")}
                    </span>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    {l.status.toLowerCase() === "dipinjam" && (
                      <button
                        onClick={() => handleReturn(l.id)}
                        className="btn btn-outline"
                        style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                      >
                        <md-icon style={{ fontSize: "1rem" }}>
                          assignment_return
                        </md-icon>
                        Set Returned
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "var(--outline)",
                  }}
                >
                  No loan records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {snackbar.open && (
        <div className="snackbar shadow-3">
          <md-icon style={{ fontSize: "1.2rem" }}>info</md-icon>
          <span>{snackbar.message}</span>
        </div>
      )}
    </div>
  );
}
