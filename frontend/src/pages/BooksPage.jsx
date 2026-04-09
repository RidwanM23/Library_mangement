import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import "@material/web/dialog/dialog.js";
import "@material/web/button/text-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/icon/icon.js";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ judul: "", penulis: "", tahun: "" });
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const dialogRef = useRef(null);

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
    setTimeout(() => setSnackbar({ open: false, message: "" }), 4000);
  };

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      if (res.data.success) {
        setBooks(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil daftar buku", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/books", form);
      if (res.data.success) {
        setForm({ judul: "", penulis: "", tahun: "" });
        fetchBooks();
        showSnackbar("Book added successfully!");
      }
    } catch (error) {
      console.error("Gagal menambah buku", error);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    dialogRef.current?.show();
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/books/${deleteId}`);
      if (res.data.success) {
        fetchBooks();
        dialogRef.current?.close();
        showSnackbar("Book has been deleted");
      }
    } catch (error) {
      console.error("Gagal menghapus buku", error);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Book Collection Management</h2>

      <div
        className="section-card"
        style={{ "--accent-color": "var(--primary)" }}
      >
        <h3
          style={{
            marginBottom: "1.5rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <md-icon>add_circle</md-icon>
          Add New Book
        </h3>
        <form onSubmit={handleSubmit} className="form-group">
          <input
            className="input-field"
            placeholder="Book Title"
            value={form.judul}
            onChange={(e) => setForm({ ...form, judul: e.target.value })}
            required
          />
          <input
            className="input-field"
            placeholder="Author"
            value={form.penulis}
            onChange={(e) => setForm({ ...form, penulis: e.target.value })}
            required
          />
          <input
            className="input-field"
            placeholder="Tahun Terbit"
            type="date"
            value={form.tahun}
            onChange={(e) => setForm({ ...form, tahun: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary">
            <md-icon style={{ fontSize: "1.2rem" }}>auto_stories</md-icon>
            <span>Add Book</span>
          </button>
        </form>
      </div>

      <div className="table-container shadow-2">
        <table className="m3-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>Id</th>
              <th style={{ width: "50px" }}>No</th>
              <th>Title</th>
              <th>Author</th>
              <th style={{ width: "120px" }}>Publish Year</th>
              <th style={{ width: "120px", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((b, index) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: "600" }}>{b.judul}</td>
                  <td>{b.penulis}</td>
                  <td>{b.tahun}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="btn btn-error"
                      style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                    >
                      <md-icon style={{ fontSize: "1.2rem" }}>delete</md-icon>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "var(--outline)",
                  }}
                >
                  No books available at the moment
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <md-dialog ref={dialogRef} type="alert">
        <md-icon slot="icon" style={{ color: "var(--error)" }}>
          warning
        </md-icon>
        <div slot="headline">Delete Book</div>
        <form id="delete-form" slot="content" method="dialog">
          Are you sure you want to delete this book? This action cannot be
          undone.
        </form>
        <div slot="actions">
          <md-text-button form="delete-form" value="cancel">
            Cancel
          </md-text-button>
          <md-filled-button
            style={{ "--md-filled-button-container-color": "var(--error)" }}
            onClick={handleConfirmDelete}
          >
            Delete
          </md-filled-button>
        </div>
      </md-dialog>

      {snackbar.open && (
        <div className="snackbar shadow-3">
          <md-icon style={{ fontSize: "1.2rem" }}>info</md-icon>
          <span>{snackbar.message}</span>
        </div>
      )}
    </div>
  );
}
