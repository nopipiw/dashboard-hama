import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, Bell, CheckCheck, Loader2 } from "lucide-react";

import { API_URL } from "../../../shared/config/api.js";

export default function RodentNotificationButton() {
  const [showPopover, setShowPopover] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [unreadResponse, countResponse] = await Promise.all([
        axios.get(`${API_URL}/api/v1/notifications/unread`),
        axios.get(`${API_URL}/api/v1/notifications/count`),
      ]);

      setNotifications(Array.isArray(unreadResponse.data?.data) ? unreadResponse.data.data : []);
      setUnreadCount(Number(countResponse.data?.data?.count) || 0);
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    const nextState = !showPopover;
    setShowPopover(nextState);
    if (nextState) fetchNotifications();
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/api/v1/notifications/${id}/read`);
      setNotifications((items) => items.filter((item) => item._id !== id));
      setUnreadCount((count) => Math.max(count - 1, 0));
    } catch (error) {
      console.error("Gagal menandai notifikasi:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_URL}/api/v1/notifications/read-all`);
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Gagal menandai semua notifikasi:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={`relative p-2 lg:p-3 border rounded-lg shadow-sm transition-all active:scale-95 ${
          unreadCount > 0
            ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
        title="Notifikasi Hama"
        type="button"
      >
        <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showPopover && (
        <div className="absolute right-0 top-full mt-3 w-[min(22rem,calc(100vw-2rem))] bg-white rounded-lg shadow-xl border border-slate-200 z-[80] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.14em]">Notifikasi Hama</p>
              <h3 className="text-base font-black text-slate-800 mt-1">{unreadCount} belum dibaca</h3>
            </div>
            {unreadCount > 0 && (
              <button
                className="text-xs font-black text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-md hover:bg-green-100 transition-colors"
                onClick={markAllAsRead}
                type="button"
              >
                Tandai semua
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-6 flex items-center justify-center gap-2 text-slate-400 font-bold">
                <Loader2 className="w-4 h-4 animate-spin" />
                Memuat notifikasi...
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {notifications.map((item) => (
                  <div key={item._id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-black text-slate-800 text-sm capitalize leading-tight">
                            {item.jenis_hama || "Hama"} terdeteksi
                          </p>
                          <button
                            className="p-1.5 rounded-md text-slate-400 hover:text-green-700 hover:bg-green-50 transition-colors"
                            onClick={() => markAsRead(item._id)}
                            title="Tandai dibaca"
                            type="button"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed mt-1">
                          {item.message || `${item.jumlah || 0} ekor di ${item.lokasi || "lahan"}`}
                        </p>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.12em] mt-2">
                          {item.waktu ? new Date(item.waktu).toLocaleString("id-ID") : "Baru saja"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-3">
                  <CheckCheck className="w-6 h-6" />
                </div>
                <p className="text-sm font-black text-slate-700">Tidak ada notifikasi baru</p>
                <p className="text-xs font-bold text-slate-400 mt-1">Sawah sedang aman dari peringatan baru.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
