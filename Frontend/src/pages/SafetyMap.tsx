import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect} from "react";
import { Icon } from "../components/Icon";
import { BottomNav } from "../components/BottomNav";
import { useI18n } from "../i18n/I18nProvider";
import { auth, db } from "../config/firebase"; // Aapka path alag ho sakta hai
import { collection, query, orderBy, onSnapshot, updateDoc, serverTimestamp, doc } from "firebase/firestore";
import { toast } from "sonner";
interface Alert {
  id: string;
  type: string;
  message: string;
  timestamp?: any;
  // agar koi aur fields hain toh wo bhi yahan likh sakte hain
}


const layers = [
  { icon: "exit_to_app", labelKey: "safetymap.layer.exits", count: 6, color: "text-secondary bg-secondary/15" },
  { icon: "fire_extinguisher", labelKey: "safetymap.layer.extinguishers", count: 14, color: "text-primary bg-primary/10" },
  { icon: "medical_services", labelKey: "safetymap.layer.firstAid", count: 8, color: "text-warning bg-warning/15" },
  { icon: "stairs", labelKey: "safetymap.layer.stairwells", count: 4, color: "text-foreground bg-muted" },
];

type Room = { id: string; x: number; y: number; w: number; h: number; name: string };
const rooms: Room[] = [
  { id: "401", x: 30, y: 30, w: 120, h: 70, name: "401" },
  { id: "402", x: 30, y: 105, w: 120, h: 85, name: "402" },
  { id: "403", x: 30, y: 210, w: 120, h: 75, name: "403" },
  { id: "404", x: 30, y: 290, w: 120, h: 80, name: "404" },
  { id: "lounge", x: 170, y: 30, w: 120, h: 160, name: "Lounge" },
  { id: "gym", x: 170, y: 210, w: 120, h: 160, name: "Gym" },
];

// Use this inside useEffect when a new alert is detected

const SafetyMap = () => {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>("402");
  // Mock: admin marked north corridor blocked
  const selRoom = rooms.find((r) => r.id === selected);
  const [blocked, setBlocked] = useState<string[]>([]);
const [lastAlertId, setLastAlertId] = useState<string | null>(null);
const [activeLayer, setActiveLayer] = useState<string | null>(null);


// Corridors (id, svg path, length-ish label)
const corridors = [
  { id: "c-north", d: "M 30 200 L 290 200", label: "North corridor" },
  { id: "c-mid", d: "M 160 30 L 160 370", label: "Central corridor" },
];
const [alerts, setAlerts] = useState<Alert[]>([]);
// useEffect(() => {
//   // 'alerts' collection ko real-time listen karein
//   const q = query(collection(db, "alerts"), orderBy("timestamp", "desc"));
//   const unsub = onSnapshot(q, (snapshot) => {
//     const alertsData = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     } as Alert));
//     setAlerts(alertsData);
//   });
//   return () => unsub();
// }, []);

const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Purani voice roko
      const msg = new SpeechSynthesisUtterance(text);
      msg.rate = 0.9; // Thoda slow aur clear
      window.speechSynthesis.speak(msg);
    }
  };
// Use this inside useEffect when a new alert is detected

// useEffect(() => {
//     const q = query(collection(db, "alerts"), orderBy("timestamp", "desc"));
//     const unsub = onSnapshot(q, (snapshot) => {
//       const alertsData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       } as Alert));
//       setAlerts(alertsData);

//       // Agar naya critical alert aaya hai, toh usey bolo
//       if (alertsData.length > 0 && alertsData[0].id !== lastAlertId) {
//         if (alertsData[0].type === "critical") {
//           speak(`Attention! ${alertsData[0].message}`);
//         }
//         setLastAlertId(alertsData[0].id);
//       }
//     });
//     return () => unsub();
//   }, [lastAlertId]);

  useEffect(() => {
  const unsub = onSnapshot(collection(db, "building_map"), (snapshot) => {
    // Check karein kaunse corridors blocked hain
    const blockedIds = snapshot.docs
      .filter(doc => doc.data().status === "blocked")
      .map(doc => doc.id);
    setBlocked(blockedIds);
  });
  return () => unsub();
}, []);

// Dono purane alerts wale useEffect delete karke ye ek rakhiye:
useEffect(() => {
    const q = query(collection(db, "alerts"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Alert));
      
      setAlerts(alertsData);

      // Voice logic
      if (alertsData.length > 0 && alertsData[0].id !== lastAlertId) {
        if (alertsData[0].type === "critical") {
          speak(`Attention! ${alertsData[0].message}`);
        }
        setLastAlertId(alertsData[0].id);
      }
    });
    return () => unsub();
}, [lastAlertId]); // Sirf lastAlertId change hone par check karega

const handleConfirmLocation = async () => {
  if (!selected) return;
  const user = auth.currentUser;
  if (user) {
    await updateDoc(doc(db, "users", user.uid), {
      roomNumber: selected,
      lastUpdated: serverTimestamp()
    });
    toast.success("Location confirmed!"); // Staff dashboard par turant dikhega
  }
};


  return (
    <div className="relative min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-2xl px-5 pt-12">
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("safetymap.venueSafety")}</p>
            <h1 className="text-2xl font-black">{t("safetymap.floorTitle", { venue: "Marlowe Grand", floor: 4 })}</h1>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t("safetymap.pathBlocked", { count: blocked.length })}
          </div>
        </motion.header>
        {/* Map container ke theek upar ye add karein */}
{alerts.length > 0 && (
  <motion.div 
    initial={{ height: 0 }} animate={{ height: 'auto' }}
    className={`mb-4 overflow-hidden rounded-2xl p-4 ${alerts[0].type === 'critical' ? 'bg-red-500 text-white' : 'bg-amber-100 text-amber-900'}`}
  >
    <div className="flex items-center gap-3">
      <Icon name={alerts[0].type === 'critical' ? 'emergency' : 'warning'} filled />
      <p className="text-sm font-black">{alerts[0].message}</p>
    </div>
  </motion.div>
)}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mt-5 aspect-[4/5] overflow-hidden rounded-3xl bg-card shadow-card"
        >
          <svg viewBox="0 0 320 400" className="h-full w-full">
            <defs>
              <pattern id="g3" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="hsl(0 0% 0% / 0.05)" />
              </pattern>
            </defs>
            <rect width="320" height="400" fill="url(#g3)" />

            {/* Rooms (tappable) */}
            {rooms.map((r) => {
              const isSel = selected === r.id;
              return (
                <g key={r.id} onClick={() => setSelected(r.id)} style={{ cursor: "pointer" }}>
                  <rect
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    rx="6"
                    fill={isSel ? "hsl(217 90% 60% / 0.18)" : "hsl(0 0% 100%)"}
                    stroke={isSel ? "hsl(217 90% 60%)" : "hsl(0 0% 75%)"}
                    strokeWidth={isSel ? 3 : 2}
                  />
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="hsl(0 0% 35%)"
                  >
                    {r.name}
                  </text>
                </g>
              );
            })}

            {/* Corridors */}
            {corridors.map((c) => {
              const isBlocked = blocked.includes(c.id);
              return (
                <g key={c.id}>
                  <path
                    d={c.d}
                    stroke={isBlocked ? "hsl(0 75% 55%)" : "hsl(122 45% 50%)"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={isBlocked ? "10 6" : "0"}
                    opacity={isBlocked ? 0.9 : 0.45}
                    fill="none"
                  />
                  {isBlocked && (
                    <text
                      x={c.id === "c-north" ? 160 : 170}
                      y={c.id === "c-north" ? 192 : 22}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="800"
                      fill="hsl(0 75% 45%)"
                    >
                      ⚠ {t("safetymap.blocked")}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Safety markers */}
            {/* <g>
              <circle cx="60" cy="60" r="11" fill="hsl(var(--secondary))" />
              <text x="60" y="63" textAnchor="middle" fill="white" fontSize="8" fontWeight="800">{t("safetymap.exit")}</text>
              <circle cx="270" cy="60" r="11" fill="hsl(var(--secondary))" />
              <text x="270" y="63" textAnchor="middle" fill="white" fontSize="8" fontWeight="800">{t("safetymap.exit")}</text>
              <circle cx="100" cy="170" r="8" fill="hsl(var(--primary))" />
              <circle cx="220" cy="120" r="8" fill="hsl(var(--primary))" />
              <circle cx="220" cy="280" r="8" fill="hsl(var(--warning))" />
              <circle cx="100" cy="320" r="8" fill="hsl(var(--warning))" />
              <circle cx="60" cy="370" r="11" fill="hsl(var(--secondary))" />
              <text x="60" y="373" textAnchor="middle" fill="white" fontSize="8" fontWeight="800">{t("safetymap.exit")}</text>

            </g> */}
            {/* Safety markers inside SVG */}
<g>
  {/* EXITS: Dikhayein agar Exit layer active ho ya koi layer select na ho */}
  {(activeLayer === "exit_to_app" || !activeLayer) && (
    <g>
      <circle cx="60" cy="60" r="11" fill="hsl(var(--secondary))" />
      <text x="60" y="63" textAnchor="middle" fill="white" fontSize="8" fontWeight="800">EXIT</text>
      <circle cx="270" cy="60" r="11" fill="hsl(var(--secondary))" />
      <text x="270" y="63" textAnchor="middle" fill="white" fontSize="8" fontWeight="800">EXIT</text>
    </g>
  )}

  {/* EXTINGUISHERS: Sirf tab dikhayein jab Fire Extinguisher layer active ho */}
  {(activeLayer === "fire_extinguisher" || !activeLayer) && (
    <>
      <circle cx="100" cy="170" r="8" fill="hsl(var(--primary))" className="animate-pulse" />
      <circle cx="220" cy="120" r="8" fill="hsl(var(--primary))" className="animate-pulse" />
    </>
  )}

  {/* FIRST AID: Sirf tab dikhayein jab Medical layer active ho */}
  {(activeLayer === "medical_services" || !activeLayer) && (
    <>
      <circle cx="220" cy="280" r="8" fill="hsl(var(--warning))" />
      <circle cx="100" cy="320" r="8" fill="hsl(var(--warning))" />
    </>
  )}
</g>
            {/* Safety markers inside SVG */}
{/* {(activeLayer === "exit_to_app" || !activeLayer) && (
  <g>
    <circle cx="60" cy="60" r="11" fill="hsl(var(--secondary))" />
    <text x="60" y="63" textAnchor="middle" fill="white" fontSize="8" fontWeight="800">EXIT</text>
  </g>
)} */}

            {/* "I am here" pin */}
            {selRoom && (
              <g>
                <motion.circle
                  cx={selRoom.x + selRoom.w / 2}
                  cy={selRoom.y + selRoom.h / 2 - 16}
                  r="18"
                  fill="hsl(217 90% 60% / 0.25)"
                  animate={{ r: [14, 22, 14] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                <circle
                  cx={selRoom.x + selRoom.w / 2}
                  cy={selRoom.y + selRoom.h / 2 - 16}
                  r="7"
                  fill="hsl(217 90% 60%)"
                  stroke="white"
                  strokeWidth="3"
                />
              </g>
            )}
          </svg>

          <p className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-card">
            {t("safetymap.tapRoom")}
          </p>
        </motion.div>

        {/* Selected room confirmation */}
        <AnimatePresence mode="wait">
          {selRoom && (
            <motion.div
              key={selRoom.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 flex items-center justify-between rounded-2xl bg-card p-4 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                  <Icon name="my_location" filled />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("safetymap.youMarked")}</p>
                  <p className="text-base font-extrabold">{t("safetymap.room", { room: selRoom.name })}</p>
                </div>
              </div>
              <button className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground">
                {t("common.confirm")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {layers.map((l, i) => (
            <motion.button
              onClick={() => setActiveLayer(activeLayer === l.icon ? null : l.icon)}
  className={`flex items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-card transition-all ${
    activeLayer === l.icon ? 'ring-2 ring-primary bg-primary/5 scale-[1.02]' : 'opacity-80'
  }`}
              key={l.labelKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              // className="flex items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-card"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${l.color}`}>
                <Icon name={l.icon} filled />
              </div>
              <div>
                <p className="font-bold leading-tight">{t(l.labelKey)}</p>
                <p className="text-xs text-muted-foreground">{t("safetymap.onThisFloor", { count: l.count })}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default SafetyMap;
