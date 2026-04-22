import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from "recharts";
import { History, Download, Filter, Bug, TrendingUp, ChevronRight, Activity } from "lucide-react";

import { API_URL } from "../shared/config/api.js";

export default function ChartHama() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/detections`);
      if (response.data.success) {
        setHistoryData(response.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const barData = [...historyData].slice(0, 15).reverse().map((item) => ({
    name: new Date(item.waktu_deteksi).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    jumlah: item.jumlah,
  }));

  const trendData = Object.entries(
    historyData.reduce((dailyMap, item) => {
      const date = new Date(item.waktu_deteksi).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
      dailyMap[date] = (dailyMap[date] || 0) + item.jumlah;
      return dailyMap;
    }, {}),
  )
    .map(([date, total]) => ({ date, total }))
    .slice(-7);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse">Memuat chart hama...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-10 animate-in slide-in-from-bottom-5 duration-700">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl lg:rounded-3xl p-6 lg:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/20 blur-[120px] -mb-40 -mr-40 text-indigo-400"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 lg:gap-8">
          <div className="p-3 lg:p-4 bg-white/10 backdrop-blur-md rounded-xl lg:rounded-3xl border border-white/10 self-center md:self-start">
            <Activity className="w-8 h-8 lg:w-12 lg:h-12 text-indigo-400" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl lg:text-4xl font-black tracking-tight leading-none mb-2">Chart Hama</h2>
            <p className="text-slate-300 max-w-2xl font-bold text-[10px] lg:text-lg leading-relaxed">
              Grafik aktivitas dan riwayat deteksi hama pada lahan.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
        <div className="bg-white p-5 lg:p-9 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-xl">
          <div className="flex items-center justify-between mb-6 lg:mb-10">
            <div>
              <h3 className="text-lg lg:text-2xl font-black text-slate-800 leading-none">Tren Mingguan</h3>
              <p className="text-[10px] lg:text-sm font-bold text-slate-400 uppercase mt-1 tracking-widest">Hama per hari</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl lg:rounded-2xl">
              <TrendingUp className="w-5 h-5 lg:w-8 lg:h-8" />
            </div>
          </div>
          <div className="h-[220px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorChartHamaTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} />
                <Tooltip contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)", padding: "0.75rem" }} />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorChartHamaTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 lg:p-9 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-xl">
          <div className="flex items-center justify-between mb-6 lg:mb-10">
            <div>
              <h3 className="text-lg lg:text-3xl font-black text-slate-800 leading-none">Deteksi Terakhir</h3>
              <p className="text-[10px] lg:text-sm font-bold text-slate-400 uppercase mt-1 tracking-widest">15 data terbaru</p>
            </div>
            <div className="p-3 bg-slate-50 text-slate-400 rounded-xl lg:rounded-2xl">
              <History className="w-5 h-5 lg:w-8 lg:h-8" />
            </div>
          </div>
          <div className="h-[220px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 9, fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} />
                <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)", padding: "0.75rem" }} />
                <Bar dataKey="jumlah" radius={[4, 4, 0, 0]} barSize={16}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.jumlah > 10 ? "#ef4444" : "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-6 lg:p-10 border-b-2 border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30 text-center sm:text-left">
          <h3 className="text-lg lg:text-2xl font-black text-slate-800 flex items-center justify-center sm:justify-start gap-4 leading-none">
            <Filter className="w-5 h-5 text-slate-400" /> Semua Riwayat
          </h3>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 lg:px-9 py-3 lg:py-4 bg-slate-800 text-white rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-base hover:bg-slate-700 shadow-lg transition-all">
            <Download className="w-4 h-4" /> Download Laporan
          </button>
        </div>
        <div className="overflow-x-auto h-[400px] lg:h-auto overflow-y-auto custom-scrollbar">
          <table className="w-full text-left min-w-[600px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50/90 backdrop-blur-md text-slate-400 text-[10px] lg:text-sm font-black uppercase tracking-widest border-b border-slate-100">
                <th className="p-5 lg:p-6">Nama Hama</th>
                <th className="p-5 lg:p-6">Waktu Muncul</th>
                <th className="p-5 lg:p-6 text-center">Jumlah</th>
                <th className="p-5 lg:p-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {historyData.map((log, i) => (
                <tr key={i} className="group hover:bg-indigo-50/30 transition-all">
                  <td className="p-5 lg:p-6 border-l-4 lg:border-l-8 border-transparent group-hover:border-indigo-500">
                    <div className="flex items-center gap-4 lg:gap-6 leading-none">
                      <div className="w-10 h-10 lg:w-16 lg:h-16 bg-white rounded-xl lg:rounded-3xl flex items-center justify-center text-slate-400 border-2 border-slate-100 shadow-sm transition-transform group-hover:scale-110">
                        <Bug className="w-5 h-5 lg:w-8 lg:h-8 text-indigo-600" />
                      </div>
                      <p className="font-black text-slate-800 text-sm lg:text-xl">{log.jenis_hama}</p>
                    </div>
                  </td>
                  <td className="p-5 lg:p-6">
                    <div className="flex flex-col leading-snug">
                      <span className="text-slate-800 font-extrabold text-xs lg:text-lg">
                        {new Date(log.waktu_deteksi).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
                      </span>
                      <span className="text-slate-400 text-[10px] lg:text-base font-bold">
                        Jam {new Date(log.waktu_deteksi).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 lg:p-6 text-center">
                    <span className={`inline-block px-3 lg:px-8 py-1 lg:py-3 rounded-lg lg:rounded-full text-xs lg:text-lg font-black shadow-md leading-none ${log.jumlah > 10 ? "bg-red-600 text-white" : "bg-emerald-500 text-white"}`}>
                      {log.jumlah} Ekor
                    </span>
                  </td>
                  <td className="p-5 lg:p-6 text-right">
                    <button className="p-3 bg-slate-50 text-slate-400 group-hover:text-indigo-600 group-hover:bg-white rounded-xl shadow-sm transition-all leading-none">
                      <ChevronRight className="w-5 h-5 lg:w-8 lg:h-8" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
