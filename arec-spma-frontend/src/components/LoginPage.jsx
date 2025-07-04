import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, Paper, Alert, Tabs, Tab
} from "@mui/material";
import axios from "../api/axios";
import loginBg from "../assets/login-bg.jpg";

export default function LoginPage({ setUser }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", {
        username: form.username,
        password: form.password,
      });
      setUser(res.data.user);
      // Save the token for later API calls
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    }
    setLoading(false);
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: {
          xs: "#f8fafc",
          md: `url(${loginBg}) left center/60% no-repeat, #f8fafc`
        },
        alignItems: "center",
        justifyContent: "flex-end"
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 400,
          mr: { xs: 0, md: 10 },
          p: 4,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Login
        </Typography>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Username" />
        </Tabs>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            autoFocus
          />
          <TextField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            type="password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, mb: 1 }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <Typography variant="body2" align="center">
          New User? <a href="/register">Register Account</a>
        </Typography>
      </Paper>
    </Box>
  );
}