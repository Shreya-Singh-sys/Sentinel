import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { db } from "../config/firebase";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";

// 1. Detailed Safety Content Data
const safetyContent = {
  fire: {
    title: "Fire Safety Rules",
    icon: "local_fire_department",
    color: "bg-red-500",
    points: [
      "Follow the illuminated exit signs immediately.",
      "Do not use elevators; use the nearest staircase.",
      "Stay low to the ground to avoid smoke inhalation.",
      "Touch doors with the back of your hand before opening.",
      "Assemble at the designated safe zone outside the building."
    ]
  },
  medical: {
    title: "Medical Emergency",
    icon: "local_hospital",
    color: "bg-green-500",
    points: [
      "Call the emergency number 108 or tap the SOS button.",
      "Provide your exact floor and room number clearly.",
      "Keep the patient calm and don't give them water if unconscious.",
      "Locate the nearest Automated External Defibrillator (AED) if needed."
    ]
  },
  pandemic: {
    title: "Pandemic Protocol",
    icon: "health_and_safety",
    color: "bg-blue-500",
    points: [
      "Wear a mask in all common areas and elevators.",
      "Maintain a 6ft distance from other guests.",
      "Sanitize hands at the entry/exit points of the venue.",
      "Report any fever or cough to the reception immediately."
    ]
  },
  contacts: {
    title: "Support & Contacts",
    icon: "support_agent",
    color: "bg-orange-500",
    points: [
      "Reception is available 24/7 for any assistance.",
      "Security patrol is active on all floors every 30 minutes.",
      "Lost & Found is located at the ground floor lobby.",
      "Tap the contact icons below for direct calling."
    ]
  }
};

const safetyTips = [
  { id: "fire", icon: "local_fire_department", title: "Fire Safety", subtitle: "Stay safe from fire", color: "bg-red-50 text-red-600" },
  { id: "medical", icon: "local_hospital", title: "Medical Help", subtitle: "Emergency aid", color: "bg-green-50 text-green-600" },
  { id: "pandemic", icon: "health_and_safety", title: "Pandemic Rules", subtitle: "Safety protocols", color: "bg-blue-50 text-blue-600" },
  { id: "contacts", icon: "support_agent", title: "Support", subtitle: "24/7 Assistance", color: "bg-orange-50 text-orange-600" },
];

const quickContacts = [
  { icon: "local_hospital", label: "Medical", num: "108", color: "bg-red-500 text-white" },
  { icon: "local_fire_department", label: "Fire", num: "101", color: "bg-orange-500 text-white" },
  { icon: "concierge", label: "Reception", num: "0", color: "bg-blue-500 text-white" },
  { icon: "policy", label: "Security", num: "112", color: "bg-slate-900 text-white" },
  { icon: "local_police", label: "Police", num: "100", color: "bg-cyan-500 text-white" },
  { icon: "emergency", label: "Emergency", num: "911", color: "bg-red-700 text-white" },
];

const container: Variants = { show: { transition: { staggerChildren: 0.06 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 22 } },
};

const GuestDashboard = () => {
  const navigate = useNavigate();
  const [checkedIn, setCheckedIn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  useEffect(() => {
    // 1. Sirf 'guest' target wale latest message ko listen karein
    const q = query(
      collection(db, "broadcasts"),
      where("target", "==", "guest"),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const msgData = snapshot.docs[0].data();
        setAnnouncement(msgData.message);
        
        // Browser alert (Testing ke liye best hai)
        alert("URGENT ANNOUNCEMENT: " + msgData.message);
      }
    });

    return () => unsubscribe();
  }, []);
//   useEffect(() => {
//   // Sirf broadcasts collection ko listen karein bina kisi complex query ke (testing ke liye)
//   const unsubscribe = onSnapshot(collection(db, "broadcasts"), (snapshot) => {
//     snapshot.docChanges().forEach((change) => {
//       if (change.type === "added") {
//         const msgData = change.doc.data();
        
//         // Check karein ki kya ye guest ke liye hai
//         if (msgData.target === "guest") {
//           console.log("Naya message aaya:", msgData.message);
//           alert("URGENT: " + msgData.message);
//           setAnnouncement(msgData.message);
//         }
//       }
//     });
//   });

//   return () => unsubscribe();
// }, []);

  useEffect(() => {
    if (!localStorage.getItem("userRole")) localStorage.setItem("userRole", "guest");
  }, []);
  const [selectedGuide, setSelectedGuide] = useState(null); // Modal State

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setCheckedIn(true);
    }, 1800);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 pb-28 font-sans">
      <Header />
      
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-slate-200/50 to-transparent" />
      <div className="relative mx-auto max-w-2xl px-5 pt-28">
        {announcement && (
          // <div className="bg-red-600 text-white p-4 animate-bounce text-center font-bold">
          //   ⚠️ {announcement}
          // </div>
          <div className="mx-4 mt-4 overflow-hidden rounded-2xl border border-red-200 bg-red-600/90 text-white shadow-lg backdrop-blur-sm animate-pulse">
    <div className="flex items-center justify-center gap-3 p-4 text-center font-bold tracking-wide">
      <span className="text-xl">⚠️</span>
      <span className="uppercase">{announcement}</span>
    </div>
  </div>
        )}

        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <p className="text-sm font-bold text-slate-500">Good morning,</p>
          <h1 className="text-2xl font-black text-slate-900">Alex Carter</h1>
        </motion.div>

        {/* Info Stats Strip */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center divide-x divide-slate-100 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex flex-1 items-center gap-2 px-3 py-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <div><p className="text-[9px] font-black uppercase text-slate-400">Status</p><p className="text-xs font-black text-green-600">SECURE</p></div>
          </div>
          <div className="flex flex-1 items-center gap-2 px-3 py-3">
            <Icon name="apartment" className="text-red-500 text-[18px]" filled />
            <div><p className="text-[9px] font-black uppercase text-slate-400">Venue</p><p className="text-xs font-black text-slate-800">Grand Hyatt</p></div>
          </div>
          <div className="flex flex-1 items-center gap-2 px-3 py-3">
            <Icon name="signal_cellular_alt" className="text-slate-700 text-[18px]" />
            <div><p className="text-[9px] font-black uppercase text-slate-400">Signal</p><p className="text-xs font-black text-slate-800">STRONG</p></div>
          </div>
        </motion.div>

        {/* Content Area with Blur Logic */}
        <div className="relative mt-6">
          <div className={`transition-all duration-700 ${!checkedIn ? "blur-md opacity-40 pointer-events-none" : ""}`}>
            
            {/* Location Card */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl bg-white p-5 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">Current Location</p>
                  <p className="mt-1 text-lg font-black text-slate-900">The Marlowe Grand</p>
                  <p className="text-xs font-bold text-slate-500">Floor 4 · Room 402</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50"><Icon name="hotel" className="text-red-600" filled /></div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-50 pt-4 text-center">
                {[{ label: "Nearest exit", value: "Stairwell B" }, { label: "Distance", value: "32 m" }, { label: "ETA", value: "28 sec" }].map((s) => (
                  <div key={s.label}><p className="text-[9px] font-black uppercase text-slate-400">{s.label}</p><p className="text-xs font-black text-slate-800">{s.value}</p></div>
                ))}
              </div>
            </motion.section>

            {/* Contacts Strip */}
            <h2 className="mt-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Quick contacts</h2>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
              {quickContacts.map((c) => (
                <a key={c.label} href={`tel:${c.num}`} className="flex min-w-[90px] flex-col items-center gap-2 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm active:scale-95 transition-all">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full ${c.color}`}><Icon name={c.icon} filled /></div>
                  <div className="text-center"><p className="text-[10px] font-black text-slate-800">{c.label}</p><p className="text-[9px] font-bold text-slate-400">{c.num}</p></div>
                </a>
              ))}
            </div>

            {/* Safety Guides Grid (Updated with onClick) */}
            <h2 className="mt-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Safety Guides</h2>
            <motion.div variants={container} initial="hidden" animate="show" className="mt-3 grid grid-cols-2 gap-3">
              {safetyTips.map((t) => (
                <motion.button 
                  key={t.id} 
                  variants={item} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGuide(safetyContent[t.id])}
                  className="flex flex-col items-start gap-3 rounded-2xl bg-white p-4 text-left border border-slate-100 shadow-sm transition-all active:bg-slate-50"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.color}`}><Icon name={t.icon} filled /></div>
                  <div><p className="text-xs font-black text-slate-800 leading-tight">{t.title}</p><p className="text-[10px] font-bold text-slate-400">{t.subtitle}</p></div>
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Soft-lock Overlay */}
          {!checkedIn && (
            <motion.div className="absolute inset-0 flex items-start justify-center pt-10 z-20">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex max-w-xs flex-col items-center gap-4 rounded-3xl border border-slate-100 bg-white/95 p-6 text-center shadow-2xl backdrop-blur-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50"><Icon name="lock" filled className="text-red-600" /></div>
                <div><p className="text-base font-black text-slate-900">Check in to activate</p><p className="mt-2 text-[11px] font-bold text-slate-500">Scan the QR at your room or reception to unlock live safety features.</p></div>
                <button onClick={handleScan} className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-black text-white shadow-lg shadow-red-200 active:scale-95">
                  <Icon name="qr_code_scanner" className="text-[18px]" /> SCAN QR
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating QR FAB */}
      <motion.button whileTap={{ scale: 0.9 }} onClick={handleScan} className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg">
        {!checkedIn && <span className="absolute inset-0 rounded-2xl bg-red-500 animate-ping opacity-25" />}
        <Icon name="qr_code_scanner" className="text-[26px]" filled />
      </motion.button>

      {/* --- SAFETY RULES BOTTOM SHEET --- */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedGuide(null)}
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-white rounded-t-[2.5rem] p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white ${selectedGuide.color}`}>
                  <Icon name={selectedGuide.icon} filled className="text-[32px]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{selectedGuide.title}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Protocol</p>
                </div>
              </div>
              <ul className="space-y-4">
                {selectedGuide.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
                    <p className="text-sm font-bold text-slate-600 leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
              <button onClick={() => setSelectedGuide(null)} className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm active:scale-95 transition-transform">GOT IT</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanning Overlay Animation */}
      <AnimatePresence>
        {scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-md text-white">
            <div className="flex flex-col items-center">
              <div className="relative h-56 w-56 overflow-hidden rounded-3xl border-2 border-white/20">
                <motion.div animate={{ y: [0, 224, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-x-0 h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
              </div>
              <p className="mt-6 font-black tracking-widest text-xs uppercase">Verifying Venue QR...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default GuestDashboard;