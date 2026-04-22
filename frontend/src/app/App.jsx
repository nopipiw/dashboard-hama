import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";

import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ChartHama from "../pages/ChartHama.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import DeteksiHariIni from "../pages/DeteksiHariIni.jsx";
import Login from "../pages/Login.jsx";
import LoginAdmin from "../pages/LoginAdmin.jsx";
import Pengaturan from "../pages/Pengaturan.jsx";
import Profil from "../pages/Profil.jsx";
import Admin from "../pages/Admin.jsx";
import Rekomendasi from "../pages/Rekomendasi.jsx";
import RiwayatGrafik from "../pages/RiwayatGrafik.jsx";
import { WS_URL } from "../shared/config/api.js";

function App() {
  const [auth, setAuth] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData && userData !== "undefined") {
        const user = JSON.parse(userData);
        if (user && typeof user === "object") {
          return { token, user };
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      localStorage.clear();
    }

    return null;
  });
  const [notification, setNotification] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!auth) {
      return undefined;
    }

    const socket = io(WS_URL, {
      transports: ["polling", "websocket"],
      withCredentials: true,
    });

    const onAlert = (data) => {
      console.log("Hama Alert received:", data);
      setNotification(data);
    };

    socket.on("hama-alert", onAlert);

    return () => {
      socket.off("hama-alert", onAlert);
      socket.disconnect();
    };
  }, [auth]);

  const handleLogout = () => {
    localStorage.clear();
    setAuth(null);
  };

  if (!auth) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/admin/login" element={<LoginAdmin setAuth={setAuth} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <DashboardLayout
        auth={auth}
        handleLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        notification={notification}
        setIsSidebarOpen={setIsSidebarOpen}
        setNotification={setNotification}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hari-ini" element={<DeteksiHariIni />} />
          <Route path="/chart-hama" element={<ChartHama />} />
          <Route path="/history" element={<RiwayatGrafik />} />
          <Route path="/rekomendasi" element={<Rekomendasi />} />
          <Route path="/admin" element={auth?.user?.role === "admin" ? <Admin /> : <Navigate to="/" replace />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
