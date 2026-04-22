import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, AlertCircle } from "lucide-react";

import { API_URL } from "../shared/config/api.js";

export default function Rekomendasi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/v1/analysis`);
        if (!response.ok) throw new Error("Gagal mengambil data rekomendasi.");
        const result = await response.json();
        setData(result.data || result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "normal":
        return "bg-green-100 text-green-700 border-green-200";
      case "waspada":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "bahaya":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Memuat analisis hama...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Rekomendasi Tindakan</h1>
        <p className="text-gray-600">Analisis berdasarkan deteksi hama hari ini</p>
      </div>

      {error || !data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm mb-8">
          <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">Belum ada data deteksi hari ini</p>
          <p className="text-gray-400 text-sm mt-1">Sistem akan otomatis memberikan saran segera setelah hama terdeteksi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {data.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              {item.gambar && (
                <div className="h-44 overflow-hidden relative">
                  <img 
                    src={item.gambar} 
                    alt={item.jenis_hama}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                    }}
                  />
                  <div className="absolute top-4 right-4 focus-ring">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black border backdrop-blur-md ${getStatusColor(item.status)}`}>
                        {item.status?.toUpperCase()}
                     </span>
                  </div>
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-1">
                {!item.gambar && (
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 capitalize">{item.jenis_hama}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>{item.status?.toUpperCase()}</span>
                  </div>
                )}
                
                {item.gambar && (
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 capitalize">{item.jenis_hama}</h3>
                  </div>
                )}

                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-emerald-600">{item.frekuensi_deteksi}</span>
                  <span className="text-gray-500 text-sm font-medium italic">kali terdeteksi</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Saran Tindakan:</label>
                  <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-4 rounded-xl italic">"{item.saran}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <button onClick={() => navigate("/hari-ini")} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95">
          <Search size={20} />
          Cek Hama Lagi
        </button>
      </div>
    </div>
  );
}
