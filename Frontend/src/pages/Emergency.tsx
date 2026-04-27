// import React, { useEffect, useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   AlertTriangle, Siren, CheckCircle2, Send, ShieldX, 
//   Clock, Navigation, Camera, MapPin, Radio, Wifi, 
//   Activity, Key, User, Phone, Droplet, HeartPulse,
//   Flame, Zap, Wind, ShieldAlert
// } from "lucide-react";
// import { GoogleMap, Marker, OverlayView, Polyline, useJsApiLoader } from "@react-google-maps/api";
// import { toast } from "sonner";
// import { useI18n } from "../i18n/I18nProvider";

// // --- Types & Mock Data ---
// type IncidentStatus = "active" | "dispatched" | "resolved" | "false_alarm";

// const MOCK_INCIDENT = {
//   id: "INC-2148",
//   code: "FIRE-A2",
//   type: "Electrical",
//   severity: "Critical",
//   reportedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
//   status: "active" as IncidentStatus,
//   address: "Tower B, Marine Heights, Marine Drive, Mumbai 400002",
//   location: { lat: 18.9438, lng: 72.8231 },
//   unit: { lat: 18.9512, lng: 72.8347, label: "Engine 14" },
//   etaMinutes: 6,
//   distanceKm: 2.3,
//   victim: {
//     name: "Rohan Mehta",
//     age: 34,
//     bloodGroup: "O+",
//     phone: "+91 98201 44321",
//     medicalNotes: "Asthmatic. Inhaler in left pocket reported.",
//   },
//   description: "Heavy smoke from 7th floor electrical panel. 2 occupants trapped near stairwell B. No sprinklers active.",
//   evidence: [
//     { id: "ev1", url: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=70", caption: "Smoke from window" },
//     { id: "ev2", url: "https://images.unsplash.com/photo-1574870111867-089730e5a72b?w=600&q=70", caption: "Building exterior" },
//   ],
// };

// // --- Sub-Components ---

// const ActionPanel = ({ status, onDispatch, onBackup, onFalseAlarm, onResolve }: any) => {
//   const { t } = useI18n();

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("emergency.tacticalActions")}</p>
//       <div className="mt-3 grid gap-2">
//         {status === "active" && (
//           <button onClick={onDispatch} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-4 text-sm font-black uppercase text-white shadow-lg shadow-red-100 animate-pulse">
//             <Siren size={18} /> {t("emergency.dispatchUnit", { unit: "Engine 14" })}
//           </button>
//         )}
//         {status === "dispatched" && (
//           <button onClick={onResolve} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-sm font-black uppercase text-white shadow-lg shadow-emerald-100">
//             <CheckCircle2 size={18} /> {t("emergency.markResolved")}
//           </button>
//         )}
//         <div className="grid grid-cols-2 gap-2">
//           <button onClick={onBackup} className="flex items-center justify-center gap-2 rounded-xl bg-amber-50 py-3 text-[10px] font-black uppercase text-amber-600 border border-amber-100">
//             <Send size={14} /> {t("emergency.requestBackup")}
//           </button>
//           <button onClick={onFalseAlarm} className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-[10px] font-black uppercase text-slate-600 border border-slate-100">
//             <ShieldX size={14} /> {t("emergency.falseAlarm")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const VictimCard = ({ victim }: any) => {
//   const { t } = useI18n();

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//       <div className="flex items-center gap-2 mb-3">
//         <HeartPulse size={16} className="text-red-500" />
//         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("emergency.victimInfo")}</span>
//       </div>
//       <div className="flex items-center gap-4">
//         <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><User size={24} /></div>
//         <div className="flex-1">
//           <p className="text-sm font-black text-slate-900">{victim.name}, {victim.age}</p>
//           <div className="flex gap-3 mt-1">
//             <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase">{t("emergency.blood", { group: victim.bloodGroup })}</span>
//             <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Phone size={10} /> {victim.phone}</span>
//           </div>
//         </div>
//       </div>
//       <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-2 text-[11px] font-bold text-amber-700">
//         {t("emergency.note", { note: victim.medicalNotes })}
//       </div>
//     </div>
//   );
// };

// // --- Main Emergency Page ---
// const Emergency = () => {
//   const { t } = useI18n();
//   const [incident, setIncident] = useState(MOCK_INCIDENT);
//   const [mapKey, setMapKey] = useState<string | null>(localStorage.getItem("sentinel.gmaps.key"));
//   const [time, setTime] = useState(new Date().toLocaleTimeString());

//   useEffect(() => {
//     const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: mapKey || "",
//     id: "sentinel-map"
//   });

//   const handleDispatch = () => {
//     setIncident(prev => ({ ...prev, status: "dispatched" }));
//     toast.success(t("emergency.toast.unitsDispatched"), { description: t("emergency.toast.unitEnRoute", { unit: "Engine 14" }) });
//   };

//   return (
//     <div className="flex h-screen flex-col bg-slate-50 overflow-hidden font-sans antialiased">
//       {/* Top Bar (Sentinel Light Theme) */}
//       <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 z-10">
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-100">
//               <AlertTriangle className="text-white" size={20} />
//             </div>
//             <div>
//               <p className="text-sm font-black tracking-tighter">{t("app.name")}</p>
//               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{t("emergency.dispatchConsole")}</p>
//             </div>
//           </div>
//           <div className="ml-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 border border-slate-100">
//             <Radio size={14} className="text-red-500" />
//             <span className="font-mono text-[11px] font-black text-slate-700 uppercase">{incident.unit.label} · {incident.code}</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-100">
//             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//             <span className="text-[10px] font-black text-emerald-600 uppercase">{t("emergency.liveConnection")}</span>
//           </div>
//           <div className="flex items-center gap-2 text-slate-400 font-mono text-sm font-black border-l pl-4 border-slate-200">
//              <Activity size={16} /> {time}
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] overflow-hidden">
//         {/* Map Section */}
//         <section className="relative bg-slate-200">
//           {!isLoaded ? (
//             <div className="h-full w-full flex flex-col items-center justify-center bg-white">
//                <MapPin size={48} className="text-slate-300 animate-bounce" />
//                <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">{t("emergency.loadingMap")}</p>
//             </div>
//           ) : (
//             <GoogleMap
//               mapContainerStyle={{ width: "100%", height: "100%" }}
//               center={incident.location}
//               zoom={15}
//               options={{ disableDefaultUI: true, styles: [] }} // Empty styles for light theme
//             >
//               <Marker position={incident.location} label="🔥" />
//               <Marker position={incident.unit} label="🚒" />
//             </GoogleMap>
//           )}
//           {/* Floating HUD */}
//           <div className="absolute top-6 left-6 p-4 bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-xl">
//              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("emergency.targetCoordinates")}</p>
//              <p className="mt-1 font-mono text-xs font-black text-slate-800">{incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}</p>
//           </div>
//         </section>

//         {/* Sidebar Controls */}
//         <aside className="overflow-y-auto bg-slate-50 p-5 flex flex-col gap-5 border-l border-slate-200 shadow-inner">
          
//           {/* Incident Details Card */}
//           <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm ring-1 ring-red-100">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <Flame size={18} className="text-red-600 animate-pulse" />
//                 <span className="text-[10px] font-black uppercase text-red-600 tracking-widest">{incident.severity} · {incident.type}</span>
//               </div>
//               <span className="text-[10px] font-black text-slate-400 uppercase">{t("emergency.reportedAgo", { mins: 3 })}</span>
//             </div>
//             <h2 className="text-base font-black text-slate-900 leading-tight">{incident.description}</h2>
//             <div className="mt-4 flex items-start gap-2 bg-white/60 p-3 rounded-xl border border-red-100">
//               <MapPin size={16} className="text-red-500 shrink-0" />
//               <p className="text-xs font-bold text-slate-600">{incident.address}</p>
//             </div>
//           </div>

//           {/* ETA & Distance */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("emergency.eta")}</p>
//               <p className="mt-1 text-2xl font-black text-slate-900 font-mono">0{incident.etaMinutes}:00</p>
//             </div>
//             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("emergency.distance")}</p>
//               <p className="mt-1 text-2xl font-black text-slate-900 font-mono">{incident.distanceKm} km</p>
//             </div>
//           </div>

//           <VictimCard victim={incident.victim} />

//           {/* Evidence Grid */}
//           <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
//              <div className="flex items-center gap-2 mb-3">
//                <Camera size={16} className="text-slate-400" />
//                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("emergency.sceneEvidence")}</span>
//              </div>
//              <div className="grid grid-cols-2 gap-2">
//                 {incident.evidence.map(e => (
//                   <div key={e.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
//                     <img src={e.url} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
//                     <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
//                       <p className="text-[8px] font-bold text-white uppercase">{e.caption}</p>
//                     </div>
//                   </div>
//                 ))}
//              </div>
//           </div>

//           <ActionPanel 
//             status={incident.status} 
//             onDispatch={handleDispatch}
//             onResolve={() => setIncident(prev => ({ ...prev, status: "resolved" }))}
//           />
//         </aside>
//       </main>
//     </div>
//   );
// };

// export default Emergency;

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { 
  AlertTriangle, Siren, CheckCircle2, Send, ShieldX, 
  Clock, Navigation, Camera, MapPin, Radio, Activity, 
  User, Phone, HeartPulse, Flame, ShieldAlert,
  Droplets, Sparkles, Share2, MessageSquare, Globe, Siren as SirenIcon
} from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader, TrafficLayer } from "@react-google-maps/api";
import { toast } from "sonner";
import { db } from "../config/firebase"; // Aapka firebase config path
import { doc, onSnapshot, updateDoc, collection, query, where } from "firebase/firestore";

// --- Animation Variants ---
const glassVar: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const Emergency = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showTraffic, setShowTraffic] = useState(false);
  const [status, setStatus] = useState("active");
  const [incidentData, setIncidentData] = useState(null);
  const [victimData, setVictimData] = useState(null);
  const [currentPos, setCurrentPos] = useState({ lat: 18.9438, lng: 72.8231 }); // Default fallback
  useEffect(() => {
  // 1. Live Incident Tracking (Assuming a specific incident ID)
  const unsubIncident = onSnapshot(doc(db, "incidents", "CURRENT_INCIDENT_ID"), (doc) => {
    if (doc.exists()) setIncidentData(doc.data());
  });

  // 2. Victim Tracking
  const unsubVictim = onSnapshot(doc(db, "victims", "VICTIM_ID"), (doc) => {
    if (doc.exists()) setVictimData(doc.data());
  });

  return () => { unsubIncident(); unsubVictim(); };
}, []);
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPos({ lat: latitude, lng: longitude });
        
        // Optional: Firestore mein responder ki live location update karein
        // updateDoc(doc(db, "responders", "ENGINE_14"), { location: new GeoPoint(latitude, longitude) });
      },
      (error) => {
        console.error("Error fetching location:", error);
        toast.error("Location access denied. Using default coordinates.");
      },
      { enableHighAccuracy: true }
    );
  } else {
    toast.error("Geolocation is not supported by your browser.");
  }
}, []);

// Dispatch Function
const handleDispatch = async () => {
  try {
    // Backend API ko trigger karein taaki Gemini insight update ho
    await fetch('http://localhost:5000/api/trigger-dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentId: "CURRENT_INCIDENT_ID", unit: "ENGINE 14" })
    });
    
    setStatus('dispatched');
    toast.success("Unit ENGINE 14 Dispatched successfully");
  } catch (error) {
    toast.error("Dispatch failed");
  }
};

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: localStorage.getItem("sentinel.gmaps.key") || "",
    id: "sentinel-map"
  });

  return (
    <div className="flex h-screen flex-col bg-red-100/40 overflow-hidden font-sans antialiased text-slate-900">
      
      {/* 1. Header */}
      <header className="flex h-16 items-center justify-between border-b border-red-200 bg-white/80 backdrop-blur-md px-6 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
              <ShieldAlert size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 leading-none">Sentinel</p>
              <p className="text-sm font-black text-slate-900">Tactical Dispatch</p>
            </div>
          </div>
          <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2">
            <Radio size={14} className="text-red-500 animate-pulse" />
            <span className="font-mono text-[11px] font-black tracking-widest text-slate-600 uppercase">ENGINE 14 · FIRE-A2</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Secure Link</span>
           </div>
           <div className="text-slate-400 font-mono text-sm font-black border-l pl-4 border-slate-200 flex items-center gap-2">
             <Clock size={16}/> {time}
           </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_420px] overflow-hidden relative">
        
        {/* 2. Map Section */}
        <section className="relative bg-slate-200">
          {!isLoaded ? (
            <div className="h-full w-full flex items-center justify-center bg-white">
              <div className="text-center">
                <MapPin size={40} className="text-red-600 mx-auto animate-bounce" />
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Satellite Data...</p>
              </div>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={currentPos}
              zoom={17}
              options={{ disableDefaultUI: true }}
            >
              <Marker 
    position={currentPos} 
    icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" 
  />
              {showTraffic && <TrafficLayer />}
            </GoogleMap>
          )}

          {/* Floating Map HUD */}
          <div className="absolute top-6 left-6 space-y-3">
             <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Coordinates</p>
                <p className="font-mono text-xs font-black text-slate-800">{incidentData?.lat?.toFixed(4)}, {incidentData?.lng?.toFixed(4)}</p>
                <div className="mt-2 bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 animate-pulse">
                   <ShieldAlert size={12}/> <span className="text-[10px] font-black uppercase">Target: Floor 7</span>
                </div>
             </div>
             <button onClick={() => setShowTraffic(!showTraffic)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 border transition-all ${showTraffic ? 'bg-blue-600 text-white border-blue-400' : 'bg-white text-slate-600 border-slate-200'}`}>
                <Globe size={14}/> Traffic Layer: {showTraffic ? 'ON' : 'OFF'}
             </button>
          </div>

          {/* Quick Contact Tray */}
          <div className="absolute bottom-8 left-6 flex gap-2">
             {['POLICE', 'HOSPITAL', 'FIRE'].map((label, i) => (
                <button key={label} className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-2 hover:bg-white transition-all active:scale-95">
                  <div className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-emerald-500' : 'bg-red-600'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                </button>
             ))}
          </div>
        </section>

        {/* 3. Right Sidebar (The Glass Panels) */}
        <aside className="overflow-y-auto p-5 flex flex-col gap-4 bg-red-100/20 backdrop-blur-sm border-l border-red-200 shadow-inner">
          
          {/* Incident Glass Card */}
          <motion.div variants={glassVar} initial="initial" animate="animate" className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white p-6 shadow-xl shadow-red-900/5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                <Flame size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Critical - Electrical</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase">3M AGO</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 leading-tight mb-4">{incidentData?.description || "Loading incident details..."}</h2>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-red-50 p-3 rounded-2xl border border-red-100 flex items-center gap-3">
                <ZapOff size={18} className="text-red-600" />
                <div><p className="text-[8px] font-black text-red-400 uppercase">Power Status</p><p className="text-[10px] font-black text-red-700 uppercase">Offline</p></div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
                <Droplets size={18} className="text-emerald-600" />
                <div><p className="text-[8px] font-black text-emerald-400 uppercase">Gas Lines</p><p className="text-[10px] font-black text-emerald-700 uppercase">Isolated</p></div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/40 p-3 rounded-2xl border border-white">
              <MapPin size={18} className="text-red-600 shrink-0" />
              <p className="text-[11px] font-bold text-slate-600 leading-snug">Tower B, Marine Heights, Marine Drive, Mumbai 400002</p>
            </div>
          </motion.div>

          {/* ETA Glass Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border border-white shadow-lg text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ETA (Rapid)</p>
              <p className="text-3xl font-black text-slate-900 font-mono">06:00</p>
            </div>
            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border border-white shadow-lg text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Distance</p>
              <p className="text-3xl font-black text-slate-900 font-mono">2.3 km</p>
            </div>
          </div>

          {/* Victim Data Fixed Card */}
          <motion.div variants={glassVar} initial="initial" animate="animate" className="bg-white/70 backdrop-blur-2xl rounded-[2rem] border border-white p-6 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                 <HeartPulse size={18} className="text-red-500" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Victim Data Feed</h3>
              </div>
              <div className="bg-red-50 px-2 py-1 rounded-lg border border-red-100 flex items-center gap-1">
                 <Activity size={12} className="text-red-600" />
                 <span className="text-[10px] font-black text-red-600 animate-pulse">{victimData?.bpm || "0"} BPM </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                <User size={30} />
              </div>
              <div>
                <p className="text-base font-black text-slate-900 leading-none">Rohan Mehta, 34</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[9px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full uppercase">Blood: O+</span>
                  <span className="text-[9px] font-black text-slate-500 flex items-center gap-1 border border-slate-200 px-2 py-0.5 rounded-full tracking-tighter"><Phone size={10}/> +91 98201 44321</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-[11px] font-bold text-amber-800 leading-relaxed">
               Note: Asthmatic. Inhaler in left pocket reported. Occupants trapped near stairwell B.
            </div>

            <button className="mt-4 w-full bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2">
              <Navigation size={14}/> Launch Indoor Pathing
            </button>
          </motion.div>

          {/* Evidence Glass Card */}
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white p-5 shadow-lg">
             <div className="flex items-center gap-2 mb-4">
                <Camera size={16} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tactical Evidence</span>
             </div>
             <div className="grid grid-cols-2 gap-3">
                {[
                  { img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=400", label: "SMOKE FROM WINDOW" },
                  { img: "https://images.unsplash.com/photo-1574870111867-089730e5a72b?w=400", label: "BUILDING EXTERIOR" }
                ].map((e, i) => (
                  <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-white group">
                    <img src={e.img} className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" />
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 text-[8px] font-black text-white uppercase tracking-tighter">{e.label}</div>
                  </div>
                ))}
             </div>
          </div>

          {/* Action Glass Card */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] border border-white p-5 shadow-2xl mt-auto">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Dispatch Control Panel</p>
             <button onClick={handleDispatch} className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all ${status === 'active' ? 'bg-red-600 text-white shadow-red-200 animate-pulse hover:bg-red-700' : 'bg-emerald-600 text-white shadow-emerald-100'}`}>
                {status === 'active' ? <><SirenIcon size={18}/> DISPATCH ENGINE 14</> : <><CheckCircle2 size={18}/> UNIT DISPATCHED</>}
             </button>
             <div className="grid grid-cols-2 gap-2 mt-2">
                <button className="bg-amber-50 text-amber-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-100 hover:bg-amber-100">Request Backup</button>
                <button className="bg-slate-100 text-slate-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-200">False Alarm</button>
             </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

// Mock ZapOff for missing lucide icon in your local setup if any
const ZapOff = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 2 20 20"/><path d="m12.5 6.5 3 3.5H22L11 22.5l-1-7.5-3.5-3"/><path d="M11.3 6.2 13 2.5 10 2.5 6.7 6.4"/></svg>
);

export default Emergency;