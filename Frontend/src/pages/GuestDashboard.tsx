import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { db, auth } from "../config/firebase";
import { collection, query, where, onSnapshot, orderBy, limit, doc, updateDoc, getDocs, getDoc } from "firebase/firestore";
import {toast} from "sonner";
import { AlertTriangle } from "lucide-react";

// --- DATA (UNCHANGED) ---
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
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  
  // NEW STATES
  const [showNavMap, setShowNavMap] = useState(false);
  const [isSafe, setIsSafe] = useState(false);
  const [showSOSTriage, setShowSOSTriage] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [evacuationInfo, setEvacuationInfo] = useState({
  exit: "Calculating...",
  distance: "--",
  eta: "--"
});
const [navData, setNavData] = useState({
  path: "M50,400 L50,200 L250,200 L250,50", // Fallback path
  target: "Stairwell B"
});

// useEffect(() => {
//   const user = auth.currentUser;
//   if (!user) return;

//   const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
//     if (doc.exists() && doc.data().svgPath) {
//       setNavData({
//         path: doc.data().svgPath,
//         target: doc.data().targetExit
//       });
//     }
//   });
//   return () => unsub();
// }, []);
useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  
  const unsub = onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      // 1. User ki profile details (Room Number etc.) save karein
      setUserProfile(data); 
      
      // 2. Navigation path update karein (jo humne pehle kiya tha)
      if (data.svgPath) {
        setNavData({
          path: data.svgPath,
          target: data.targetExit || "Stairwell B"
        });
      }
    }
  });

  return () => unsub();
}, []);
useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  // Real-time listener on user's personal evacuation data
  const userRef = doc(db, "users", user.uid);
  const unsub = onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      setEvacuationInfo({
        exit: data.nearestExit || "Searching...",
        distance: data.distance || "0m",
        eta: data.eta || "0s"
      });
    }
  });

  return () => unsub();
}, []);


  useEffect(() => {
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
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("userRole")) localStorage.setItem("userRole", "guest");
  }, []);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setCheckedIn(true);
    }, 1800);
  };

  // 3. Audio Alert Function
  const speakAlert = () => {
    if (announcement) {
      const speech = new SpeechSynthesisUtterance(`Alex, ${announcement}. Please exit via Stairwell B. Avoid Elevators.`);
      window.speechSynthesis.speak(speech);
    }
  };

  // 2. Mark Safe Logic
  const handleMarkSafe = async () => {
    setIsSafe(true);
    // Logic to update Firebase would go here
    // await updateDoc(doc(db, "users", "alex_carter"), { status: "safe" });
  };
  useEffect(() => {
  if (!db) return;

  const unsubStatus = onSnapshot(doc(db, "system", "status"), (snapshot) => {
    if (snapshot.exists()) {
      const statusData = snapshot.data();
      
      // Agar purani state false thi aur ab true hui hai
      if (statusData.isEmergency && !isEmergencyActive) {
        // 1. Browser Toast Alert
        toast.error("🚨 EMERGENCY MODE ACTIVATED!", {
          description: "Follow evacuation protocols and check priority list.",
          duration: Infinity, // Jab tak staff cancel na kare
          action: {
            label: "ACKNOWLEDGE",
            onClick: () => console.log("Staff Acknowledged"),
          },
        });

        // 2. Audio Alert (Optional but useful for Hackathons)
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/emergency_it_is_an_emergency.ogg");
        audio.play().catch(e => console.log("Audio play blocked by browser"));

        // 3. Vibration
        if (window.navigator.vibrate) {
          window.navigator.vibrate([500, 200, 500]);
        }
      }
      setIsEmergencyActive(statusData.isEmergency);
    }
  });

  return () => unsubStatus();
}, [isEmergencyActive]); // Dependency array mein isEmergencyActive rakhein
  

  return (
    // <div className="relative min-h-screen bg-red-100 pb-28 font-sans overflow-x-hidden">
    <div className={`relative min-h-screen transition-colors duration-700 overflow-x-hidden font-sans antialiased text-slate-900 pb-40 ${
          isEmergencyActive ? 'bg-red-200' : 'bg-red-100'
        }`}>
              {isEmergencyActive && (
        <motion.div 
  initial={{ y: -20, opacity: 0 }} 
  animate={{ y: 0, opacity: 1 }}
  className="fixed top-[85px] left-1/3 max-w-max bg-red-600/95 backdrop-blur-md text-white px-5 py-2 rounded-full z-[60] flex items-center gap-3 shadow-[0_10px_25px_rgba(220,38,38,0.3)] border border-white/10"
>
  <div className="flex items-center gap-2">
    <div className="animate-pulse flex items-center">
      <AlertTriangle size={16} className="text-white" />
    </div>
    <span className="font-bold text-[10px] uppercase tracking-[0.12em] whitespace-nowrap">
      Critical: Evacuation in Progress
    </span>
  </div>
</motion.div>
      )}
      <Header />
      
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
      
      
      <div className="relative mx-auto max-w-2xl px-5 pt-28">
        {announcement && (
          <div className="mx-4 mt-4 overflow-hidden rounded-2xl border border-red-300 bg-red-600/90 text-white shadow-xl backdrop-blur-md animate-pulse">
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
              <div className="flex items-center gap-3 font-bold tracking-wide">
                <span className="text-xl">⚠️</span>
                <span className="uppercase text-sm">Alex, {announcement}</span>
              </div>
              <button 
                onClick={speakAlert}
                className="mt-1 flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full text-[10px] font-black tracking-widest hover:bg-white/30 transition-all"
              >
                <Icon name="volume_up" className="text-xs" /> LISTEN INSTRUCTION
              </button>
            </div>
          </div>
        )}

        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6 flex justify-between items-end">
          <div>
            <p className="text-sm font-bold text-slate-500">Good morning,</p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{userProfile?.name || auth.currentUser?.displayName || "Guest User"}</h1>
          </div>
          {/* 2. Check-in for Safety Button */}
          {checkedIn && announcement && !isSafe && (
            <motion.button 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              onClick={handleMarkSafe}
              className="bg-emerald-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200"
            >
              I Am Safe
            </motion.button>
          )}
          {isSafe && (
            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl text-[10px] font-black uppercase border border-emerald-200">
               <Icon name="check_circle" className="text-xs" filled /> Status: Safe
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} 
          className="flex items-center divide-x divide-white/20 overflow-hidden rounded-2xl bg-white/40 backdrop-blur-xl border border-white shadow-lg"
        >
          <div className="flex flex-1 items-center gap-2 px-3 py-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <div><p className="text-[9px] font-black uppercase text-slate-500">Status</p><p className="text-xs font-black text-green-600">SECURE</p></div>
          </div>
          <div className="flex flex-1 items-center gap-2 px-3 py-4">
            <Icon name="apartment" className="text-red-500 text-[18px]" filled />
            <div><p className="text-[9px] font-black uppercase text-slate-500">Venue</p><p className="text-xs font-black text-slate-800">Grand Hyatt</p></div>
          </div>
          <div className="flex flex-1 items-center gap-2 px-3 py-4">
            <Icon name="signal_cellular_alt" className="text-slate-700 text-[18px]" />
            <div><p className="text-[9px] font-black uppercase text-slate-500">Signal</p><p className="text-xs font-black text-slate-800">STRONG</p></div>
          </div>
        </motion.div>

        <div className="relative mt-6">
          <div className={`transition-all duration-700 ${!checkedIn ? "blur-xl opacity-40 pointer-events-none" : ""}`}>
            
            {/* 1. Location Card - Navigation Trigger */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
              onClick={() => setShowNavMap(true)}
              className="overflow-hidden rounded-[2.5rem] bg-white/50 backdrop-blur-2xl p-6 border border-white shadow-xl shadow-red-900/5 cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Current Location</p>
                  <p className="mt-1 text-2xl font-black text-slate-900 group-hover:text-red-600 transition-colors">The Marlowe Grand</p>
                  <p className="text-xs font-bold text-slate-600">Floor {userProfile?.floor || "4"} · Room {userProfile?.room || "402"}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-inner shadow-red-100 border border-red-50">
                  <Icon name="directions" className="text-red-600" filled />
                </div>
              </div>
              {/* <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/50 pt-5 text-center">
                {[{ label: "Nearest exit", value: "Stairwell B" }, { label: "Distance", value: "32 m" }, { label: "ETA", value: "28 sec" }].map((s) => (
                  <div key={s.label}>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{s.label}</p>
                    <p className="text-sm font-black text-slate-800">{s.value}</p>
                  </div>
                ))}
              </div> */}
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/50 pt-5 text-center">
  {[
    { label: "Nearest exit", value: evacuationInfo.exit },
    { label: "Distance", value: evacuationInfo.distance },
    { label: "ETA", value: evacuationInfo.eta }
  ].map((s) => (
    <div key={s.label}>
      <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
        {s.label}
      </p>
      <p className="text-sm font-black text-slate-800 transition-all duration-500">
        {s.value}
      </p>
    </div>
  ))}
</div>
              
              <div className="mt-4 bg-red-600 text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-center animate-pulse">
                Tap to View Evacuation Path
              </div>
            </motion.section>

            <h2 className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-red-600/70 ml-2">Quick contacts</h2>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar">
              {quickContacts.map((c) => (
                <a key={c.label} href={`tel:${c.num}`} className="flex min-w-[100px] flex-col items-center gap-3 rounded-3xl bg-white/60 backdrop-blur-lg p-5 border border-white shadow-lg active:scale-95 transition-all">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md ${c.color}`}><Icon name={c.icon} filled /></div>
                  <div className="text-center"><p className="text-[11px] font-black text-slate-800 leading-tight">{c.label}</p><p className="text-[10px] font-bold text-slate-400">{c.num}</p></div>
                </a>
              ))}
            </div>

            <h2 className="mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-red-600/70 ml-2">Safety Guides</h2>
            <motion.div variants={container} initial="hidden" animate="show" className="mt-3 grid grid-cols-2 gap-4">
              {safetyTips.map((t) => (
                <motion.button 
                  key={t.id} 
                  variants={item} 
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedGuide(safetyContent[t.id])}
                  className="flex flex-col items-start gap-4 rounded-[2rem] bg-white/50 backdrop-blur-xl p-5 text-left border border-white shadow-xl shadow-red-900/5 transition-all hover:bg-white/80"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${t.color}`}><Icon name={t.icon} filled /></div>
                  <div>
                    <p className="text-sm font-black text-slate-800 leading-none mb-1">{t.title}</p>
                    <p className="text-[10px] font-bold text-slate-500">{t.subtitle}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </div>

          {!checkedIn && (
            <motion.div className="absolute inset-x-0 -top-10 flex items-start justify-center pt-20 z-20">
              <motion.div 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
                className="flex max-w-xs flex-col items-center gap-5 rounded-[2.5rem] border border-white bg-white/70 p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-3xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl shadow-red-200"><Icon name="lock" filled /></div>
                <div><p className="text-xl font-black text-slate-900">Check in required</p><p className="mt-2 text-[12px] font-bold text-slate-500 leading-relaxed">Scan the unique QR code at your room or reception to activate the sentinel safety systems.</p></div>
                <button onClick={handleScan} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 text-xs font-black text-white shadow-xl shadow-red-300 active:scale-95">
                  <Icon name="qr_code_scanner" className="text-[20px]" /> SCAN QR
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* SOS Button - 4. Mark as Trapped Trigger */}
      <motion.button 
        whileTap={{ scale: 0.9 }} 
        onClick={() => setShowSOSTriage(true)} 
        className="fixed bottom-28 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-2xl"
      >
        {!checkedIn && <span className="absolute inset-0 rounded-2xl bg-red-500 animate-ping opacity-30" />}
        <Icon name="emergency" className="text-[30px]" filled />
      </motion.button>

      {/* --- 1. INDOOR NAVIGATION MAP OVERLAY --- */}
      <AnimatePresence>
        {showNavMap && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900 text-white p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black">Escape Route</h2>
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest leading-none mt-1">To: Stairwell B</p>
              </div>
              <button onClick={() => setShowNavMap(false)} className="bg-white/10 p-2 rounded-full"><Icon name="close" /></button>
            </div>
            
            {/* Visual Navigation Mock */}
            <div className="flex-1 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 300 500" className="w-full h-full p-10 stroke-red-500 fill-none stroke-[4] opacity-80">
                <path d={navData.path} />
                <motion.circle r="8" fill="#ef4444" 
                  animate={{ offsetDistance: ["0%", "100%"] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  style={{ offsetPath: navData.path }}
                />
              </svg>
              <div className="absolute bottom-10 left-10 text-left">
                <p className="text-xs font-black uppercase text-red-400">Current Position</p>
                <p className="text-xl font-black">Room {userProfile?.room || "402"}</p>
              </div>
            </div>
            <button onClick={() => setShowNavMap(false)} className="mt-6 w-full py-4 bg-red-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">Start Navigation</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 4. SOS TRIAGE / TRAPPED MODAL --- */}
      <AnimatePresence>
        {showSOSTriage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-red-600/95 backdrop-blur-xl flex items-center justify-center p-8"
          >
            <div className="text-center text-white max-w-sm">
              <Icon name="warning" className="text-6xl mb-6 mx-auto animate-bounce" filled />
              <h2 className="text-3xl font-black leading-tight mb-4 uppercase">Emergency Assistance</h2>
              <p className="text-sm font-bold opacity-80 mb-10">Emergency responders have been alerted to your room (402). Are you currently trapped or unable to move?</p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    alert("Admin Notified: Trapped in Room 402");
                    setShowSOSTriage(false);
                  }}
                  className="bg-white text-red-600 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl active:scale-95"
                >
                  Yes, I am trapped
                </button>
                <button 
                  onClick={() => setShowSOSTriage(false)}
                  className="bg-white/20 border border-white/40 py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95"
                >
                  No, but I need help
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SAFETY RULES BOTTOM SHEET (UNCHANGED) --- */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-md p-4"
            onClick={() => setSelectedGuide(null)}
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-lg bg-white/90 backdrop-blur-3xl rounded-t-[3rem] p-10 shadow-2xl border-t border-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
              <div className="flex items-center gap-5 mb-8">
                <div className={`h-16 w-16 rounded-3xl flex items-center justify-center text-white shadow-xl ${selectedGuide.color}`}>
                  <Icon name={selectedGuide.icon} filled className="text-[36px]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedGuide.title}</h2>
                  <p className="text-xs font-black text-red-600 uppercase tracking-widest">Sentinel Protocol</p>
                </div>
              </div>
              <ul className="space-y-5">
                {selectedGuide.points.map((point: string, i: number) => (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    key={i} className="flex items-start gap-4"
                  >
                    <div className="mt-2 h-2 w-2 rounded-full bg-red-400 shrink-0 shadow-sm" />
                    <p className="text-[15px] font-bold text-slate-600 leading-relaxed">{point}</p>
                  </motion.li>
                ))}
              </ul>
              <button onClick={() => setSelectedGuide(null)} className="mt-10 w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm shadow-xl active:scale-95 transition-transform">UNDERSTOOD</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default GuestDashboard;