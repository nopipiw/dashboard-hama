import React, { useEffect, useState } from "react";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Bug, History, Lightbulb, AlertCircle, RefreshCw, Clock } from "lucide-react";

import { API_URL } from "../shared/config/api.js";

const statusStyles = {
  Bahaya: {
    panel: "bg-red-50/90 border-red-200",
    icon: "bg-red-600 text-white",
    text: "text-red-600",
    label: "BAHAYA!",
  },
  Waspada: {
    panel: "bg-amber-50/90 border-amber-200",
    icon: "bg-amber-500 text-white",
    text: "text-amber-600",
    label: "WASPADA",
  },
  Normal: {
    panel: "bg-green-50/90 border-green-200",
    icon: "bg-green-600 text-white",
    text: "text-green-700",
    label: "AMAN",
  },
};

const statusPriority = {
  Normal: 0,
  Waspada: 1,
  Bahaya: 2,
};

const formatPestName = (value = "") => value.charAt(0).toUpperCase() + value.slice(1);

export default function Dashboard() {
  const [dataLog, setDataLog] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const [detectionsResponse, analysisResponse] = await Promise.all([
        axios.get(`${API_URL}/api/v1/detections/today`),
        axios.get(`${API_URL}/api/v1/analysis`),
      ]);

      if (detectionsResponse.data && detectionsResponse.data.success && Array.isArray(detectionsResponse.data.data)) {
        setDataLog(detectionsResponse.data.data);
        setError(null);
      } else {
        setDataLog([]);
      }

      if (analysisResponse.data && analysisResponse.data.success && Array.isArray(analysisResponse.data.data)) {
        setRecommendations(analysisResponse.data.data);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      if (dataLog.length === 0) {
        setError("Tidak dapat memuat data. Pastikan Backend & Database sudah aktif.");
      }
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 15000);
    return () => clearInterval(interval);
  }, []);

  const safeData = Array.isArray(dataLog) ? dataLog : [];
  const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];
  const totalHama = safeData.reduce((acc, curr) => acc + (Number(curr?.jumlah) || 0), 0);
  const uniqueHama = [...new Set(safeData.map((d) => d?.jenis_hama).filter(Boolean))].length;
  const highestRecommendation = safeRecommendations.reduce((highest, item) => {
    const currentStatus = item?.status || "Normal";
    const highestStatus = highest?.status || "Normal";
    return statusPriority[currentStatus] > statusPriority[highestStatus] ? item : highest;
  }, null);
  const dashboardStatus = highestRecommendation?.status || "Normal";
  const dashboardStyle = statusStyles[dashboardStatus] || statusStyles.Normal;

  const getRekomendasi = () => {
    if (safeData.length === 0) return "Belum ada deteksi hama hari ini.";
    if (!highestRecommendation) return "Kondisi lahan hari ini terpantau aman.";
    return `${formatPestName(highestRecommendation.jenis_hama)}: ${highestRecommendation.saran}`;
  };

  if (error && dataLog.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-red-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative p-8 bg-white rounded-2xl shadow-2xl shadow-red-100 border border-red-50">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>
        <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Koneksi Terputus</h3>
        <p className="text-slate-400 font-bold max-w-sm mx-auto mb-10 leading-relaxed uppercase text-xs tracking-[0.2em]">
          Belum bisa mengambil data dari server. <br />Pastikan backend & database sudah online.
        </p>
        <button
          onClick={() => fetchData(true)}
          className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-2xl"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
          Coba Hubungkan Lagi
        </button>
      </div>
    );
  }

  if (loading && dataLog.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <div className="relative">
          <div className="w-24 h-24 border-[6px] border-slate-100 border-t-green-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-8 h-8 text-slate-200" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Menghubungkan ke IoT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-5 animate-in fade-in duration-700 px-2 md:px-0">
      <div className={`p-4 lg:px-6 lg:py-5 rounded-2xl shadow-[0_16px_34px_rgba(15,23,42,0.07)] border ${dashboardStyle.panel} transition-all`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-5">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className={`p-3.5 lg:p-4 rounded-[1.2rem] ${dashboardStyle.icon} shadow-lg`}>
              <Activity className="w-8 h-8 lg:w-10 lg:h-10" />
            </div>
            <div>
              <p className="text-[11px] lg:text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-2 leading-none">Status Sawah Hari Ini</p>
              <h2 className={`text-[1.85rem] lg:text-[2.6rem] font-black leading-[0.92] tracking-tight ${dashboardStyle.text}`}>
                {dashboardStyle.label}
              </h2>
            </div>
          </div>
          <div className="bg-white/85 backdrop-blur-md p-4 lg:p-5 rounded-[1.2rem] border border-white shadow-inner max-w-[360px] w-full">
            <h4 className="text-[11px] lg:text-xs font-black text-slate-400 uppercase tracking-[0.16em] mb-2.5 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Saran Petani:
            </h4>
            <p className="text-[15px] lg:text-[0.98rem] font-bold text-slate-700 leading-relaxed">{getRekomendasi()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        <StatCard icon={<Bug className="w-6 h-6 lg:w-10 lg:h-10" />} title="Ada Berapa Jenis?" value={uniqueHama} subtitle="Jenis Hama" color="bg-amber-50 text-amber-600 border-amber-200" />
        <StatCard icon={<Activity className="w-6 h-6 lg:w-10 lg:h-10" />} title="Total Terlihat" value={totalHama} subtitle="Ekor Hama" color="bg-emerald-50 text-emerald-600 border-emerald-200" />
        <StatCard icon={<History className="w-6 h-6 lg:w-10 lg:h-10" />} title="Laporan Masuk" value={dataLog.length} subtitle="Catatan" color="bg-blue-50 text-blue-600 border-blue-200" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.9fr)] gap-4 lg:gap-5">
        <div className="bg-white p-4 lg:p-5 rounded-[1.45rem] border border-slate-100 shadow-[0_16px_34px_rgba(15,23,42,0.06)] overflow-hidden text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 lg:mb-5 gap-2">
            <div>
              <h3 className="text-lg lg:text-[1.55rem] font-black text-slate-800 tracking-tight leading-none">Grafik Hama Hari Ini</h3>
              <p className="text-[11px] lg:text-xs font-bold text-slate-400 uppercase mt-1 tracking-[0.14em]">Melihat hama masuk hari ini</p>
            </div>
          </div>

          {dataLog.length > 0 ? (
            <div className="h-[220px] lg:h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[...safeData].reverse()}>
                  <defs>
                    <linearGradient id="colorJumlah" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="waktu_deteksi"
                    tickFormatter={(tick) => {
                      try {
                        return new Date(tick).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                      } catch {
                        return tick;
                      }
                    }}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} />
                  <Tooltip contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)", padding: "0.75rem" }} />
                  <Area type="monotone" dataKey="jumlah" stroke="#059669" strokeWidth={4} fillOpacity={1} fill="url(#colorJumlah)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-2xl">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-base text-slate-500 font-black">Belum ada data</p>
            </div>
          )}
        </div>

        <div className="bg-white p-4 lg:p-5 rounded-[1.45rem] border border-slate-100 shadow-[0_16px_34px_rgba(15,23,42,0.06)] flex flex-col min-h-[320px]">
          <h3 className="text-lg lg:text-[1.55rem] font-black text-slate-800 mb-4 lg:mb-5 flex items-center gap-3">Hama Terbaru Hari Ini</h3>
          <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {safeData.length > 0 ? (
              safeData.slice(0, 10).map((log, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3.5 hover:bg-slate-50 rounded-[1rem] transition-all border border-slate-100 bg-white">
                  <div className="p-2.5 bg-green-50 rounded-[0.95rem] shadow-sm">
                    <Bug className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-black text-slate-800 text-base lg:text-lg truncate leading-none capitalize">{log.jenis_hama}</p>
                      <span className="shrink-0 text-[11px] lg:text-sm bg-green-600 text-white font-black px-2.5 py-1 rounded-full shadow-sm">{log.jumlah}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <p className="text-[10px] lg:text-xs text-slate-500 font-bold uppercase tracking-[0.14em]">
                        {new Date(log.waktu_deteksi).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                <History className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-base font-black italic opacity-50">Kosong</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }) {
  return (
    <div className="bg-white p-4 lg:p-5 rounded-[1.35rem] border border-slate-100 shadow-[0_14px_30px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 bg-gradient-to-b from-white to-slate-50/70 min-h-[180px]">
      <div className="flex items-start gap-3 lg:gap-4 mb-4 lg:mb-5">
        <div className={`p-3 lg:p-3.5 rounded-[1rem] ${color} shadow-inner shrink-0`}>{icon}</div>
        <h3 className="font-black text-slate-500 text-[11px] lg:text-sm uppercase tracking-[0.12em] leading-snug">{title}</h3>
      </div>
      <div className="space-y-1">
        <p className="text-[2rem] lg:text-[2.6rem] font-black text-slate-800 leading-none tracking-tight">{value}</p>
        <p className="text-[11px] lg:text-sm font-black text-slate-400 uppercase tracking-[0.12em] opacity-80 leading-none">{subtitle}</p>
      </div>
    </div>
  );
}
