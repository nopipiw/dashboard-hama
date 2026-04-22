import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Shield, Users, Bug, Lightbulb, RefreshCw, Trash2, Plus } from "lucide-react";

import { API_URL } from "../shared/config/api.js";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const Section = ({ icon, title, children, onRefresh, busy }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-slate-900 text-white">{icon}</div>
        <div>
          <h2 className="text-lg font-black text-slate-800">{title}</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mode Admin</p>
        </div>
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 font-black text-xs text-slate-700"
        type="button"
      >
        <RefreshCw className={`w-4 h-4 ${busy ? "animate-spin" : ""}`} />
        Refresh
      </button>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export default function Admin() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const isAdmin = user?.role === "admin";

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [hamas, setHamas] = useState([]);
  const [rules, setRules] = useState([]);
  const [users, setUsers] = useState([]);

  const [newHama, setNewHama] = useState({ nama_hama: "", deskripsi: "", aktif: true });
  const [newRule, setNewRule] = useState({ hama_id: "", ambang_batas: 0, tingkat_serangan: "ringan", rekomendasi: "", aktif: true });
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "petani" });

  const api = axios.create({
    baseURL: API_URL,
    headers: { ...getAuthHeader() },
  });

  const loadAll = async () => {
    setError("");
    setBusy(true);
    try {
      const [hRes, rRes, uRes] = await Promise.all([
        api.get("/api/v1/hamas"),
        api.get("/api/v1/rules"),
        api.get("/api/v1/users"),
      ]);
      setHamas(hRes.data?.data || []);
      setRules(rRes.data?.data || []);
      setUsers(uRes.data?.data || []);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Gagal memuat data admin.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const createHama = async () => {
    setError("");
    try {
      await api.post("/api/v1/hamas", newHama);
      setNewHama({ nama_hama: "", deskripsi: "", aktif: true });
      await loadAll();
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Gagal membuat hama.");
    }
  };

  const toggleHama = async (h) => {
    setError("");
    try {
      await api.put(`/api/v1/hamas/${h._id}`, { aktif: !h.aktif });
      await loadAll();
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Gagal update hama.");
    }
  };

  const deleteHama = async (id) => {
    setError("");
    try {
      await api.delete(`/api/v1/hamas/${id}`);
      await loadAll();
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Gagal hapus hama.");
    }
  };

  const createRule = async () => {
    setError("");
    try {
      await api.post("/api/v1/rules", newRule);
      setNewRule({ hama_id: "", ambang_batas: 0, tingkat_serangan: "ringan", rekomendasi: "", aktif: true });
      await loadAll();
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Gagal membuat rekomendasi.");
    }
  };

  const deleteRule = async (id) => {
    setError("");
    try {
      await api.delete(`/api/v1/rules/${id}`);
      await loadAll();
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Gagal hapus rekomendasi.");
    }
  };

  const createUser = async () => {
    setError("");
    try {
      await api.post("/api/v1/users", newUser);
      setNewUser({ username: "", email: "", password: "", role: "petani" });
      await loadAll();
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Gagal membuat user.");
    }
  };

  const updateUserRole = async (u, role) => {
    setError("");
    try {
      await api.put(`/api/v1/users/${u._id}`, { role });
      await loadAll();
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Gagal update role user.");
    }
  };

  const deleteUser = async (id) => {
    setError("");
    try {
      await api.delete(`/api/v1/users/${id}`);
      await loadAll();
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Gagal hapus user.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-10 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white font-black">
          <Shield className="w-5 h-5" />
          Akses Admin Dibutuhkan
        </div>
        <p className="mt-4 text-slate-400 font-bold">Login sebagai user dengan role `admin` untuk membuka halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-7 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Administrasi Sistem</h1>
          <p className="text-slate-400 font-bold text-sm">Kelola master data & pengguna (data-driven)</p>
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest">
          {user?.username} · admin
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl border border-red-100 bg-red-50 text-red-700 font-bold text-sm">
          {error}
        </div>
      )}

      <Section icon={<Bug className="w-5 h-5" />} title="Master Hama" onRefresh={loadAll} busy={busy}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100">
                  <th className="py-3 pr-3">Foto</th>
                  <th className="py-3 pr-3">Nama</th>
                  <th className="py-3 pr-3">Aktif</th>
                  <th className="py-3 pr-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {hamas.map((h) => (
                  <tr key={h._id}>
                    <td className="py-3 pr-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                        {h.gambar ? (
                          <img src={h.gambar} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-black">N/A</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-3 font-black text-slate-800 capitalize">{h.nama_hama}</td>
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        onClick={() => toggleHama(h)}
                        className={`px-3 py-1 rounded-full font-black text-xs border ${
                          h.aktif ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {h.aktif ? "AKTIF" : "NONAKTIF"}
                      </button>
                    </td>
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        onClick={() => deleteHama(h._id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 font-black text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {hamas.length === 0 && (
                  <tr>
                    <td className="py-6 text-slate-400 font-bold" colSpan={3}>
                      Belum ada data hama.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <h3 className="font-black text-slate-800 mb-3">Tambah Hama</h3>
            <div className="space-y-3">
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-bold"
                placeholder="nama_hama (contoh: wereng)"
                value={newHama.nama_hama}
                onChange={(e) => setNewHama((s) => ({ ...s, nama_hama: e.target.value }))}
              />
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-bold min-h-[90px]"
                placeholder="deskripsi (opsional)"
                value={newHama.deskripsi}
                onChange={(e) => setNewHama((s) => ({ ...s, deskripsi: e.target.value }))}
              />
              <label className="flex items-center gap-2 font-black text-slate-700 text-xs">
                <input
                  type="checkbox"
                  checked={newHama.aktif}
                  onChange={(e) => setNewHama((s) => ({ ...s, aktif: e.target.checked }))}
                />
                Aktif
              </label>
              <button
                type="button"
                onClick={createHama}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-black"
              >
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={<Lightbulb className="w-5 h-5" />} title="Master Rekomendasi" onRefresh={loadAll} busy={busy}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100">
                  <th className="py-3 pr-3">Hama</th>
                  <th className="py-3 pr-3">Ambang</th>
                  <th className="py-3 pr-3">Level</th>
                  <th className="py-3 pr-3">Aktif</th>
                  <th className="py-3 pr-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rules.map((r) => (
                  <tr key={r._id}>
                    <td className="py-3 pr-3 font-black text-slate-800 capitalize">{r?.hama_id?.nama_hama || r.jenis_hama || "-"}</td>
                    <td className="py-3 pr-3 font-bold text-slate-700">{r.ambang_batas ?? "-"}</td>
                    <td className="py-3 pr-3 font-bold text-slate-700 uppercase">{r.tingkat_serangan || r.status_level || "-"}</td>
                    <td className="py-3 pr-3">
                      <span className={`px-2.5 py-1 rounded-full font-black text-xs border ${r.aktif ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                        {r.aktif ? "ON" : "OFF"}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        onClick={() => deleteRule(r._id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 font-black text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {rules.length === 0 && (
                  <tr>
                    <td className="py-6 text-slate-400 font-bold" colSpan={5}>
                      Belum ada rekomendasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <h3 className="font-black text-slate-800 mb-3">Tambah Rekomendasi (Legacy)</h3>
            <div className="space-y-3">
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-bold"
                value={newRule.hama_id}
                onChange={(e) => setNewRule((s) => ({ ...s, hama_id: e.target.value }))}
              >
                <option value="">Pilih hama...</option>
                {hamas.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.nama_hama}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-bold"
                value={newRule.ambang_batas}
                onChange={(e) => setNewRule((s) => ({ ...s, ambang_batas: Number(e.target.value) }))}
                min={0}
              />
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-bold"
                value={newRule.tingkat_serangan}
                onChange={(e) => setNewRule((s) => ({ ...s, tingkat_serangan: e.target.value }))}
              >
                <option value="ringan">ringan</option>
                <option value="sedang">sedang</option>
                <option value="berat">berat</option>
              </select>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-bold min-h-[110px]"
                placeholder="rekomendasi"
                value={newRule.rekomendasi}
                onChange={(e) => setNewRule((s) => ({ ...s, rekomendasi: e.target.value }))}
              />
              <label className="flex items-center gap-2 font-black text-slate-700 text-xs">
                <input
                  type="checkbox"
                  checked={newRule.aktif}
                  onChange={(e) => setNewRule((s) => ({ ...s, aktif: e.target.checked }))}
                />
                Aktif
              </label>
              <button
                type="button"
                onClick={createRule}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-black"
              >
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={<Users className="w-5 h-5" />} title="Kelola User" onRefresh={loadAll} busy={busy}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100">
                  <th className="py-3 pr-3">Username</th>
                  <th className="py-3 pr-3">Email</th>
                  <th className="py-3 pr-3">Role</th>
                  <th className="py-3 pr-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="py-3 pr-3 font-black text-slate-800">{u.username}</td>
                    <td className="py-3 pr-3 font-bold text-slate-700">{u.email}</td>
                    <td className="py-3 pr-3">
                      <select
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-black text-xs"
                        value={u.role}
                        onChange={(e) => updateUserRole(u, e.target.value)}
                      >
                        <option value="petani">petani</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        onClick={() => deleteUser(u._id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 font-black text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="py-6 text-slate-400 font-bold" colSpan={4}>
                      Belum ada user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <h3 className="font-black text-slate-800 mb-3">Tambah User</h3>
            <div className="space-y-3">
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-bold"
                placeholder="username"
                value={newUser.username}
                onChange={(e) => setNewUser((s) => ({ ...s, username: e.target.value }))}
              />
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-bold"
                placeholder="email"
                value={newUser.email}
                onChange={(e) => setNewUser((s) => ({ ...s, email: e.target.value }))}
              />
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-bold"
                placeholder="password"
                value={newUser.password}
                onChange={(e) => setNewUser((s) => ({ ...s, password: e.target.value }))}
              />
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-bold"
                value={newUser.role}
                onChange={(e) => setNewUser((s) => ({ ...s, role: e.target.value }))}
              >
                <option value="petani">petani</option>
                <option value="admin">admin</option>
              </select>
              <button
                type="button"
                onClick={createUser}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-black"
              >
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
