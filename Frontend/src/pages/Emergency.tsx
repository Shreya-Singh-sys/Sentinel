// import React, { useEffect, useState } from "react";
// import { motion, Variants } from "framer-motion";
// import { 
//   AlertTriangle, Siren, CheckCircle2, Send, ShieldX, 
//   Clock, Navigation, Camera, MapPin, Radio, Activity, 
//   User, Phone, HeartPulse, Flame, ShieldAlert,
//   Droplets, Sparkles, Share2, MessageSquare, Globe, Siren as SirenIcon
// } from "lucide-react";
// import { GoogleMap, Marker, useJsApiLoader, TrafficLayer } from "@react-google-maps/api";
// import { toast } from "sonner";
// import { db } from "../config/firebase"; // Aapka firebase config path
// import { doc, onSnapshot, updateDoc, collection, query, where } from "firebase/firestore";

// // --- Animation Variants ---
// const glassVar: Variants = {
//   initial: { opacity: 0, y: 10 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
// };

// const Emergency = () => {
//   const [time, setTime] = useState(new Date().toLocaleTimeString());
//   const [showTraffic, setShowTraffic] = useState(false);
//   const [status, setStatus] = useState("active");
//   const [incidentData, setIncidentData] = useState(null);
//   const [victimData, setVictimData] = useState(null);
//   const [currentPos, setCurrentPos] = useState({ lat: 18.9438, lng: 72.8231 }); // Default fallback
//   useEffect(() => {
//   // 1. Live Incident Tracking (Assuming a specific incident ID)
//   const unsubIncident = onSnapshot(doc(db, "incidents", "CURRENT_INCIDENT_ID"), (doc) => {
//     if (doc.exists()) setIncidentData(doc.data());
//   });

//   // 2. Victim Tracking
//   const unsubVictim = onSnapshot(doc(db, "victims", "VICTIM_ID"), (doc) => {
//     if (doc.exists()) setVictimData(doc.data());
//   });

//   return () => { unsubIncident(); unsubVictim(); };
// }, []);
// useEffect(() => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setCurrentPos({ lat: latitude, lng: longitude });
        
//         // Optional: Firestore mein responder ki live location update karein
//         // updateDoc(doc(db, "responders", "ENGINE_14"), { location: new GeoPoint(latitude, longitude) });
//       },
//       (error) => {
//         console.error("Error fetching location:", error);
//         toast.error("Location access denied. Using default coordinates.");
//       },
//       { enableHighAccuracy: true }
//     );
//   } else {
//     toast.error("Geolocation is not supported by your browser.");
//   }
// }, []);

// // Dispatch Function
// const handleDispatch = async () => {
//   try {
//     // Backend API ko trigger karein taaki Gemini insight update ho
//     await fetch('http://localhost:5000/api/trigger-dispatch', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ incidentId: "CURRENT_INCIDENT_ID", unit: "ENGINE 14" })
//     });
    
//     setStatus('dispatched');
//     toast.success("Unit ENGINE 14 Dispatched successfully");
//   } catch (error) {
//     toast.error("Dispatch failed");
//   }
// };

//   useEffect(() => {
//     const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: localStorage.getItem("sentinel.gmaps.key") || "",
//     id: "sentinel-map"
//   });

//   return (
//     <div className="flex h-screen flex-col bg-red-100/40 overflow-hidden font-sans antialiased text-slate-900">
      
//       {/* 1. Header */}
//       <header className="flex h-16 items-center justify-between border-b border-red-200 bg-white/80 backdrop-blur-md px-6 z-20">
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <div className="h-9 w-9 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
//               <ShieldAlert size={20} fill="currentColor" />
//             </div>
//             <div>
//               <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 leading-none">Sentinel</p>
//               <p className="text-sm font-black text-slate-900">Tactical Dispatch</p>
//             </div>
//           </div>
//           <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2">
//             <Radio size={14} className="text-red-500 animate-pulse" />
//             <span className="font-mono text-[11px] font-black tracking-widest text-slate-600 uppercase">ENGINE 14 · FIRE-A2</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
//               <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
//               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Secure Link</span>
//            </div>
//            <div className="text-slate-400 font-mono text-sm font-black border-l pl-4 border-slate-200 flex items-center gap-2">
//              <Clock size={16}/> {time}
//            </div>
//         </div>
//       </header>

//       <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_420px] overflow-hidden relative">
        
//         {/* 2. Map Section */}
//         <section className="relative bg-slate-200">
//           {!isLoaded ? (
//             <div className="h-full w-full flex items-center justify-center bg-white">
//               <div className="text-center">
//                 <MapPin size={40} className="text-red-600 mx-auto animate-bounce" />
//                 <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Satellite Data...</p>
//               </div>
//             </div>
//           ) : (
//             <GoogleMap
//               mapContainerStyle={{ width: "100%", height: "100%" }}
//               center={currentPos}
//               zoom={17}
//               options={{ disableDefaultUI: true }}
//             >
//               <Marker 
//     position={currentPos} 
//     icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" 
//   />
//               {showTraffic && <TrafficLayer />}
//             </GoogleMap>
//           )}

//           {/* Floating Map HUD */}
//           <div className="absolute top-6 left-6 space-y-3">
//              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl">
//                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Coordinates</p>
//                 <p className="font-mono text-xs font-black text-slate-800">{incidentData?.lat?.toFixed(4)}, {incidentData?.lng?.toFixed(4)}</p>
//                 <div className="mt-2 bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 animate-pulse">
//                    <ShieldAlert size={12}/> <span className="text-[10px] font-black uppercase">Target: Floor 7</span>
//                 </div>
//              </div>
//              <button onClick={() => setShowTraffic(!showTraffic)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 border transition-all ${showTraffic ? 'bg-blue-600 text-white border-blue-400' : 'bg-white text-slate-600 border-slate-200'}`}>
//                 <Globe size={14}/> Traffic Layer: {showTraffic ? 'ON' : 'OFF'}
//              </button>
//           </div>

//           {/* Quick Contact Tray */}
//           <div className="absolute bottom-8 left-6 flex gap-2">
//              {['POLICE', 'HOSPITAL', 'FIRE'].map((label, i) => (
//                 <button key={label} className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-2 hover:bg-white transition-all active:scale-95">
//                   <div className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-emerald-500' : 'bg-red-600'}`} />
//                   <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
//                 </button>
//              ))}
//           </div>
//         </section>

//         {/* 3. Right Sidebar (The Glass Panels) */}
//         <aside className="overflow-y-auto p-5 flex flex-col gap-4 bg-red-100/20 backdrop-blur-sm border-l border-red-200 shadow-inner">
          
//           {/* Incident Glass Card */}
//           <motion.div variants={glassVar} initial="initial" animate="animate" className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white p-6 shadow-xl shadow-red-900/5">
//             <div className="flex justify-between items-start mb-4">
//               <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
//                 <Flame size={14} className="animate-pulse" />
//                 <span className="text-[10px] font-black uppercase tracking-tighter">Critical - Electrical</span>
//               </div>
//               <span className="text-[10px] font-black text-slate-400 uppercase">3M AGO</span>
//             </div>
//             <h2 className="text-lg font-black text-slate-900 leading-tight mb-4">{incidentData?.description || "Loading incident details..."}</h2>
            
//             <div className="grid grid-cols-2 gap-2 mb-4">
//               <div className="bg-red-50 p-3 rounded-2xl border border-red-100 flex items-center gap-3">
//                 <ZapOff size={18} className="text-red-600" />
//                 <div><p className="text-[8px] font-black text-red-400 uppercase">Power Status</p><p className="text-[10px] font-black text-red-700 uppercase">Offline</p></div>
//               </div>
//               <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
//                 <Droplets size={18} className="text-emerald-600" />
//                 <div><p className="text-[8px] font-black text-emerald-400 uppercase">Gas Lines</p><p className="text-[10px] font-black text-emerald-700 uppercase">Isolated</p></div>
//               </div>
//             </div>

//             <div className="flex items-start gap-3 bg-white/40 p-3 rounded-2xl border border-white">
//               <MapPin size={18} className="text-red-600 shrink-0" />
//               <p className="text-[11px] font-bold text-slate-600 leading-snug">Tower B, Marine Heights, Marine Drive, Mumbai 400002</p>
//             </div>
//           </motion.div>

//           {/* ETA Glass Grid */}
//           <div className="grid grid-cols-2 gap-3">
//             <div className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border border-white shadow-lg text-center">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ETA (Rapid)</p>
//               <p className="text-3xl font-black text-slate-900 font-mono">06:00</p>
//             </div>
//             <div className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border border-white shadow-lg text-center">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Distance</p>
//               <p className="text-3xl font-black text-slate-900 font-mono">2.3 km</p>
//             </div>
//           </div>

//           {/* Victim Data Fixed Card */}
//           <motion.div variants={glassVar} initial="initial" animate="animate" className="bg-white/70 backdrop-blur-2xl rounded-[2rem] border border-white p-6 shadow-xl relative overflow-hidden">
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center gap-2">
//                  <HeartPulse size={18} className="text-red-500" />
//                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Victim Data Feed</h3>
//               </div>
//               <div className="bg-red-50 px-2 py-1 rounded-lg border border-red-100 flex items-center gap-1">
//                  <Activity size={12} className="text-red-600" />
//                  <span className="text-[10px] font-black text-red-600 animate-pulse">{victimData?.bpm || "0"} BPM </span>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-4">
//               <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
//                 <User size={30} />
//               </div>
//               <div>
//                 <p className="text-base font-black text-slate-900 leading-none">Rohan Mehta, 34</p>
//                 <div className="flex gap-2 mt-2">
//                   <span className="text-[9px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full uppercase">Blood: O+</span>
//                   <span className="text-[9px] font-black text-slate-500 flex items-center gap-1 border border-slate-200 px-2 py-0.5 rounded-full tracking-tighter"><Phone size={10}/> +91 98201 44321</span>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4 bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-[11px] font-bold text-amber-800 leading-relaxed">
//                Note: Asthmatic. Inhaler in left pocket reported. Occupants trapped near stairwell B.
//             </div>

//             <button className="mt-4 w-full bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2">
//               <Navigation size={14}/> Launch Indoor Pathing
//             </button>
//           </motion.div>

//           {/* Evidence Glass Card */}
//           <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white p-5 shadow-lg">
//              <div className="flex items-center gap-2 mb-4">
//                 <Camera size={16} className="text-slate-400" />
//                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tactical Evidence</span>
//              </div>
//              <div className="grid grid-cols-2 gap-3">
//                 {[
//                   { img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=400", label: "SMOKE FROM WINDOW" },
//                   { img: "https://images.unsplash.com/photo-1574870111867-089730e5a72b?w=400", label: "BUILDING EXTERIOR" }
//                 ].map((e, i) => (
//                   <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-white group">
//                     <img src={e.img} className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" />
//                     <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 text-[8px] font-black text-white uppercase tracking-tighter">{e.label}</div>
//                   </div>
//                 ))}
//              </div>
//           </div>

//           {/* Action Glass Card */}
//           <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] border border-white p-5 shadow-2xl mt-auto">
//              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Dispatch Control Panel</p>
//              <button onClick={handleDispatch} className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all ${status === 'active' ? 'bg-red-600 text-white shadow-red-200 animate-pulse hover:bg-red-700' : 'bg-emerald-600 text-white shadow-emerald-100'}`}>
//                 {status === 'active' ? <><SirenIcon size={18}/> DISPATCH ENGINE 14</> : <><CheckCircle2 size={18}/> UNIT DISPATCHED</>}
//              </button>
//              <div className="grid grid-cols-2 gap-2 mt-2">
//                 <button className="bg-amber-50 text-amber-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-100 hover:bg-amber-100">Request Backup</button>
//                 <button className="bg-slate-100 text-slate-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-200">False Alarm</button>
//              </div>
//           </div>
//         </aside>
//       </main>
//     </div>
//   );
// };

// // Mock ZapOff for missing lucide icon in your local setup if any
// const ZapOff = ({ size, className }: any) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 2 20 20"/><path d="m12.5 6.5 3 3.5H22L11 22.5l-1-7.5-3.5-3"/><path d="M11.3 6.2 13 2.5 10 2.5 6.7 6.4"/></svg>
// );

// export default Emergency;

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { 
  AlertTriangle, Siren, CheckCircle2, Send, ShieldX, 
  Clock, Navigation, Camera, MapPin, Radio, Activity, 
  User, Phone, HeartPulse, Flame, ShieldAlert,
  Droplets, Sparkles, Share2, MessageSquare, Globe, Siren as SirenIcon,
  ChevronUp, ChevronDown
} from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader, TrafficLayer } from "@react-google-maps/api";
import { toast } from "sonner";
import { db } from "../config/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const glassVar: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const Emergency = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showTraffic, setShowTraffic] = useState(false);
  const [status, setStatus] = useState("active");
  const [incidentData, setIncidentData] = useState<any>(null);
  const [victimData, setVictimData] = useState<any>(null);
  const [currentPos, setCurrentPos] = useState({ lat: 18.9438, lng: 72.8231 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For Mobile Toggle

  useEffect(() => {
    const unsubIncident = onSnapshot(doc(db, "incidents", "CURRENT_INCIDENT_ID"), (doc) => {
      if (doc.exists()) setIncidentData(doc.data());
    });
    const unsubVictim = onSnapshot(doc(db, "victims", "VICTIM_ID"), (doc) => {
      if (doc.exists()) setVictimData(doc.data());
    });
    return () => { unsubIncident(); unsubVictim(); };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPos({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => toast.error("Location access denied."),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleDispatch = async () => {
    try {
      await fetch('http://localhost:5000/api/trigger-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId: "CURRENT_INCIDENT_ID", unit: "ENGINE 14" })
      });
      setStatus('dispatched');
      toast.success("Unit ENGINE 14 Dispatched");
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
      
      {/* 1. Header - Optimized for Mobile */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-red-200 bg-white/80 backdrop-blur-md px-4 lg:px-6 z-50">
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 lg:h-9 lg:w-9 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ShieldAlert size={18} fill="currentColor" />
            </div>
            <div className="hidden xs:block">
              <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-tighter text-slate-400">Sentinel</p>
              <p className="text-xs lg:text-sm font-black text-slate-900">Tactical</p>
            </div>
          </div>
          <div className="bg-slate-100 px-2 lg:px-3 py-1 rounded-lg border border-slate-200 flex items-center gap-1 lg:gap-2">
            <Radio size={12} className="text-red-500 animate-pulse" />
            <span className="font-mono text-[9px] lg:text-[11px] font-black tracking-widest text-slate-600">ENG-14</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4">
           <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 uppercase">Secure</span>
           </div>
           <div className="text-slate-400 font-mono text-xs lg:text-sm font-black border-l pl-3 lg:pl-4 border-slate-200 flex items-center gap-2">
             <Clock size={14}/> {time.split(' ')[0]}
           </div>
        </div>
      </header>

      {/* Main Content - Responsive Grid */}
      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_420px] overflow-hidden relative">
        
        {/* 2. Map Section - Takes full height on mobile until sidebar is pulled up */}
        <section className="relative flex-1 bg-slate-200 min-h-[40vh] lg:min-h-0">
          {!isLoaded ? (
            <div className="h-full w-full flex items-center justify-center bg-white">
                <MapPin size={30} className="text-red-600 animate-bounce" />
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={currentPos}
              zoom={17}
              options={{ disableDefaultUI: true }}
            >
              <Marker position={currentPos} icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
              {showTraffic && <TrafficLayer />}
            </GoogleMap>
          )}

          {/* Floating HUD - Compact for Mobile */}
          <div className="absolute top-4 left-4 right-4 lg:right-auto flex flex-col gap-2 pointer-events-none">
             <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl pointer-events-auto max-w-fit">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Target</p>
                <p className="font-mono text-[10px] font-black text-slate-800">
                    {incidentData?.lat?.toFixed(3)}, {incidentData?.lng?.toFixed(3)}
                </p>
                <div className="mt-1.5 bg-red-600 text-white px-2 py-0.5 rounded-lg flex items-center gap-1.5 animate-pulse">
                   <ShieldAlert size={10}/> <span className="text-[9px] font-black uppercase tracking-tight">Floor 7</span>
                </div>
             </div>
             <button 
                onClick={() => setShowTraffic(!showTraffic)} 
                className={`pointer-events-auto w-fit px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 border transition-all ${showTraffic ? 'bg-blue-600 text-white border-blue-400' : 'bg-white text-slate-600 border-slate-200'}`}
             >
                <Globe size={12}/> Traffic {showTraffic ? 'ON' : 'OFF'}
             </button>
          </div>

          {/* Quick Contact Tray - Hidden on Mobile to save space, or icons only */}
          <div className="absolute bottom-6 left-4 right-4 flex justify-between lg:justify-start lg:right-auto gap-2">
             {['POLICE', 'HOSPITAL', 'FIRE'].map((label, i) => (
                <button key={label} className="bg-white/90 backdrop-blur-md px-3 lg:px-4 py-2 lg:py-3 rounded-xl lg:rounded-2xl border border-slate-200 shadow-xl flex items-center gap-2 flex-1 lg:flex-none justify-center">
                  <div className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-emerald-500' : 'bg-red-600'}`} />
                  <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest">{label}</span>
                </button>
             ))}
          </div>

          {/* MOBILE TOGGLE HANDLE */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white border border-slate-200 px-6 py-2 rounded-t-2xl shadow-2xl z-40 flex flex-col items-center gap-1"
          >
            <div className="w-8 h-1 bg-slate-300 rounded-full" />
            <span className="text-[8px] font-black uppercase text-slate-500 tracking-tighter">
                {isSidebarOpen ? 'Close Intel' : 'Open Tactical Intel'}
            </span>
          </button>
        </section>

        {/* 3. Right Sidebar - Glass Panels */}
        <aside className={`
          fixed inset-0 top-16 z-30 transform transition-transform duration-500 lg:relative lg:top-0 lg:translate-y-0 lg:z-auto
          ${isSidebarOpen ? 'translate-y-0' : 'translate-y-full'}
          bg-red-50 lg:bg-red-100/20 backdrop-blur-md lg:backdrop-blur-sm 
          overflow-y-auto p-4 lg:p-5 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-red-200 shadow-inner
        `}>
          
          {/* Close button for Mobile inside sidebar */}
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden self-center mb-2">
             <ChevronDown className="text-slate-400" />
          </button>

          {/* Incident Glass Card */}
          <motion.div variants={glassVar} initial="initial" animate="animate" className="bg-white/80 lg:bg-white/60 backdrop-blur-xl rounded-[1.5rem] lg:rounded-[2rem] border border-white p-4 lg:p-6 shadow-xl">
            <div className="flex justify-between items-start mb-3 lg:mb-4">
              <div className="flex items-center gap-2 bg-red-600 text-white px-2 py-0.5 rounded-full">
                <Flame size={12} className="animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-tighter">Critical - Electrical</span>
              </div>
              <span className="text-[8px] font-black text-slate-400 uppercase">3M AGO</span>
            </div>
            <h2 className="text-base lg:text-lg font-black text-slate-900 leading-tight mb-3 lg:mb-4">
                {incidentData?.description || "Awaiting live feed..."}
            </h2>
            
            <div className="grid grid-cols-2 gap-2 mb-3 lg:mb-4">
              <div className="bg-red-50 p-2 lg:p-3 rounded-xl lg:rounded-2xl border border-red-100 flex items-center gap-2">
                <ZapOff size={16} className="text-red-600" />
                <div><p className="text-[7px] font-black text-red-400 uppercase leading-none">Power</p><p className="text-[9px] font-black text-red-700 uppercase">Offline</p></div>
              </div>
              <div className="bg-emerald-50 p-2 lg:p-3 rounded-xl lg:rounded-2xl border border-emerald-100 flex items-center gap-2">
                <Droplets size={16} className="text-emerald-600" />
                <div><p className="text-[7px] font-black text-emerald-400 uppercase leading-none">Gas</p><p className="text-[9px] font-black text-emerald-700 uppercase">Isolated</p></div>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white/40 p-3 rounded-xl border border-white">
              <MapPin size={16} className="text-red-600 shrink-0" />
              <p className="text-[10px] font-bold text-slate-600 leading-snug">Tower B, Marine Heights, Mumbai</p>
            </div>
          </motion.div>

          {/* ETA Glass Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/70 backdrop-blur-xl p-3 lg:p-5 rounded-2xl lg:rounded-3xl border border-white shadow-lg text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">ETA</p>
              <p className="text-2xl lg:text-3xl font-black text-slate-900 font-mono">06:00</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl p-3 lg:p-5 rounded-2xl lg:rounded-3xl border border-white shadow-lg text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Dist</p>
              <p className="text-2xl lg:text-3xl font-black text-slate-900 font-mono">2.3km</p>
            </div>
          </div>

          {/* Victim Data Fixed Card */}
          <motion.div variants={glassVar} initial="initial" animate="animate" className="bg-white/80 backdrop-blur-2xl rounded-[1.5rem] lg:rounded-[2rem] border border-white p-4 lg:p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                 <HeartPulse size={16} className="text-red-500" />
                 <h3 className="text-[9px] font-black uppercase text-slate-500">Victim Feed</h3>
              </div>
              <div className="bg-red-50 px-2 py-1 rounded-lg border border-red-100 flex items-center gap-1">
                 <Activity size={10} className="text-red-600" />
                 <span className="text-[10px] font-black text-red-600 animate-pulse">{victimData?.bpm || "72"} BPM </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="h-10 w-10 lg:h-14 lg:w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                <User className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div>
                <p className="text-sm lg:text-base font-black text-slate-900 leading-none">Rohan Mehta, 34</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[8px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded-full uppercase">O+</span>
                  <span className="text-[8px] font-black text-slate-500 flex items-center gap-1 border border-slate-200 px-1.5 py-0.5 rounded-full tracking-tighter"><Phone size={8}/> 98201 44321</span>
                </div>
              </div>
            </div>

            <div className="mt-3 bg-amber-50/50 border border-amber-100 rounded-xl p-2.5 text-[10px] font-bold text-amber-800">
               Asthmatic. Inhaler in left pocket. Trapped near stairwell B.
            </div>

            <button className="mt-3 w-full bg-slate-900 text-white py-2.5 rounded-xl lg:rounded-2xl text-[9px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2">
              <Navigation size={12}/> Launch Indoor Path
            </button>
          </motion.div>

          {/* Evidence Glass Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-[2rem] border border-white p-4 shadow-lg mb-20 lg:mb-0">
             <div className="flex items-center gap-2 mb-3">
                <Camera size={14} className="text-slate-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tactical Evidence</span>
             </div>
             <div className="grid grid-cols-2 gap-2 lg:gap-3">
                {[
                  { img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=400", label: "SMOKE" },
                  { img: "https://images.unsplash.com/photo-1574870111867-089730e5a72b?w=400", label: "EXTERIOR" }
                ].map((e, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-white group">
                    <img src={e.img} className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" />
                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/60 text-[7px] font-black text-white uppercase">{e.label}</div>
                  </div>
                ))}
             </div>
          </div>

          {/* Action Glass Card - Fixed at bottom on mobile inside sidebar */}
          <div className="sticky bottom-0 left-0 right-0 lg:relative lg:mt-auto bg-white lg:bg-white/80 backdrop-blur-2xl rounded-t-3xl lg:rounded-[2rem] border-t lg:border border-red-200 lg:border-white p-4 lg:p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] lg:shadow-2xl z-50">
             <button onClick={handleDispatch} className={`w-full py-3 lg:py-4 rounded-xl lg:rounded-2xl text-[10px] lg:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all ${status === 'active' ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 text-white'}`}>
                {status === 'active' ? <><SirenIcon size={16}/> DISPATCH ENG-14</> : <><CheckCircle2 size={16}/> DISPATCHED</>}
             </button>
             <div className="grid grid-cols-2 gap-2 mt-2">
                <button className="bg-amber-50 text-amber-600 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest border border-amber-100">Backup</button>
                <button className="bg-slate-100 text-slate-600 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest border border-slate-200">False Alarm</button>
             </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

// Mock ZapOff
const ZapOff = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 2 20 20"/><path d="m12.5 6.5 3 3.5H22L11 22.5l-1-7.5-3.5-3"/><path d="M11.3 6.2 13 2.5 10 2.5 6.7 6.4"/></svg>
);

export default Emergency;