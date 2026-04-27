import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Icon } from "../components/Icon";
import { BottomNav } from "../components/BottomNav";
import { toast } from "sonner"; // Agar toast use kar rahe hain toh

const AdminProfile = () => {
  const [name, setName] = useState("Vaishali");
  const [role] = useState("Lead Administrator");
  const [adminId] = useState("SEN-ADM-23F049");
  const fileInputRef = useRef(null);

  const handleMapUpdate = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      toast.success("Map Uploaded", { description: `${file.name} is now live.` });
      // Yahan aap upload logic add kar sakte hain
    } else {
      toast.error("Invalid File", { description: "Please select a PDF file." });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 pb-28 font-sans antialiased">
      {/* Admin Authority Header */}
      <div className="absolute inset-x-0 top-0 h-64 bg-red-600 shadow-xl" />

      <div className="relative mx-auto max-w-2xl px-5 pt-12">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex items-center gap-4"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-2xl font-black text-slate-900 shadow-2xl border-4 border-slate-900">
            {name.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-black">{name}</h1>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">{role} · {adminId}</p>
          </div>
        </motion.div>

        {/* PDF Map Update Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 ring-1 ring-red-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                <Icon name="map" filled />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Venue Master Map</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Update building blueprints (PDF)</p>
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleMapUpdate}
              accept="application/pdf"
              className="hidden" 
            />
            
            <button 
              onClick={() => fileInputRef.current.click()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 py-4 text-xs font-black text-slate-600 hover:bg-slate-100 hover:border-red-300 transition-all"
            >
              <Icon name="upload_file" />
              SELECT NEW PDF MAP
            </button>
          </div>
        </motion.section>

        {/* Admin Details Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="mt-4 space-y-3"
        >
          {[
            { icon: "verified_user", label: "Security Clearance", value: "Level 5 (Super Admin)", color: "text-red-600 bg-red-50" },
            { icon: "badge", label: "Staff ID", value: adminId, color: "text-slate-600 bg-slate-50" },
            { icon: "history", label: "Last System Sync", value: "Today, 19:34:08", color: "text-slate-600 bg-slate-50" },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${r.color}`}>
                <Icon name={r.icon} filled />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{r.label}</p>
                <p className="font-bold text-slate-800">{r.value}</p>
              </div>
              <Icon name="chevron_right" className="text-slate-200" />
            </div>
          ))}
        </motion.section>

        {/* Control Settings */}
        <h2 className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">System Controls</h2>
        <div className="mt-3 space-y-3">
          {[
            { icon: "gavel", label: "Authority Overide Mode", on: true },
            { icon: "hub", label: "Multi-Venue Sync", on: false },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Icon name={r.icon} filled />
              </div>
              <p className="flex-1 font-bold text-slate-700">{r.label}</p>
              <div className={`relative h-6 w-11 rounded-full transition-colors ${r.on ? "bg-red-600" : "bg-slate-200"}`}>
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${r.on ? "left-[22px]" : "left-0.5"}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button className="mt-8 w-full py-4 rounded-2xl bg-red-50 text-red-600 font-black text-xs uppercase tracking-[0.2em] border border-red-100 active:scale-95 transition-transform">
          Termainal Logout
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default AdminProfile;