// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Header } from "../components/Header";
// import { BottomNav } from "../components/BottomNav";
// import { Icon } from "../components/Icon";
// import { useI18n } from "../i18n/I18nProvider";
// import { db } from "../config/firebase";
// import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

// const stats = [
//   {
//     labelKey: "dashboard.totalGuests",
//     value: 412,
//     icon: "groups",
//     tone: "bg-slate-100 text-slate-900",
//   },
//   {
//     labelKey: "dashboard.evacuated",
//     value: 287,
//     icon: "directions_run",
//     tone: "bg-green-100 text-green-600",
//   },
//   {
//     labelKey: "dashboard.trapped",
//     value: 4,
//     icon: "warning",
//     tone: "bg-red-100 text-red-600",
//   },
//   {
//     labelKey: "dashboard.staffActive",
//     value: 38,
//     icon: "badge",
//     tone: "bg-orange-100 text-orange-600",
//   },
// ];

// const logs = [
//   {
//     time: "12:04:22",
//     msg: "Guest in Room 305 reported smoke in Staircase B.",
//     tone: "#ef4444",
//   },
//   {
//     time: "12:03:51",
//     msg: "Evacuation broadcast sent to floors 3–6.",
//     tone: "#f59e0b",
//   },
//   {
//     time: "12:03:40",
//     msg: "Staff member Priya marked Floor 5 as cleared.",
//     tone: "#22c55e",
//   },
//   {
//     time: "12:03:18",
//     msg: "Fire alarm triggered manually by reception.",
//     tone: "#ef4444",
//   },
// ];

// export default function StaffDashboard  () {
//   const [alertOn, setAlertOn] = useState(false);
//   const { t } = useI18n();
//   const [broadcast, setBroadcast] = useState(null);
//   const [trappedGuests, setTrappedGuests] = useState([]);
//   useEffect(() => {
//     // 1. Listen for Staff-only Broadcasts
//     const broadcastQuery = query(
//       collection(db, "broadcasts"),
//       where("target", "==", "staff"),
//       orderBy("timestamp", "desc")
//     );

//     const unsubBroadcast = onSnapshot(broadcastQuery, (snapshot) => {
//       if (!snapshot.empty) {
//         const latestMsg = snapshot.docs[0].data();
//         setBroadcast(latestMsg.message);
//         // Alert for immediate attention
//         alert("STAFF NOTICE: " + latestMsg.message);
//       }
//     });

//     // 2. Listen for Trapped Guests (Staff needs to see this for rescue)
//     const trappedQuery = query(
//       collection(db, "users"),
//       where("role", "==", "guest"),
//       where("status", "==", "trapped")
//     );

//     const unsubTrapped = onSnapshot(trappedQuery, (snapshot) => {
//       const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setTrappedGuests(list);
//     }, (error) => {
//       console.error("Trapped users fetch error:", error);
//     });

//     return () => {
//       unsubBroadcast();
//       unsubTrapped();
//     };
//   }, []);
//   useEffect(() => {
//     if (!localStorage.getItem("userRole")) localStorage.setItem("userRole", "staff");
//   }, []);

//   return (
//     <div className="relative min-h-screen bg-[#f8fafc] pb-32 font-sans">
//       <Header />
    
//       <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-red-50/50 to-transparent" />


//       {/* Trapped Guests List for Rescue
//       <div className="p-6">
//         <h2 className="text-xl font-bold mb-4 text-slate-800">Rescue Priority List</h2>
//         <div className="grid gap-4">
//           {trappedUsers.length > 0 ? (
//             trappedUsers.map((guest) => (
//               <div key={guest.id} className="bg-white border-l-4 border-red-500 p-4 shadow-sm rounded-lg flex justify-between items-center">
//                 <div>
//                   <p className="font-bold text-slate-900">{guest.fullName}</p>
//                   <p className="text-xs text-slate-500">Location: {guest.location || "Searching..."}</p>
//                 </div>
//                 <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
//                   Trapped
//                 </span>
//               </div>
//             ))
//           ) : (
//             <p className="text-slate-400 text-sm">No trapped guests reported. All clear!</p>
//           )}
//         </div>
//       </div>
//     </div>
//   ); */}
//       <main className="relative mx-auto max-w-6xl px-5 pt-28 lg:px-8">
//         <div className="mb-8">
//           <h2 className="text-2xl font-black text-slate-900">{t("admin.systemOverview")}</h2>
//           <p className="text-sm font-bold text-slate-500">{t("admin.monitoringSubtitle")}</p>
//         </div>
//         <div className="staff-dashboard-root">
//       {/* ⚠️ EMERGENCY BANNER FOR STAFF */}
//       {broadcast && (
//         <div className="bg-amber-500/80 backdrop-blur-md text-white p-4 text-center font-bold shadow-xl animate-pulse rounded-2xl border border-amber-400/50 mx-4 mt-4">
//           📢 STAFF ALERT: {broadcast}
//         </div>
//       )}
//       </div>
//       <div className="rescue-list">
//   {/* Safety check: trappedUsers exist karta hai aur array hai */}
//   {trappedGuests && trappedGuests.length > 0 ? (
//     trappedGuests.map((guest) => (
//       <div key={guest.id} className="p-3 border-b">
//         <p className="font-bold">{guest.fullName}</p>
//         <p className="text-xs">Location: {guest.location}</p>
//       </div>
//     ))
//   ) : (
//     <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
//     <div className="text-4xl mb-2">✅</div>
//     <p className="text-gray-500 font-medium">All clear! No trapped guests.</p>
//     <p className="text-xs text-gray-400">Everything is running smoothly.</p>
//   </div>
//   )}
// </div> 

//         <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
//           {stats.map((s, i) => (
//             <motion.div
//               key={s.labelKey}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.1 }}
//               className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100"
//             >
//               <div className="flex items-center justify-between">
//                 <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{t(s.labelKey)}</p>
//                 <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.tone}`}>
//                   <Icon name={s.icon} filled className="text-[20px]" />
//                 </div>
//               </div>
//               <p className="mt-3 text-3xl font-black text-slate-900">{s.value}</p>
//             </motion.div>
//           ))}
//         </div>

//         <div className="mt-6 grid gap-6 lg:grid-cols-3">
//           <motion.section
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm lg:col-span-2"
//           >
//             <div className="flex items-center justify-between border-b border-slate-50 p-5">
//               <div>
//                 <h3 className="text-base font-black text-slate-900">Live Venue Map</h3>
//                 <p className="text-[11px] font-bold text-slate-500">Active tracking · 8 Floors</p>
//               </div>
//               <div className="flex gap-2 rounded-full bg-slate-50 p-1.5">
//                 {["1F", "2F", "3F", "4F"].map((f, idx) => (
//                   <button
//                     key={f}
//                     className={`rounded-full px-4 py-1 text-[11px] font-black transition-all ${idx === 2 ? "bg-white shadow-sm text-red-600" : "text-slate-400"}`}
//                   >
//                     {f}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="relative aspect-[16/10] bg-slate-50 p-6 flex items-center justify-center">
//               <svg viewBox="0 0 600 360" className="h-full w-full opacity-90">
//                 <g fill="#fff" stroke="#e2e8f0" strokeWidth="2">
//                   <rect x="50" y="50" width="230" height="120" rx="15" />
//                   <rect x="50" y="190" width="230" height="120" rx="15" />
//                   <rect x="310" y="50" width="240" height="260" rx="15" />
//                 </g>
//                 {[
//                   [120, 100, "#22c55e"],
//                   [200, 140, "#22c55e"],
//                   [450, 180, "#ef4444"],
//                   [350, 80, "#f59e0b"],
//                   [500, 260, "#22c55e"],
//                   [90, 240, "#ef4444"],
//                 ].map(([x, y, color], idx) => (
//                   <motion.circle
//                     key={idx}
//                     cx={x}
//                     cy={y}
//                     r="6"
//                     fill={color}
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ delay: 0.6 + idx * 0.1 }}
//                   />
//                 ))}
//               </svg>

//               <div className="absolute bottom-4 right-4 flex gap-3 rounded-2xl bg-white/90 p-3 text-[10px] font-black backdrop-blur-md shadow-sm border border-slate-100">
//                 <span className="flex items-center gap-1.5">
//                   <span className="h-2 w-2 rounded-full bg-green-500" /> SAFE
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <span className="h-2 w-2 rounded-full bg-red-500" /> TRAPPED
//                 </span>
//               </div>
//             </div>
//           </motion.section>

//           <motion.section
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="flex flex-col gap-4"
//           >
//             <div className="rounded-[2.5rem] bg-white p-6 border border-slate-100 shadow-sm">
//               <h3 className="text-sm font-black text-slate-900 mb-1">Emergency Controls</h3>
//               <p className="text-[10px] font-bold text-slate-500 mb-4">Immediate system response</p>

//               <button
//                 onClick={() => setAlertOn(!alertOn)}
//                 className={`flex w-full items-center justify-between rounded-3xl p-5 font-black transition-all duration-500 ${
//                   alertOn
//                     ? "bg-red-600 text-white shadow-2xl shadow-red-200 animate-pulse"
//                     : "bg-red-50 text-red-600 hover:bg-red-100"
//                 }`}
//               >
//                 <div className="flex items-center gap-4">
//                   <div className={`p-2 rounded-full ${alertOn ? "bg-white/20" : "bg-red-100"}`}>
//                     <Icon name="local_fire_department" filled className="text-[24px]" />
//                   </div>
//                   <span>{alertOn ? "ALARM ACTIVE" : "Fire Alarm"}</span>
//                 </div>
//                 <Icon name={alertOn ? "stop_circle" : "play_circle"} filled />
//               </button>

//               <div className="mt-4 grid grid-cols-2 gap-3">
//                 <button className="flex flex-col items-center gap-2 rounded-3xl bg-amber-50 p-4 text-amber-600 border border-amber-100">
//                   <Icon name="medical_services" filled />
//                   <span className="text-[10px] font-black">Medical</span>
//                 </button>
//                 <button className="flex flex-col items-center gap-2 rounded-3xl bg-red-50 p-4 text-slate-600 border border-slate-100">
//                   <Icon name="campaign" filled />
//                   <span className="text-[10px] font-black">Broadcast</span>
//                 </button>
//               </div>
//             </div>

//             <div className="mt-5 rounded-2xl bg-slate-50 p-3">
//               <p className="text-[9px] font-black uppercase text-slate-400">Quick broadcast</p>
//               <textarea
//                 placeholder="Message all guests..."
//                 className="mt-1 w-full border-0 bg-transparent text-xs font-bold outline-none"
//                 rows={2}
//               />
//               <button className="mt-2 w-full rounded-xl bg-slate-900 py-2 text-[10px] font-black text-white">
//                 SEND TO ALL
//               </button>
//             </div>
//           </motion.section>
//         </div>

//         <motion.section
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mt-6 rounded-[2.5rem] bg-white p-6 border border-slate-100 shadow-sm"
//         >
//           <div className="flex items-center justify-between mb-5">
//             <h3 className="text-base font-black text-slate-900">Live Activity Feed</h3>
//             <span className="rounded-full bg-green-50 px-3 py-1 text-[9px] font-black text-green-600 uppercase">
//               System Online
//             </span>
//           </div>
//           <div className="space-y-3">
//             {logs.map((l, i) => (
//               <div
//                 key={i}
//                 className="flex items-center gap-4 rounded-3xl bg-slate-50/50 p-4 border border-transparent hover:border-slate-100 transition-all"
//               >
//                 <div className="h-2 w-2 rounded-full" style={{ backgroundColor: l.tone }} />
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-slate-700 leading-snug">{l.msg}</p>
//                   <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">{l.time}</p>
//                 </div>
//                 <button className="text-slate-300 hover:text-slate-600">
//                   <Icon name="more_vert" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </motion.section>
//       </main>

//       <BottomNav />
//     </div>
//   );
// };



// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast} from sonner;
// import { Header } from "../components/Header";
// import { BottomNav } from "../components/BottomNav";
// import { Icon } from "../components/Icon";
// import { useI18n } from "../i18n/I18nProvider";
// import { db ,auth} from "../config/firebase";
// import { doc, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
// import {AlertTriangle, CheckCircle2, MapIcon} from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner"; 
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { Icon } from "../components/Icon";
import { useI18n } from "../i18n/I18nProvider";
import { db, auth } from "../config/firebase";
import { doc, collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, limit } from "firebase/firestore";
import { AlertTriangle, CheckCircle2, MapIcon, MapPin, Navigation } from "lucide-react";

export default function StaffDashboard() {
  const { t } = useI18n();
  const [isOnline, setIsOnline] = useState(true);
const [totalGuests, setTotalGuests] = useState(0);
const [evacuated, setEvacuated] = useState(0);
const [trappedCount, setTrappedCount] = useState(0);
const [activeStaff, setActiveStaff] = useState(0);
const [alertOn, setAlertOn] = useState(false);
  const [isStaffActive, setIsStaffActive] = useState(true);
  const [broadcast, setBroadcast] = useState(null);
  const [trappedGuests, setTrappedGuests] = useState([]);
  const [assignment, setAssignment] = useState({
    floor: "Loading...",
    sector: "...",
    taskType: "Waiting for task"
  });
  const [quickMsg, setQuickMsg] = useState("");
  const [logs, setLogs] = useState([]);

  // 2. Stats array ko render function ke andar rakhein taaki update ho sake
  const stats = [
    { id: 'total', labelKey: 'stats.total', value: totalGuests, icon: 'groups', col: 'blue' },
    { id: 'evacuated', labelKey: 'stats.evacuated', value: evacuated, icon: 'directions_run', col: 'emerald' },
    { id: 'trapped', labelKey: 'stats.trapped', value: trappedCount, icon: 'report_problem', col: 'red' },
    { id: 'staff', labelKey: 'stats.staff', value: activeStaff, icon: 'badge', col: 'amber' },
  ];

useEffect(() => {
  // 1. Total Guests & Trapped Count (Assuming 'users' collection with 'role' and 'status')
  const guestsQuery = query(collection(db, "users"));
  const unsubGuests = onSnapshot(guestsQuery, (snapshot) => {
    console.log("Snapshot size:", snapshot.size);
    const allGuests = snapshot.docs.map(doc => doc.data());
    console.log("All Guests Data:", allGuests);
    setTotalGuests(allGuests.length);
    setEvacuated(allGuests.filter(g => g.status === "safe").length);
    setTrappedCount(allGuests.filter(g => g.status === "trapped").length);
  });

  // 2. Active Staff Count
  const staffQuery = query(collection(db, "users"), where("isOnline", "==", true));
  const unsubStaff = onSnapshot(staffQuery, (snapshot) => {
    setActiveStaff(snapshot.docs.length);
  });

  return () => { unsubGuests(); unsubStaff(); };
}, []);
// --- Animation Variants ---
const glassVar = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};
const [systems, setSystems] = useState([]);

  useEffect(() => {
    const broadcastQuery = query(collection(db, "broadcasts"), where("target", "==", "staff"), orderBy("timestamp", "desc"));
    const unsubBroadcast = onSnapshot(broadcastQuery, (snapshot) => {
      if (!snapshot.empty) {
        const latestMsg = snapshot.docs[0].data();
        setBroadcast(latestMsg.message);
      }
    });

    const trappedQuery = query(collection(db, "users"), where("status", "==", "trapped"));
    const unsubTrapped = onSnapshot(trappedQuery, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrappedGuests(list);
    });

    return () => { unsubBroadcast(); unsubTrapped(); };
  }, []);
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Real-time listener for current user's assignment
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists() && doc.data().currentAssignment) {
        setAssignment(doc.data().currentAssignment);
      }
    });

    return () => unsub();
  }, []);
  const handleReportHazard = async () => {
  // Browser camera API ya simple file input trigger
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.capture = 'environment'; // Direct camera open karega mobile pe
  
  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.info("Uploading hazard report...");
    
    // Yahan hum activity log mein entry bhejenge
    await addDoc(collection(db, "activity_log"), {
      msg: `HAZARD REPORTED: Fire/Smoke detected by ${auth.currentUser.displayName}`,
      type: "danger",
      label: "Field Report",
      timestamp: serverTimestamp(),
      location: assignment.floor // Jo floor unhe assigned hai
    });

    toast.success("Hazard reported to Command Center!");
  };
  
  fileInput.click();
};
const handleSendMessage = async () => {
  if (!quickMsg.trim()) return;

  try {
    await addDoc(collection(db, "activity_log"), {
      msg: quickMsg,
      type: "info",
      label: "Staff Message",
      sender: auth.currentUser.displayName || "Field Staff",
      timestamp: serverTimestamp()
    });

    setQuickMsg(""); // Clear box
    toast.success("Broadcast sent!");
  } catch (error) {
    toast.error("Message failed to send");
  }
};
useEffect(() => {
  // activity_log collection se latest 10 messages fetch karein
  const q = query(
    collection(db, "activity_log"), 
    orderBy("timestamp", "desc"), 
    limit(10)
  );

  const unsubLogs = onSnapshot(q, (snapshot) => {
    const logsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Timestamp ko readable format mein convert karne ke liye
      time: doc.data().timestamp?.toDate().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }) || "Just now"
    }));
    setLogs(logsList);
  });

  return () => unsubLogs();
}, []);


  return (
    <div className="relative min-h-screen bg-red-100 overflow-x-hidden font-sans antialiased text-slate-900 pb-40">
      
      {/* 1. Glass Header Overlay */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/60 backdrop-blur-xl border-b border-white z-50 shadow-lg shadow-red-900/5">
         <Header />
      </nav>

      <main className="relative mx-auto max-w-[1400px] px-6 pt-32 lg:px-10 flex flex-col gap-6">
        
        {/* 2. Top Assignment Bar */}
        <div className="flex flex-col md:flex-row gap-5 items-center justify-between border-b border-red-200 pb-6">
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4 bg-slate-950 p-5 rounded-3xl shadow-2xl shadow-slate-900/20 w-full md:w-auto border border-slate-800">
            <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center animate-pulse border border-blue-400">
              <Icon name="assignment" filled className="text-white text-3xl" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-blue-400 tracking-wider">Current Assignment</p>
              <p className="text-lg font-black text-white tracking-tight leading-tight">{assignment ? (
                `Floor ${assignment.floor} • ${assignment.sector} • ${assignment.taskType}`
              ) : (
                "Waiting for Command..."
              )}</p>
              
            </div>
            
          </motion.div>
          

          <button 
            onClick={() => setIsStaffActive(!isStaffActive)}
            className={`flex items-center gap-3 px-6 py-4 rounded-full font-black text-sm transition-all border shadow-lg ${isStaffActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${isStaffActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            {isStaffActive ? "STATUS: ACTIVE" : "STATUS: ON-BREAK"}
          </button>
        </div>

        {/* 3. Emergency Alerts */}
        {broadcast && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-amber-500 text-white p-5 text-center font-black shadow-xl shadow-amber-900/10 animate-pulse rounded-3xl border border-amber-400 text-sm">
            📢 STAFF ALERT: {broadcast}
          </motion.div>
        )}

        {/* 4. Glass Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div 
            key={s.id}
            variants={glassVar} initial="initial" animate="animate" className={`relative rounded-3xl bg-white/60 backdrop-blur-xl p-6 shadow-xl shadow-red-900/5 border border-white group`}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{t(s.labelKey)}</p>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-${s.col}-50 text-${s.col}-600 border border-${s.col}-100 transition-transform group-hover:rotate-12`}>
                  <Icon name={s.icon} filled className="text-2xl" />
                </div>
              </div>
              <p className="mt-4 text-4xl font-black text-slate-900 leading-none tabular-nums tracking-tight">{s.value}</p>
              {s.id === 'trapped' && s.value > 0 && (
                <div className="absolute top-3 right-3 h-3 w-3 bg-red-600 rounded-full animate-ping shadow-lg shadow-red-300" />
              )}
            </motion.div>
          ))}
        </div>

        {/* 5. Rescue Priority Glass Card */}
        <motion.section variants={glassVar} initial="initial" animate="animate" className="rounded-[2.5rem] bg-white/70 backdrop-blur-2xl p-8 border border-white shadow-2xl shadow-red-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><Icon name="warning" filled className="text-red-600 text-8xl" /></div>
          <h3 className="text-sm font-black text-red-600 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
            <AlertTriangle size={18}/> Rescue Priority List
          </h3>
          <div className="grid gap-4">
            {trappedGuests.length > 0 ? (
              trappedGuests.map((guest, i) => (
                <div key={guest.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-white/40 rounded-3xl border border-white shadow-lg hover:border-red-100 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 border border-red-100 shadow-sm"><Icon name="person" filled className="text-3xl" /></div>
                    <div>
                      <p className="text-lg font-black text-slate-900 leading-tight">{guest.fullName}</p>
                      <p className="text-[11px] font-bold text-red-500 uppercase flex items-center gap-1.5"><MapPin size={12}/> Loc: {guest.location || "Searching..."}</p>
                    </div>
                  </div>
                  <button className="w-full md:w-auto bg-slate-950 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-black active:scale-95 transition-all">
                    <Navigation size={14}/> Launch Indoor Path
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white/30 rounded-3xl border-2 border-dashed border-white flex flex-col items-center gap-3">
                <CheckCircle2 size={30} className="text-emerald-500" />
                <p className="text-xs font-bold text-slate-400">All clear! No trapped guests at this time.</p>
              </div>
            )}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 relative">
          
          {/* 6. Live Venue Map Glass Panel */}
          <motion.section className="overflow-hidden rounded-[2.5rem] bg-white/60 backdrop-blur-xl p-8 border border-white shadow-xl shadow-red-900/5">
             <div className="flex justify-between items-center mb-8 pb-4 border-b border-red-50">
                <h3 className="text-sm font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                    <MapIcon size={18}/> Live Tactical Map
                </h3>
                <button className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-emerald-100 active:scale-95 transition-all">Mark Area Cleared</button>
             </div>
             <div className="aspect-[16/10] bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center shadow-inner relative overflow-hidden">
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest italic animate-pulse z-10">Initializing GPS...</p>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`, backgroundSize: '30px 30px' }} />
             </div>
          </motion.section>

          {/* 7. Quick Reports Glass Panel (Dark Ref reflection) */}
          <motion.section className="flex flex-col gap-5">
            <div className="rounded-[2.5rem] bg-slate-950/80 backdrop-blur-md p-8 border border-slate-800 shadow-2xl shadow-red-900/10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><Icon name="mic" filled className="text-blue-600 text-8xl" /></div>
              <h3 className="text-sm font-black text-red-600 mb-6 uppercase tracking-[0.2em]">Field Operations</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button onClick={handleReportHazard} className="flex flex-col items-center gap-3 rounded-3xl bg-red-600 text-white p-5 border border-red-400 active:scale-95 transition-all shadow-xl shadow-red-900/20 hover:bg-red-700">
                  <Icon name="add_a_photo" filled className="text-2xl" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Report Hazard</span>
                </button>
                <button onClick={() => window.location.href = "tel:+91XXXXXXXXXX"} // Admin Phone Link
   className="flex flex-col items-center gap-3 rounded-3xl bg-blue-600 text-white p-5 border border-blue-400 active:scale-95 transition-all shadow-xl shadow-blue-900/20 hover:bg-blue-700">
                  <Icon name="mic" filled className="text-2xl" />
                  <span className="text-[11px] font-black uppercase tracking-widest">PTT: Admin</span>
                </button>
              </div>
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
                <textarea value={quickMsg} onChange={(e) => setQuickMsg(e.target.value)} placeholder="Quick message to all responders..." className="w-full bg-transparent border-0 text-sm font-medium text-slate-300 outline-none resize-none placeholder:text-slate-600" rows={3} />
                <button onClick={handleSendMessage} className="w-full bg-white text-slate-950 rounded-xl py-3 text-[11px] font-black mt-3 uppercase tracking-widest shadow-xl active:scale-95 transition-all">Send To All</button>
              </div>
            </div>

            {/* Emergency Hotline Glass Tray */}
            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-red-900/5">
               <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-6">Hotline Tray</p>
               <div className="flex gap-5 justify-around">
                  {[
                    { icon: "local_fire_department", label: "Fire", col: "red",number: "101" },
                    { icon: "policy", label: "Police", col: "blue",number: "100" },
                    { icon: "emergency", label: "ER", col: "emerald",number: "102" }
                  ].map(h => (
                    <button key={h.label}
                    onClick={ () => window.location.href = `tel:${h.number}` } // Direct call on click
                    className="flex flex-col items-center gap-2 group">
                      <div className={`p-4 rounded-3xl transition-transform group-hover:scale-110 ${h.col === 'red' ? 'bg-red-600' : h.col === 'blue' ? 'bg-blue-600' : 'bg-emerald-600'} text-white shadow-lg border border-white/20`}><Icon name={h.icon} filled className="text-2xl" /></div>
                      <span className="text-[9px] font-black uppercase text-slate-600 tracking-wider group-hover:text-red-600 transition-colors">{h.label}</span>
                    </button>
                  ))}
               </div>
            </div>
          </motion.section>
        </div>

        {/* 8. Glass Activity Feed Panel */}
        <section className="mt-6 rounded-[2.5rem] bg-white/40 backdrop-blur-3xl p-8 border border-white/50 shadow-2xl shadow-red-900/5 mb-20 relative overflow-hidden">
  {/* Header Section */}
  <div className="flex items-center justify-between mb-8 pb-4 border-b border-red-100/50">
    <h3 className="text-sm font-black text-red-600 uppercase tracking-[0.2em]">Active System History</h3>
    <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-4 py-1.5 text-[9px] font-black uppercase tracking-wider border border-emerald-200/50 flex items-center gap-1.5 shadow-sm backdrop-blur-md">
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" /> 
      Live Feed Online
    </span>
  </div>

  <motion.div 
    initial="hidden"
    animate="show"
    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
    className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-red-200 before:via-slate-200 before:to-transparent"
  >
    {logs.length > 0 ? logs.map((log) => (
      <motion.div 
        key={log.id}
        variants={{
          hidden: { opacity: 0, x: -20 },
          show: { opacity: 1, x: 0 }
        }}
        className="relative flex gap-5 pl-1 group transition-all"
      >
        {/* Dynamic Icon based on log type */}
        <div className={`relative z-10 h-10 w-10 rounded-xl flex items-center justify-center border border-white/20 shadow-lg transition-transform group-hover:scale-110 
          ${log.type === 'danger' ? 'bg-red-500 shadow-red-200' : 
            log.type === 'warning' ? 'bg-amber-500 shadow-amber-200' : 
            'bg-blue-500 shadow-blue-200'}`}
        >
          <Icon 
            name={log.type === 'danger' ? 'campaign' : log.type === 'warning' ? 'detector_smoke' : 'shield_check'} 
            filled 
            className="text-white text-lg"
          />
        </div>

        <div className="flex-1 bg-white/30 backdrop-blur-md p-5 rounded-[2rem] border border-white/60 hover:bg-white/60 hover:border-red-100 transition-all duration-300 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-red-700">
              {log.msg}
            </p>
            <span className="text-[10px] font-black font-mono text-slate-400 uppercase bg-slate-100/50 px-2 py-0.5 rounded-md">
              {log.time}
            </span>
          </div>
        </div>
      </motion.div>
    )) : (
      <p className="text-center text-xs text-slate-400 font-bold py-10 italic">System integrity verified. No recent logs.</p>
    )}
  </motion.div>
</section>
        
      </main>

      <BottomNav />
    </div>
  );
}


