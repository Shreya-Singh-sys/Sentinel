import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { useI18n } from "../i18n/I18nProvider";
import { db } from "../config/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

const stats = [
  {
    labelKey: "dashboard.totalGuests",
    value: 412,
    icon: "groups",
    tone: "bg-slate-100 text-slate-900",
  },
  {
    labelKey: "dashboard.evacuated",
    value: 287,
    icon: "directions_run",
    tone: "bg-green-100 text-green-600",
  },
  {
    labelKey: "dashboard.trapped",
    value: 4,
    icon: "warning",
    tone: "bg-red-100 text-red-600",
  },
  {
    labelKey: "dashboard.staffActive",
    value: 38,
    icon: "badge",
    tone: "bg-orange-100 text-orange-600",
  },
];

const logs = [
  {
    time: "12:04:22",
    msg: "Guest in Room 305 reported smoke in Staircase B.",
    tone: "#ef4444",
  },
  {
    time: "12:03:51",
    msg: "Evacuation broadcast sent to floors 3–6.",
    tone: "#f59e0b",
  },
  {
    time: "12:03:40",
    msg: "Staff member Priya marked Floor 5 as cleared.",
    tone: "#22c55e",
  },
  {
    time: "12:03:18",
    msg: "Fire alarm triggered manually by reception.",
    tone: "#ef4444",
  },
];

export default function StaffDashboard  () {
  const [alertOn, setAlertOn] = useState(false);
  const { t } = useI18n();
  const [broadcast, setBroadcast] = useState(null);
  const [trappedGuests, setTrappedGuests] = useState([]);
  useEffect(() => {
    // 1. Listen for Staff-only Broadcasts
    const broadcastQuery = query(
      collection(db, "broadcasts"),
      where("target", "==", "staff"),
      orderBy("timestamp", "desc")
    );

    const unsubBroadcast = onSnapshot(broadcastQuery, (snapshot) => {
      if (!snapshot.empty) {
        const latestMsg = snapshot.docs[0].data();
        setBroadcast(latestMsg.message);
        // Alert for immediate attention
        alert("STAFF NOTICE: " + latestMsg.message);
      }
    });

    // 2. Listen for Trapped Guests (Staff needs to see this for rescue)
    const trappedQuery = query(
      collection(db, "users"),
      where("role", "==", "guest"),
      where("status", "==", "trapped")
    );

    const unsubTrapped = onSnapshot(trappedQuery, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrappedGuests(list);
    }, (error) => {
      console.error("Trapped users fetch error:", error);
    });

    return () => {
      unsubBroadcast();
      unsubTrapped();
    };
  }, []);
  useEffect(() => {
    if (!localStorage.getItem("userRole")) localStorage.setItem("userRole", "staff");
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] pb-32 font-sans">
      <Header />
    
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-red-50/50 to-transparent" />


      {/* Trapped Guests List for Rescue
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Rescue Priority List</h2>
        <div className="grid gap-4">
          {trappedUsers.length > 0 ? (
            trappedUsers.map((guest) => (
              <div key={guest.id} className="bg-white border-l-4 border-red-500 p-4 shadow-sm rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{guest.fullName}</p>
                  <p className="text-xs text-slate-500">Location: {guest.location || "Searching..."}</p>
                </div>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  Trapped
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-sm">No trapped guests reported. All clear!</p>
          )}
        </div>
      </div>
    </div>
  ); */}
      <main className="relative mx-auto max-w-6xl px-5 pt-28 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900">{t("admin.systemOverview")}</h2>
          <p className="text-sm font-bold text-slate-500">{t("admin.monitoringSubtitle")}</p>
        </div>
        <div className="staff-dashboard-root">
      {/* ⚠️ EMERGENCY BANNER FOR STAFF */}
      {broadcast && (
        <div className="bg-amber-500/80 backdrop-blur-md text-white p-4 text-center font-bold shadow-xl animate-pulse rounded-2xl border border-amber-400/50 mx-4 mt-4">
          📢 STAFF ALERT: {broadcast}
        </div>
      )}
      </div>
      <div className="rescue-list">
  {/* Safety check: trappedUsers exist karta hai aur array hai */}
  {trappedGuests && trappedGuests.length > 0 ? (
    trappedGuests.map((guest) => (
      <div key={guest.id} className="p-3 border-b">
        <p className="font-bold">{guest.fullName}</p>
        <p className="text-xs">Location: {guest.location}</p>
      </div>
    ))
  ) : (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
    <div className="text-4xl mb-2">✅</div>
    <p className="text-gray-500 font-medium">All clear! No trapped guests.</p>
    <p className="text-xs text-gray-400">Everything is running smoothly.</p>
  </div>
  )}
</div> 

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.labelKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{t(s.labelKey)}</p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.tone}`}>
                  <Icon name={s.icon} filled className="text-[20px]" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-slate-900">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm lg:col-span-2"
          >
            <div className="flex items-center justify-between border-b border-slate-50 p-5">
              <div>
                <h3 className="text-base font-black text-slate-900">Live Venue Map</h3>
                <p className="text-[11px] font-bold text-slate-500">Active tracking · 8 Floors</p>
              </div>
              <div className="flex gap-2 rounded-full bg-slate-50 p-1.5">
                {["1F", "2F", "3F", "4F"].map((f, idx) => (
                  <button
                    key={f}
                    className={`rounded-full px-4 py-1 text-[11px] font-black transition-all ${idx === 2 ? "bg-white shadow-sm text-red-600" : "text-slate-400"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative aspect-[16/10] bg-slate-50 p-6 flex items-center justify-center">
              <svg viewBox="0 0 600 360" className="h-full w-full opacity-90">
                <g fill="#fff" stroke="#e2e8f0" strokeWidth="2">
                  <rect x="50" y="50" width="230" height="120" rx="15" />
                  <rect x="50" y="190" width="230" height="120" rx="15" />
                  <rect x="310" y="50" width="240" height="260" rx="15" />
                </g>
                {[
                  [120, 100, "#22c55e"],
                  [200, 140, "#22c55e"],
                  [450, 180, "#ef4444"],
                  [350, 80, "#f59e0b"],
                  [500, 260, "#22c55e"],
                  [90, 240, "#ef4444"],
                ].map(([x, y, color], idx) => (
                  <motion.circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="6"
                    fill={color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                  />
                ))}
              </svg>

              <div className="absolute bottom-4 right-4 flex gap-3 rounded-2xl bg-white/90 p-3 text-[10px] font-black backdrop-blur-md shadow-sm border border-slate-100">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" /> SAFE
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" /> TRAPPED
                </span>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-[2.5rem] bg-white p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-1">Emergency Controls</h3>
              <p className="text-[10px] font-bold text-slate-500 mb-4">Immediate system response</p>

              <button
                onClick={() => setAlertOn(!alertOn)}
                className={`flex w-full items-center justify-between rounded-3xl p-5 font-black transition-all duration-500 ${
                  alertOn
                    ? "bg-red-600 text-white shadow-2xl shadow-red-200 animate-pulse"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${alertOn ? "bg-white/20" : "bg-red-100"}`}>
                    <Icon name="local_fire_department" filled className="text-[24px]" />
                  </div>
                  <span>{alertOn ? "ALARM ACTIVE" : "Fire Alarm"}</span>
                </div>
                <Icon name={alertOn ? "stop_circle" : "play_circle"} filled />
              </button>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center gap-2 rounded-3xl bg-amber-50 p-4 text-amber-600 border border-amber-100">
                  <Icon name="medical_services" filled />
                  <span className="text-[10px] font-black">Medical</span>
                </button>
                <button className="flex flex-col items-center gap-2 rounded-3xl bg-red-50 p-4 text-slate-600 border border-slate-100">
                  <Icon name="campaign" filled />
                  <span className="text-[10px] font-black">Broadcast</span>
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-3">
              <p className="text-[9px] font-black uppercase text-slate-400">Quick broadcast</p>
              <textarea
                placeholder="Message all guests..."
                className="mt-1 w-full border-0 bg-transparent text-xs font-bold outline-none"
                rows={2}
              />
              <button className="mt-2 w-full rounded-xl bg-slate-900 py-2 text-[10px] font-black text-white">
                SEND TO ALL
              </button>
            </div>
          </motion.section>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-[2.5rem] bg-white p-6 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-black text-slate-900">Live Activity Feed</h3>
            <span className="rounded-full bg-green-50 px-3 py-1 text-[9px] font-black text-green-600 uppercase">
              System Online
            </span>
          </div>
          <div className="space-y-3">
            {logs.map((l, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-3xl bg-slate-50/50 p-4 border border-transparent hover:border-slate-100 transition-all"
              >
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: l.tone }} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-700 leading-snug">{l.msg}</p>
                  <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">{l.time}</p>
                </div>
                <button className="text-slate-300 hover:text-slate-600">
                  <Icon name="more_vert" />
                </button>
              </div>
            ))}
          </div>
        </motion.section>
      </main>

      <BottomNav />
    </div>
  );
};



