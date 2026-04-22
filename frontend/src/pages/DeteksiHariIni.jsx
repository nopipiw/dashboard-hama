import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Download, Filter, Bug, AlertCircle, Clock, Lightbulb, RefreshCw } from "lucide-react";

import { API_URL } from "../shared/config/api.js";

export default function DeteksiHariIni() {
  const [todayData, setTodayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodayData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/detections/today`);
      if (response.data.success) {
        setTodayData(response.data.data);
      }
    } catch (err) {
      setError("Gagal mengambil data deteksi hari ini.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayData();
    const interval = setInterval(fetchTodayData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && todayData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse">Memuat data hari ini...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-10 animate-in slide-in-from-bottom-5 duration-700">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl lg:rounded-3xl p-6 lg:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[120px] -mr-40 -mt-40"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-3 lg:mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl lg:rounded-3xl border border-white/20">
                <Clock className="w-6 h-6 lg:w-10 lg:h-10 text-white" />
              </div>
              <h2 className="text-xl lg:text-4xl font-black tracking-tight leading-none">Cek Hama Hari Ini</h2>
            </div>
            <p className="text-emerald-50 max-w-2xl font-bold text-[10px] lg:text-lg leading-relaxed">
              Daftar hama masuk pada: <br />
              <span className="text-yellow-300 underline underline-offset-4">{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
            <div className="bg-white/20 backdrop-blur-xl p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-white/20 text-center shadow-inner min-w-[120px] lg:min-w-[160px]">
              <p className="text-[8px] lg:text-xs font-black uppercase tracking-[0.2em] mb-1 text-emerald-100">Total Hama</p>
              <p className="text-3xl lg:text-6xl font-black leading-none">{todayData.reduce((acc, curr) => acc + curr.jumlah, 0)}</p>
            </div>

            <Link
              to="/rekomendasi"
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-slate-900 px-6 lg:px-9 py-4 lg:py-5 rounded-2xl lg:rounded-3xl font-black text-sm lg:text-xl shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-105 border-b-4 lg:border-b-8 border-amber-600"
            >
              <Lightbulb className="w-6 h-6 lg:w-10 lg:h-10" /> SOLUSI
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-6 lg:p-10 border-b-2 border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
          <h3 className="text-lg lg:text-2xl font-black text-slate-800 flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-400" /> Catatan Hama
          </h3>
          <div className="flex items-center gap-2 lg:gap-4">
            <button onClick={fetchTodayData} className="p-3 lg:p-4 bg-white border-2 border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 lg:px-9 py-3 lg:py-4 bg-slate-800 text-white rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-base hover:bg-slate-700 shadow-lg transition-all">
              <Download className="w-4 h-4" /> Cetak Laporan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto h-[400px] lg:h-auto overflow-y-auto custom-scrollbar">
          {todayData.length > 0 ? (
            <table className="w-full text-left min-w-[600px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50/90 backdrop-blur-md text-slate-400 text-[10px] lg:text-sm font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="p-5 lg:p-6">Jam</th>
                  <th className="p-5 lg:p-6">Jenis Hama</th>
                  <th className="p-5 lg:p-6 text-center">Jumlah</th>
                  <th className="p-5 lg:p-6">Lahan</th>
                  <th className="p-5 lg:p-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {todayData.map((log, i) => (
                  <tr key={i} className="group hover:bg-emerald-50/30 transition-all">
                    <td className="p-5 lg:p-6 border-l-4 lg:border-l-8 border-transparent group-hover:border-emerald-500">
                      <div className="flex items-center gap-2 text-slate-600 font-extrabold text-xs lg:text-lg leading-none">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        {new Date(log.waktu_deteksi).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="p-5 lg:p-6">
                      <div className="flex items-center gap-3 lg:gap-6 leading-none">
                        <div className="w-10 h-10 lg:w-16 lg:h-16 bg-white rounded-xl lg:rounded-3xl flex items-center justify-center text-slate-400 border-2 border-slate-100 shadow-sm">
                          <Bug className="w-5 h-5 lg:w-8 lg:h-8 text-green-600" />
                        </div>
                        <p className="font-black text-slate-800 text-sm lg:text-xl">{log.jenis_hama}</p>
                      </div>
                    </td>
                    <td className="p-5 lg:p-6 text-center">
                      <span className="text-lg lg:text-3xl font-black text-slate-800 bg-slate-100 px-3 lg:px-5 py-1 lg:py-2 rounded-xl leading-none">{log.jumlah}</span>
                    </td>
                    <td className="p-5 lg:p-6">
                      <p className="text-xs lg:text-base font-bold text-slate-500 leading-none">{log.lokasi || "Sawah A"}</p>
                    </td>
                    <td className="p-5 lg:p-6 text-right">
                      <span
                        className={`inline-block px-3 lg:px-8 py-1.5 lg:py-3 rounded-xl lg:rounded-full text-[10px] lg:text-base font-black uppercase tracking-widest shadow-md leading-none ${log.jumlah > 10 ? "bg-red-600 text-white animate-pulse" : "bg-emerald-500 text-white"}`}
                      >
                        {log.jumlah > 10 ? "BAHAYA" : "AMAN"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 lg:py-40 flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 lg:w-32 lg:h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6 lg:mb-10">
                <AlertCircle className="w-10 h-10 lg:w-16 lg:h-16 text-slate-200" />
              </div>
              <h4 className="text-xl lg:text-3xl font-black text-slate-800 mb-2">Belum Ada Hama</h4>
              <p className="text-sm lg:text-lg text-slate-400 font-bold max-w-sm">Alhamdulillah, sawah aman terkendali.</p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-center text-sm font-bold text-red-500">{error}</p>}
    </div>
  );
}
