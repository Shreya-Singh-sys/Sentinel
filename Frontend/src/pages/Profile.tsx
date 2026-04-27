import { motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "../components/Icon";
import { BottomNav } from "../components/BottomNav";

const Profile = () => {
  // States for dynamic inputs
  const [room, setRoom] = useState("402");
  const [floor, setFloor] = useState("4");
  const [name] = useState("Alex"); // Updated name as per your profile

  return (
    <div className="relative min-h-screen bg-slate-50 pb-28 font-sans antialiased">
      {/* Background Header */}
      <div className="absolute inset-x-0 top-0 h-64 bg-red-600 shadow-lg" />

      <div className="relative mx-auto max-w-2xl px-5 pt-12">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex items-center gap-4"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-2xl font-black text-red-600 shadow-xl">
            {name.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-black">{name}</h1>
            <p className="text-sm font-bold opacity-90">Guest · Floor {floor}, Room {room}</p>
          </div>
        </motion.div>

        {/* Input Controls Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="mt-8 grid grid-cols-2 gap-3"
        >
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Set Floor</p>
            <input 
              type="text" 
              value={floor} 
              onChange={(e) => setFloor(e.target.value)}
              className="w-full text-lg font-black text-slate-900 outline-none focus:text-red-600"
              placeholder="e.g. 4"
            />
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Set Room</p>
            <input 
              type="text" 
              value={room} 
              onChange={(e) => setRoom(e.target.value)}
              className="w-full text-lg font-black text-slate-900 outline-none focus:text-red-600"
              placeholder="e.g. 402"
            />
          </div>
        </motion.section>

        {/* Info Cards Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="mt-4 space-y-3"
        >
          {[
            { icon: "call", label: "Emergency contact", value: "Sara Carter · +1 555 220 1290" },
            { icon: "bloodtype", label: "Blood group", value: "O+" },
            { icon: "layers", label: "Assigned Floor", value: `Level ${floor}` }, // Floor replace Allergies
            { icon: "meeting_room", label: "Current Room", value: `Room ${room}` }, // QR code replaced with Room display
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Icon name={r.icon} filled />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{r.label}</p>
                <p className="font-bold text-slate-800">{r.value}</p>
              </div>
              <Icon name="chevron_right" className="text-slate-300" />
            </div>
          ))}
        </motion.section>

        {/* Settings Area */}
        <h2 className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Security Settings</h2>
        <div className="mt-3 space-y-3">
          {[
            { icon: "notifications_active", label: "Critical alert permissions", on: true },
            { icon: "volume_up", label: "Override silent mode", on: true },
            { icon: "translate", label: "Voice guide language", on: false, value: "English" },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon name={r.icon} filled />
              </div>
              <p className="flex-1 font-bold text-slate-700">{r.label}</p>
              {typeof r.on === "boolean" ? (
                <div className={`relative h-6 w-11 rounded-full transition-colors ${r.on ? "bg-red-500" : "bg-slate-200"}`}>
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${r.on ? "left-[22px]" : "left-0.5"}`} />
                </div>
              ) : null}
              {r.value && <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{r.value}</span>}
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;