import React from "react";
import { User, Mail, Shield, Calendar, MapPin, Leaf } from "lucide-react";

export default function Profil() {
  const userData = JSON.parse(localStorage.getItem("user")) || {
    username: "Petani",
    email: "petani@tempuran.com",
    role: "petani",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-2xl lg:rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="h-24 lg:h-40 bg-gradient-to-r from-green-600 to-emerald-500 relative">
          <div className="absolute -bottom-10 lg:-bottom-16 left-6 lg:left-14">
            <div className="w-20 h-20 lg:w-32 lg:h-32 bg-white rounded-2xl lg:rounded-3xl p-1 shadow-2xl">
              <div className="w-full h-full bg-slate-100 rounded-xl lg:rounded-2xl flex items-center justify-center text-3xl lg:text-4xl font-black text-green-600">
                {userData.username ? userData.username[0].toUpperCase() : "U"}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-14 lg:pt-24 pb-8 lg:pb-12 px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl lg:text-4xl font-black text-slate-800 leading-none mb-2">{userData.username}</h2>
              <p className="text-slate-400 font-extrabold flex items-center justify-center md:justify-start gap-2 uppercase tracking-[0.2em] text-[10px] lg:text-sm">
                <Shield className="w-3 h-3 lg:w-5 lg:h-5 text-green-500" /> Peran: {userData.role}
              </p>
            </div>
            <div className="flex justify-center md:justify-end gap-3 lg:gap-6">
              <div className="px-5 lg:px-7 py-2 lg:py-3 bg-green-50 border-2 border-green-100 rounded-xl lg:rounded-2xl text-center">
                <p className="text-[8px] lg:text-xs font-black text-green-600 uppercase tracking-widest mb-1 lg:mb-2">Status Akun</p>
                <p className="text-[10px] lg:text-lg font-black text-green-700 uppercase">Sangat Aktif</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-12">
        <div className="md:col-span-2 space-y-4 lg:space-y-10">
          <div className="bg-white p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-xl">
            <h3 className="text-lg lg:text-2xl font-black text-slate-800 mb-6 lg:mb-10 flex items-center gap-3 lg:gap-5 leading-none">
              <User className="w-6 h-6 lg:w-10 lg:h-10 text-green-600" /> Profil Bapak/Ibu
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
              <ProfileItem icon={<User className="w-4 h-4 lg:w-7 lg:h-7" />} label="Nama Panggilan" value={userData.username} />
              <ProfileItem icon={<Mail className="w-4 h-4 lg:w-7 lg:h-7" />} label="Alamat Email" value={userData.email} />
              <ProfileItem icon={<Calendar className="w-4 h-4 lg:w-7 lg:h-7" />} label="Tanggal Hari Ini" value={new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} />
              <ProfileItem icon={<MapPin className="w-4 h-4 lg:w-7 lg:h-7" />} label="Wilayah Desa" value="Kecamatan Tempuran" />
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:space-y-10">
          <div className="bg-white p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-slate-100 shadow-xl text-center flex flex-col items-center">
            <div className="w-16 h-16 lg:w-24 lg:h-24 bg-green-50 rounded-2xl lg:rounded-2xl flex items-center justify-center mb-4 lg:mb-8 text-green-600 border-2 border-green-100">
              <Leaf className="w-8 h-8 lg:w-12 lg:h-12" />
            </div>
            <h4 className="font-black text-slate-800 tracking-tight text-lg lg:text-2xl leading-none">Lahan Sawah</h4>
            <div className="mt-6 lg:mt-10 space-y-4 w-full text-left">
              <div className="p-4 lg:p-6 bg-slate-50 rounded-xl lg:rounded-2xl border-2 border-slate-100">
                <p className="text-[10px] lg:text-sm font-black text-slate-400 uppercase tracking-widest mb-1 lg:mb-2">Lokasi Utama</p>
                <p className="font-black text-slate-700 text-sm lg:text-xl">Tempuran, Karawang</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="space-y-1 lg:space-y-3 p-4 lg:p-0 bg-slate-50 lg:bg-transparent rounded-xl lg:rounded-none">
      <p className="text-[10px] lg:text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <span className="text-green-500">{icon}</span> {label}
      </p>
      <p className="text-sm lg:text-2xl font-black text-slate-800 leading-tight">{value}</p>
    </div>
  );
}
