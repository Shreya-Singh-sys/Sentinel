import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, Siren, CheckCircle2, Send, ShieldX, 
  Clock, Navigation, Camera, MapPin, Radio, Wifi, 
  Activity, Key, User, Phone, Droplet, HeartPulse,
  Flame, Zap, Wind, ShieldAlert
} from "lucide-react";
import { GoogleMap, Marker, OverlayView, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { toast } from "sonner";
import { useI18n } from "../i18n/I18nProvider";

// --- Types & Mock Data ---
type IncidentStatus = "active" | "dispatched" | "resolved" | "false_alarm";

const MOCK_INCIDENT = {
  id: "INC-2148",
  code: "FIRE-A2",
  type: "Electrical",
  severity: "Critical",
  reportedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  status: "active" as IncidentStatus,
  address: "Tower B, Marine Heights, Marine Drive, Mumbai 400002",
  location: { lat: 18.9438, lng: 72.8231 },
  unit: { lat: 18.9512, lng: 72.8347, label: "Engine 14" },
  etaMinutes: 6,
  distanceKm: 2.3,
  victim: {
    name: "Rohan Mehta",
    age: 34,
    bloodGroup: "O+",
    phone: "+91 98201 44321",
    medicalNotes: "Asthmatic. Inhaler in left pocket reported.",
  },
  description: "Heavy smoke from 7th floor electrical panel. 2 occupants trapped near stairwell B. No sprinklers active.",
  evidence: [
    { id: "ev1", url: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=70", caption: "Smoke from window" },
    { id: "ev2", url: "https://images.unsplash.com/photo-1574870111867-089730e5a72b?w=600&q=70", caption: "Building exterior" },
  ],
};

// --- Sub-Components ---

const ActionPanel = ({ status, onDispatch, onBackup, onFalseAlarm, onResolve }: any) => {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("emergency.tacticalActions")}</p>
      <div className="mt-3 grid gap-2">
        {status === "active" && (
          <button onClick={onDispatch} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-4 text-sm font-black uppercase text-white shadow-lg shadow-red-100 animate-pulse">
            <Siren size={18} /> {t("emergency.dispatchUnit", { unit: "Engine 14" })}
          </button>
        )}
        {status === "dispatched" && (
          <button onClick={onResolve} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-sm font-black uppercase text-white shadow-lg shadow-emerald-100">
            <CheckCircle2 size={18} /> {t("emergency.markResolved")}
          </button>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onBackup} className="flex items-center justify-center gap-2 rounded-xl bg-amber-50 py-3 text-[10px] font-black uppercase text-amber-600 border border-amber-100">
            <Send size={14} /> {t("emergency.requestBackup")}
          </button>
          <button onClick={onFalseAlarm} className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-[10px] font-black uppercase text-slate-600 border border-slate-100">
            <ShieldX size={14} /> {t("emergency.falseAlarm")}
          </button>
        </div>
      </div>
    </div>
  );
};

const VictimCard = ({ victim }: any) => {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <HeartPulse size={16} className="text-red-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("emergency.victimInfo")}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><User size={24} /></div>
        <div className="flex-1">
          <p className="text-sm font-black text-slate-900">{victim.name}, {victim.age}</p>
          <div className="flex gap-3 mt-1">
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase">{t("emergency.blood", { group: victim.bloodGroup })}</span>
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Phone size={10} /> {victim.phone}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-2 text-[11px] font-bold text-amber-700">
        {t("emergency.note", { note: victim.medicalNotes })}
      </div>
    </div>
  );
};

// --- Main Emergency Page ---
const Emergency = () => {
  const { t } = useI18n();
  const [incident, setIncident] = useState(MOCK_INCIDENT);
  const [mapKey, setMapKey] = useState<string | null>(localStorage.getItem("sentinel.gmaps.key"));
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: mapKey || "",
    id: "sentinel-map"
  });

  const handleDispatch = () => {
    setIncident(prev => ({ ...prev, status: "dispatched" }));
    toast.success(t("emergency.toast.unitsDispatched"), { description: t("emergency.toast.unitEnRoute", { unit: "Engine 14" }) });
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50 overflow-hidden font-sans antialiased">
      {/* Top Bar (Sentinel Light Theme) */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-100">
              <AlertTriangle className="text-white" size={20} />
            </div>
            <div>
              <p className="text-sm font-black tracking-tighter">{t("app.name")}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{t("emergency.dispatchConsole")}</p>
            </div>
          </div>
          <div className="ml-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 border border-slate-100">
            <Radio size={14} className="text-red-500" />
            <span className="font-mono text-[11px] font-black text-slate-700 uppercase">{incident.unit.label} · {incident.code}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-100">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase">{t("emergency.liveConnection")}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-mono text-sm font-black border-l pl-4 border-slate-200">
             <Activity size={16} /> {time}
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] overflow-hidden">
        {/* Map Section */}
        <section className="relative bg-slate-200">
          {!isLoaded ? (
            <div className="h-full w-full flex flex-col items-center justify-center bg-white">
               <MapPin size={48} className="text-slate-300 animate-bounce" />
               <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">{t("emergency.loadingMap")}</p>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={incident.location}
              zoom={15}
              options={{ disableDefaultUI: true, styles: [] }} // Empty styles for light theme
            >
              <Marker position={incident.location} label="🔥" />
              <Marker position={incident.unit} label="🚒" />
            </GoogleMap>
          )}
          {/* Floating HUD */}
          <div className="absolute top-6 left-6 p-4 bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-xl">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("emergency.targetCoordinates")}</p>
             <p className="mt-1 font-mono text-xs font-black text-slate-800">{incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}</p>
          </div>
        </section>

        {/* Sidebar Controls */}
        <aside className="overflow-y-auto bg-slate-50 p-5 flex flex-col gap-5 border-l border-slate-200 shadow-inner">
          
          {/* Incident Details Card */}
          <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm ring-1 ring-red-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-red-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-red-600 tracking-widest">{incident.severity} · {incident.type}</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase">{t("emergency.reportedAgo", { mins: 3 })}</span>
            </div>
            <h2 className="text-base font-black text-slate-900 leading-tight">{incident.description}</h2>
            <div className="mt-4 flex items-start gap-2 bg-white/60 p-3 rounded-xl border border-red-100">
              <MapPin size={16} className="text-red-500 shrink-0" />
              <p className="text-xs font-bold text-slate-600">{incident.address}</p>
            </div>
          </div>

          {/* ETA & Distance */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("emergency.eta")}</p>
              <p className="mt-1 text-2xl font-black text-slate-900 font-mono">0{incident.etaMinutes}:00</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("emergency.distance")}</p>
              <p className="mt-1 text-2xl font-black text-slate-900 font-mono">{incident.distanceKm} km</p>
            </div>
          </div>

          <VictimCard victim={incident.victim} />

          {/* Evidence Grid */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-2 mb-3">
               <Camera size={16} className="text-slate-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("emergency.sceneEvidence")}</span>
             </div>
             <div className="grid grid-cols-2 gap-2">
                {incident.evidence.map(e => (
                  <div key={e.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                    <img src={e.url} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-[8px] font-bold text-white uppercase">{e.caption}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <ActionPanel 
            status={incident.status} 
            onDispatch={handleDispatch}
            onResolve={() => setIncident(prev => ({ ...prev, status: "resolved" }))}
          />
        </aside>
      </main>
    </div>
  );
};

export default Emergency;