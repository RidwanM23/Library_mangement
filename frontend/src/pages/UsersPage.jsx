import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import "@material/web/dialog/dialog.js";
import "@material/web/button/text-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/icon/icon.js";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ nama: "", email: "", password: "" });
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const dialogRef = useRef(null);

  const colors = [
    "#FF5722",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#FFC107",
    "#FF9800",
    "#795548",
  ];

  const getAvatarColor = (name) => {
    const index = name.length % colors.length;
    return colors[index];
  };

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
    setTimeout(() => setSnackbar({ open: false, message: "" }), 4000);
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation based on LoginPage logic
    const isEmailInvalid =
      !form.email.includes("@") || !form.email.split("@")[1]?.includes(".");
    const isPasswordInvalid =
      form.password.length < 8 || form.password.length > 16;

    if (isEmailInvalid) {
      showSnackbar("Email must include a valid domain (e.g., .com)");
      return;
    }

    if (isPasswordInvalid) {
      showSnackbar("Password must be between 8 and 16 characters");
      return;
    }

    try {
      const res = await api.post("/users", form);
      if (res.data.success) {
        setForm({ nama: "", email: "", password: "" });
        fetchUsers();
        showSnackbar("User added successfully!");
      }
    } catch (error) {
      console.error("Failed to add user", error);
      showSnackbar(
        "Error adding user: " +
          (error.response?.data?.message || "Unknown error"),
      );
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    dialogRef.current?.show();
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/users/${deleteId}`);
      if (res.data.success) {
        fetchUsers();
        dialogRef.current?.close();
        showSnackbar("User has been deleted");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
      showSnackbar("Error deleting user");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="page-container">
      <h2
        className="page-title"
        style={{ display: "flex", alignItems: "center", gap: "12px" }}
      >
        User Management
      </h2>

      <div
        className="section-card shadow-2"
        style={{
          "--accent-color": "var(--secondary)",
          background:
            "linear-gradient(to bottom right, var(--surface-container), var(--background))",
          borderTop: "4px solid var(--secondary)",
        }}
      >
        <h3
          style={{
            marginBottom: "1.5rem",
            fontSize: "1.2rem",
            fontWeight: "600",
            color: "var(--secondary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <md-icon>person_add</md-icon>
          Register New User
        </h3>
        <form onSubmit={handleSubmit} className="form-group">
          <div
            style={{
              flex: 1,
              minWidth: "200px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "var(--outline)",
                marginLeft: "4px",
              }}
            >
              Full Name
            </label>
            <input
              className="input-field"
              placeholder="e.g. John Doe"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
            />
          </div>
          <div
            style={{
              flex: 1,
              minWidth: "200px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "var(--outline)",
                marginLeft: "4px",
              }}
            >
              Email Address
            </label>
            <input
              className="input-field"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div
            style={{
              flex: 1,
              minWidth: "200px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "var(--outline)",
                marginLeft: "4px",
              }}
            >
              Secure Password (8-16 chars)
            </label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              minLength={8}
              maxLength={16}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              backgroundColor: "var(--secondary)",
              alignSelf: "flex-end",
              height: "48px",
              marginBottom: "4px",
            }}
          >
            <md-icon style={{ fontSize: "1.2rem" }}>how_to_reg</md-icon>
            <span>Register User</span>
          </button>
        </form>
      </div>

      <div className="table-container shadow-3" style={{ border: "none" }}>
        <table className="m3-table">
          <thead>
            <tr
              style={{
                background: "var(--secondary-container)",
                color: "var(--on-secondary-container)",
              }}
            >
              <th
                style={{
                  width: "80px",
                  borderTopLeftRadius: "var(--radius-l)",
                }}
              >
                ID
              </th>
              <th>Member Profile</th>
              <th>Email</th>
              <th
                style={{
                  width: "120px",
                  textAlign: "right",
                  borderTopRightRadius: "var(--radius-l)",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={{ color: "var(--outline)", fontWeight: "500" }}>
                    #{u.id}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: getAvatarColor(u.nama),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "700",
                          fontSize: "1rem",
                          boxShadow: "var(--shadow-1)",
                        }}
                      >
                        {u.nama.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "600", fontSize: "1rem" }}>
                          {u.nama}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--outline)",
                          }}
                        >
                          Registered Member
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "var(--primary)",
                      }}
                    >
                      <md-icon style={{ fontSize: "1rem" }}>mail</md-icon>
                      {u.email}
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="btn btn-error"
                      style={{
                        padding: "8px",
                        minWidth: "40px",
                        borderRadius: "12px",
                      }}
                      title="Delete User"
                    >
                      <md-icon style={{ fontSize: "1.2rem" }}>
                        delete_forever
                      </md-icon>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "4rem",
                    color: "var(--outline)",
                  }}
                >
                  <md-icon
                    style={{
                      fontSize: "3rem",
                      marginBottom: "1rem",
                      opacity: 0.5,
                    }}
                  >
                    group_off
                  </md-icon>
                  <div>No members joined the library yet</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <md-dialog ref={dialogRef} type="alert">
        <md-icon slot="icon" style={{ color: "var(--error)" }}>
          person_remove
        </md-icon>
        <div slot="headline">Revoke Membership?</div>
        <form id="delete-form" slot="content" method="dialog">
          This will permanently delete the user account and revoke all library
          privileges. This action is irreversible.
        </form>
        <div slot="actions">
          <md-text-button form="delete-form" value="cancel">
            Cancel
          </md-text-button>
          <md-filled-button
            style={{ "--md-filled-button-container-color": "var(--error)" }}
            onClick={handleConfirmDelete}
          >
            Revoke Access
          </md-filled-button>
        </div>
      </md-dialog>

      {snackbar.open && (
        <div
          className="snackbar shadow-3"
          style={{ borderLeft: "4px solid var(--secondary)" }}
        >
          <md-icon style={{ fontSize: "1.2rem", color: "white" }}>
            check_circle
          </md-icon>
          <span>{snackbar.message}</span>
        </div>
      )}
    </div>
  );
}
