import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";

import { API_URL } from "../shared/config/api.js";

export default function Login({ setAuth, loginAs = "petani" }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = loginAs === "admin" ? "login-admin" : "login-petani";
      const response = await axios.post(`${API_URL}/api/v1/auth/${endpoint}`, { username, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setAuth({ token, user });
      navigate(loginAs === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-5 relative overflow-hidden font-jakarta">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-200/40 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/30 rounded-full blur-[120px] animate-pulse"></div>

      <div className="w-full max-w-[500px] relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl shadow-green-100 border border-slate-100 mb-6 group hover:scale-105 transition-transform duration-500">
            <LogIn className="w-9 h-9 text-green-600 group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tightest mb-2">
            SiTani <span className="text-green-600">Smart</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm lg:text-base uppercase tracking-[0.3em] opacity-60">
            {loginAs === "admin" ? "ADMIN PORTAL" : "Digital Agriculture"}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-3xl rounded-2xl lg:rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-6 lg:p-10 border border-white/50">
          <form onSubmit={handleLogin} className="space-y-5 lg:space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Pengguna</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-300 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input type="text" id="username" name="username" className="block w-full pl-14 pr-6 py-4 bg-white/50 border border-white focus:bg-white focus:border-green-500 rounded-xl outline-none transition-all font-bold text-slate-700 shadow-sm" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kata Sandi</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input type="password" id="password" name="password" className="block w-full pl-14 pr-6 py-4 bg-white/50 border border-white focus:bg-white focus:border-green-500 rounded-xl outline-none transition-all font-bold text-slate-700 shadow-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-4 p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl animate-in zoom-in duration-300">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-3 text-base lg:text-lg">
              {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <>{loginAs === "admin" ? "Masuk Admin" : "Masuk ke Dashboard"}</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              className="text-xs font-black text-green-700 hover:underline"
              to={loginAs === "admin" ? "/login" : "/admin/login"}
            >
              {loginAs === "admin" ? "Login sebagai Petani" : "Login sebagai Admin"}
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">&copy; 2026 Smart Farm SiTani &bull; v1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
