import React, { useState } from 'react';
import { BottomNav} from '../components/BottomNav';
import { useEffect } from 'react';
import { db, auth } from "../config/firebase";
import { doc, onSnapshot, updateDoc, setDoc, collection, query, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Icon } from "../components/Icon";


const SafetyMap: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<'401' | '402' | 'lounge' | 'gym'>('402');
  const [confirmed, setConfirmed] = useState(false);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [liveUsers, setLiveUsers] = useState<any[]>([]);
  const [blockedCorridors, setBlockedCorridors] = useState<string[]>([]);
  const isPathBlocked = selectedRoom === '402' && blockedCorridors.includes('north-corridor');
  const [heading, setHeading] = useState(0);

  const roomData = {
    '401': { label: 'Room 401', emoji: '🛏' },
    '402': { label: 'Room 402', emoji: '🛏' },
    'lounge': { label: 'Lounge', emoji: '🛋' },
    'gym': { label: 'Gym', emoji: '💪' },
  };
  const mapMarkers = {
  exits: [
    { x: 35, y: 65, label: 'EXIT' },
    { x: 440, y: 65, label: 'EXIT' },
    { x: 201, y: 60, label: 'EXIT' },
    { x: 35, y: 410, label: 'EXIT' },
    { x: 440, y: 410, label: 'EXIT' },
    { x: 201, y: 415, label: 'EXIT' },
  ],
  fire: [
    { x: 180, y: 150 }, { x: 230, y: 150 },
    { x: 180, y: 350 }, { x: 230, y: 350 },
    { x: 50, y: 120 }, { x: 400, y: 300 },
    // Aap aise hi 14 markers add kar sakte hain
  ],
  firstaid: [
    { x: 201, y: 240 }, { x: 333, y: 190 }, { x: 100, y: 380 }
  ],
  stairs: [
    { x: 190, y: 100 }, { x: 215, y: 100 },
    { x: 190, y: 380 }, { x: 215, y: 380 }
  ]
};

  const evacPaths = {
    '401': 'M 106 142 L 201 142 L 201 90 L 440 90',
    '402': 'M 155 290 L 201 290 L 201 193 L 333 193',
    'lounge': 'M 420 150 L 452 150',
    'gym': 'M 420 340 L 452 340',
  };
  useEffect(() => {
  localStorage.setItem("userRole", "guest"); // Dashboard ke hisab se change karein
}, []);
  
  useEffect(() => {
  const q = query(collection(db, "users"));
  const unsub = onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLiveUsers(users);
  });
  return () => unsub();
}, []);

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]);
  };

  const handleConfirm = async () => {
  const user = auth.currentUser;
  if (!user) {
    toast.error("Please login first");
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      room: selectedRoom,
      roomNumber: selectedRoom,
      lastUpdated: serverTimestamp()
    });
    setConfirmed(true);
    toast.success("Location updated in Command Center!");
    setTimeout(() => setConfirmed(false), 2000);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update location");
  }
};
  useEffect(() => {
  const unsub = onSnapshot(collection(db, "building_map"), (snapshot) => {
    const blocked = snapshot.docs
      .filter(doc => doc.data().status === "blocked")
      .map(doc => doc.id);
    setBlockedCorridors(blocked);
  });
  return () => unsub();
}, []);
   
//   useEffect(() => {
//   const handleOrientation = (e: DeviceOrientationEvent) => {
//     // webkitCompassHeading iOS ke liye hota hai, alpha Android ke liye
//     const compassHeading = (e as any).webkitCompassHeading || (360 - (e.alpha || 0));
//     if (compassHeading) {
//       setHeading(compassHeading);
//     }
//   };

//   // Permission maangna zaroori hai iOS ke liye
//   if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
//     (DeviceOrientationEvent as any).requestPermission()
//       .then((permissionState: string) => {
//         if (permissionState === 'granted') {
//           window.addEventListener('deviceorientation', handleOrientation);
//         }
//       });
//   } else {
//     window.addEventListener('deviceorientation', handleOrientation);
//   }

//   return () => window.removeEventListener('deviceorientation', handleOrientation);
// }, []);
  // Is useEffect ko update karein
  const handleOrientation = (e: DeviceOrientationEvent) => {
    const compassHeading = (e as any).webkitCompassHeading || (360 - (e.alpha || 0));
    if (compassHeading !== null) {
      setHeading(compassHeading);
    }
  };

  // ✅ 2. startCompass function (JSX se call ho sakega)
  const startCompass = () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((state: string) => {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            toast.success("Compass Calibrated!");
          }
        }).catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
      toast.info("Compass started");
    }
  };

  useEffect(() => {
    localStorage.setItem("userRole", "guest");
    
    // Auto-listen users
    const q = query(collection(db, "users"));
    const unsubUsers = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLiveUsers(users);
    });

    // Auto-listen blocked corridors
    const unsubMap = onSnapshot(collection(db, "building_map"), (snapshot) => {
      const blocked = snapshot.docs
        .filter(doc => doc.data().status === "blocked")
        .map(doc => doc.id);
      setBlockedCorridors(blocked);
    });

    return () => {
      unsubUsers();
      unsubMap();
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ backgroundColor: '#0f1117', color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif", paddingBottom: '100px' }}>
      <div className="w-full max-w-[480px] p-5 pb-10">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#8b8fa8]">Venue Safety</p>
            <h1 className="text-[22px] font-bold mt-0.5">Marlowe Grand · Floor 4</h1>
          </div>
          <div className="flex items-center gap-[5px] bg-[rgba(248,113,113,0.15)] text-[#f87171] border border-[rgba(248,113,113,0.3)] rounded-[20px] px-3 py-1 text-[10px] font-bold">
            <span className="weight-1.5 height-1.5 rounded-full bg-[#f87171] animate-pulse h-1.5 w-1.5"></span>
            {blockedCorridors.length} path blocked
          </div>
        </div>

        {/* ALERT */}
        <div className="bg-gradient-to-br from-[#7f1d1d] to-[#991b1b] border border-[rgba(248,113,113,0.4)] rounded-2xl p-3 flex items-center gap-3 mb-3.5 animate-bounce-short">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-base shrink-0 animate-pulse">🚨</div>
          <div>
            <div className="text-[9px] font-bold tracking-widest uppercase opacity-75">Live Alert</div>
            <div className="text-[13px] font-bold mt-0.5">"Fire detected in North Wing. Evacuate!"</div>
          </div>
        </div>
        <button 
  onClick={startCompass}
  className="absolute top-3 right-3.5 z-10 bg-white/10 p-1.5 rounded-full"
>
  <Icon name="explore" className="text-white text-xs" />
</button> 
        {/* MAP CARD */}
        <div className="bg-[#1a1d27] border border-white/10 rounded-[20px] overflow-hidden relative mb-3.5">
          <div className="absolute top-3 left-3.5 z-10 bg-[#0f1123]/80 backdrop-blur-md border border-white/10 rounded-[20px] px-3 py-1 text-[9px] font-bold tracking-tight uppercase text-[#8b8fa8]">
            Tap a room to mark "I am here"
          </div>

          <svg viewBox="0 0 500 520" xmlns="http://www.w3.org/2000/svg" className="block w-full">
            <defs>
              <filter id="wshadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.5"/>
              </filter>
              
              <marker id="earrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M1 1L9 5L1 9" fill="none" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round"/>
              </marker>

              <pattern id="tile401" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="16" height="16" fill="#1a2e4a"/>
                <rect x="0" y="0" width="8" height="8" fill="#1e3356" opacity="0.6"/>
                <rect x="8" y="8" width="8" height="8" fill="#1e3356" opacity="0.6"/>
              </pattern>
              <pattern id="tile402" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="16" height="16" fill="#162840"/>
                <rect x="0" y="0" width="8" height="8" fill="#1a3050" opacity="0.7"/>
                <rect x="8" y="8" width="8" height="8" fill="#1a3050" opacity="0.7"/>
              </pattern>
              <pattern id="tileLounge" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="#2d1f12"/>
                <line x1="0" y1="0" x2="20" y2="0" stroke="#3d2b1a" strokeWidth="1"/>
                <line x1="0" y1="0" x2="0" y2="20" stroke="#3d2b1a" strokeWidth="1"/>
              </pattern>
              <pattern id="tileGym" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="#122a1c"/>
                <line x1="0" y1="0" x2="20" y2="0" stroke="#1a3d28" strokeWidth="1"/>
                <line x1="0" y1="0" x2="0" y2="20" stroke="#1a3d28" strokeWidth="1"/>
              </pattern>
            </defs>

            {/* BUILDING SHELL */}
            <rect x="24" y="56" width="432" height="374" rx="4" fill="#000" opacity="0.5" filter="url(#wshadow)"/>
            <rect x="20" y="52" width="432" height="374" rx="4" fill="#2e3140" stroke="#444860" strokeWidth="2"/>

            {/* CORRIDORS */}
            <rect x="190" y="52" width="22" height="374" fill="#252836"/>
            <line x1="190" y1="52" x2="190" y2="426" stroke="#3a3d50" strokeWidth="1"/>
            <line x1="212" y1="52" x2="212" y2="426" stroke="#3a3d50" strokeWidth="1"/>
            <line x1="201" y1="80" x2="201" y2="400" stroke="#3a3d50" strokeWidth="0.5" strokeDasharray="6 8" opacity="0.5"/>
            <rect x="20" y="230" width="170" height="14" fill="#252836"/>
            <rect x="212" y="248" width="240" height="14" fill="#252836"/>

            {/* ROOM 401 */}
            <g onClick={() => setSelectedRoom('401')} className="cursor-pointer">
              <rect x="22" y="54" width="168" height="176" fill="url(#tile401)"/>
              <rect x="22" y="228" width="168" height="10" fill="#111824"/>
              <rect x="188" y="54" width="10" height="176" fill="#152338"/>
              {selectedRoom === '401' && (
                <rect x="22" y="54" width="168" height="176" fill="none" stroke="#4f8ef7" strokeWidth="2.5" opacity="0.8"/>
              )}
              {/* Furniture 401 */}
              <g transform="translate(35, 75)">
                <rect width="80" height="120" rx="4" fill="#1a4a6b" stroke="#2a6a9b" strokeWidth="1.5"/>
                <rect x="4" y="20" width="72" height="92" rx="3" fill="#f5f0e8" opacity="0.9"/>
                <rect x="8" y="24" width="28" height="18" rx="4" fill="#fff" opacity="0.95"/>
                <rect x="42" y="24" width="28" height="18" rx="4" fill="#fff" opacity="0.95"/>
                <rect x="4" y="50" width="72" height="62" rx="3" fill="#c7d8ef" opacity="0.85"/>
              </g>
              <text x="106" y="48" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4f8ef7" opacity="0.9">ROOM 401</text>
              <g transform="translate(22, 54)">
                <rect x="2" y="2" width="36" height="16" rx="3" fill="#10b981"/>
                <text x="20" y="14" textAnchor="middle" fontSize="8" fontWeight="700" fill="white">EXIT</text>
              </g>
            </g>

            {/* ROOM 402 */}
            <g onClick={() => setSelectedRoom('402')} className="cursor-pointer">
              <rect x="22" y="244" width="168" height="156" fill="url(#tile402)"/>
              <rect x="22" y="398" width="168" height="10" fill="#111824"/>
              <rect x="188" y="244" width="10" height="156" fill="#152338"/>
              {selectedRoom === '402' && (
                <rect x="22" y="244" width="168" height="156" fill="none" stroke="#4f8ef7" strokeWidth="2.5">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                </rect>
              )}
              <g transform="translate(35, 260)">
                <rect width="80" height="110" rx="4" fill="#1a4a6b" stroke="#2a6a9b" strokeWidth="1.5"/>
                <rect x="4" y="20" width="72" height="82" rx="3" fill="#f5f0e8" opacity="0.9"/>
                <rect x="8" y="24" width="28" height="18" rx="4" fill="#fff" opacity="0.95"/>
                <rect x="42" y="24" width="28" height="18" rx="4" fill="#fff" opacity="0.95"/>
              </g>
              <g transform="translate(155, 280)">
                <circle r="18" fill="#4f8ef7" opacity="0.15"><animate attributeName="r" values="12;22;12" dur="2s" repeatCount="indefinite"/></circle>
                <circle r="8" fill="#4f8ef7" stroke="white" strokeWidth="2.5"/>
              </g>
              <text x="106" y="238" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4f8ef7" opacity="0.9">ROOM 402</text>
            </g>

            {/* LOUNGE */}
            <g onClick={() => setSelectedRoom('lounge')} className="cursor-pointer">
              <rect x="214" y="54" width="238" height="196" fill="url(#tileLounge)"/>
              <rect x="214" y="248" width="238" height="10" fill="#1a0f08"/>
              <rect x="448" y="54" width="10" height="196" fill="#2a1a0e"/>
              {selectedRoom === 'lounge' && (
                <rect x="214" y="54" width="238" height="196" fill="none" stroke="#4f8ef7" strokeWidth="2.5" opacity="0.8"/>
              )}
              <g transform="translate(240, 65)">
                <rect width="100" height="60" rx="6" fill="#5c3d1e" stroke="#7a5230" strokeWidth="1.5"/>
              </g>
              <text x="333" y="48" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbbf24" opacity="0.9">LOUNGE</text>
            </g>

            {/* GYM */}
            <g onClick={() => setSelectedRoom('gym')} className="cursor-pointer">
              <rect x="214" y="262" width="238" height="158" fill="url(#tileGym)"/>
              <rect x="214" y="418" width="238" height="10" fill="#0a1f12"/>
              <rect x="448" y="262" width="10" height="158" fill="#102818"/>
              {selectedRoom === 'gym' && (
                <rect x="214" y="262" width="238" height="158" fill="none" stroke="#4f8ef7" strokeWidth="2.5" opacity="0.8"/>
              )}
              <g transform="translate(225, 278)">
                 <rect width="70" height="30" rx="4" fill="#1a3520" stroke="#2a5530" strokeWidth="1.5"/>
              </g>
              <text x="333" y="258" textAnchor="middle" fontSize="11" fontWeight="700" fill="#34d399" opacity="0.9">GYM</text>
            </g>
            {/* DYNAMIC SAFETY LAYERS */}
{Object.entries(mapMarkers).map(([layerId, markers]) => (
  <g key={layerId}>
    {activeLayers.includes(layerId) && markers.map((marker, idx) => (
      <g key={`${layerId}-${idx}`} transform={`translate(${marker.x}, ${marker.y})`}>
        {/* Exits ke liye Green Badge */}
        {layerId === 'exits' && (
          <>
            <rect x="-18" y="-8" width="36" height="16" rx="4" fill="#10b981" />
            <text textAnchor="middle" y="3" fontSize="8" fontWeight="900" fill="white">EXIT</text>
          </>
        )}

        {/* Fire Extinguishers ke liye Red Dot */}
        {layerId === 'fire' && (
          <g>
             <circle r="10" fill="rgba(248,113,113,0.2)" className="animate-pulse" />
             <text textAnchor="middle" y="5" fontSize="14" style={{ userSelect: 'none' }}>🧯</text>
          </g>
        )}

        {/* First Aid ke liye Yellow Dot */}
        {layerId === 'firstaid' && (
          <g>
            <circle r="10" fill="rgba(251,191,36,0.2)" />
            <text textAnchor="middle" y="5" fontSize="14" style={{ userSelect: 'none' }}>🏥</text>
          </g>
        )}

        {/* Stairs ke liye Blue Icon */}
        {layerId === 'stairs' && (
          <g>
            <circle r="10" fill="rgba(139,143,168,0.2)" />
            <text textAnchor="middle" y="5" fontSize="14" style={{ userSelect: 'none' }}>🪜</text>
          </g>
                )}
      </g>
    ))}
  </g>
))}

            {/* EVACUATION PATH */}
            {/* LIVE OCCUPANCY DOTS */}
{liveUsers.map((user) => {
  // Humein user ke room ke center coordinates chahiye
  const centers = {
    '401': { x: 106, y: 142 },
    '402': { x: 155, y: 320 },
    'lounge': { x: 333, y: 150 },
    'gym': { x: 333, y: 340 },
  };
  
  const pos = centers[user.roomNumber || user.room];
  if (!pos || user.id === auth.currentUser?.uid) return null;
  const userOffset = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 15 - 7;



  return (
    <g key={user.id}>
      <circle 
        cx={pos.x +  userOffset} // Thoda offset overlap se bachne ke liye
        cy={pos.y + (userOffset / 2)} 
        r="5" 
        fill={user.role === 'staff' ? "#10b981" : "#f87171"} 
        stroke="white" 
        strokeWidth="1"
      />
    </g>
  );
})}
            <g>
              <path d={evacPaths[selectedRoom]} fill="none" stroke="#4f8ef7" strokeWidth="10" opacity="0.1" strokeLinecap="round"/>
              <path d={evacPaths[selectedRoom]} fill="none" stroke={isPathBlocked ? "#f87171" : "#4f8ef7"} strokeWidth="2.5" opacity="0.9" strokeLinecap="round" strokeDasharray="10 12" markerEnd="url(#earrow)">
                <animate attributeName="stroke-dashoffset" from="110" to="0" dur="2.5s" repeatCount="indefinite"/>
              </path>
            </g>

            {/* BLOCKED INDICATOR */}
            <g>
              <line x1="22" y1="237" x2="188" y2="237" stroke="#f87171" strokeWidth="3.5" strokeDasharray="9 7" opacity="0.9"/>
              <rect x="68" y="228" width="56" height="14" rx="3" fill="#1a0808"/>
              <text x="96" y="239" textAnchor="middle" fontSize="8" fontWeight="700" fill="#f87171">⚠ BLOCKED</text>
            </g>

            {/* COMPASS */}
            {/* <g transform="translate(456, 68)">
              <circle r="16" fill="#1a1d2a" stroke="#3a3d50" strokeWidth="1"/>
              <polygon points="0,-10 -4,4 0,2 4,4" fill="#f87171"/>
              <text x="0" y="-13" textAnchor="middle" fontSize="7" fontWeight="700" fill="#f87171">N</text>
            </g> */}
            
            <g transform={`translate(450, 70) rotate(${-heading})`} // -heading isliye taaki needle hamesha North rahe
  style={{ transition: 'transform 0.2s ease-out' }}>
  {/* Outer Glow & Background */}
  <circle r="22" fill="#1a1d2a" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
  <circle r="19" fill="none" stroke="#3a3d50" strokeWidth="1" strokeDasharray="1 3" />

  {/* Degree Markings (Small dots for detail) */}
  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
    <rect
      key={deg}
      x="-0.5" y="-17" width="1" height="3"
      fill="#444860"
      transform={`rotate(${deg})`}
    />
  ))}

  {/* Main Needle - North (Red) */}
  <polygon points="0,-14 -5,0 0,-2 5,0" fill="#f87171" />
  
  {/* Main Needle - South (Muted) */}
  <polygon points="0,14 -5,0 0,2 5,0" fill="#6b7a90" />

  {/* Direction Labels */}
  <text x="0" y="-19" textAnchor="middle" fontSize="7" fontWeight="900" fill="#f87171" style={{ userSelect: 'none' }}>N</text>
  <text x="0" y="24" textAnchor="middle" fontSize="6" fontWeight="700" fill="#6b7a90" style={{ userSelect: 'none' }}>S</text>
  <text x="-24" y="2.5" textAnchor="middle" fontSize="6" fontWeight="700" fill="#6b7a90" style={{ userSelect: 'none' }}>W</text>
  <text x="24" y="2.5" textAnchor="middle" fontSize="6" fontWeight="700" fill="#6b7a90" style={{ userSelect: 'none' }}>E</text>

  {/* Center Cap */}
  <circle r="2.5" fill="#1a1d2a" stroke="#4f8ef7" strokeWidth="1" />
</g>
          </svg>
        </div>

        {/* INFO CARD */}
        <div className="bg-[#1a1d27] border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-3.5 transition-transform duration-200 active:scale-95">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center text-xl">
              {roomData[selectedRoom].emoji}
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#8b8fa8]">You marked</div>
              <div className="text-lg font-bold mt-0.5">{roomData[selectedRoom].label}</div>
            </div>
          </div>
          <button 
            onClick={handleConfirm}
            className={`rounded-[20px] px-5 py-2.5 text-[13px] font-bold transition-all ${confirmed ? 'bg-[#10b981]' : 'bg-[#34d399]'} text-[#0f1117]`}
          >
            {confirmed ? '✓ Confirmed!' : 'Confirm'}
          </button>
        </div>

        
        
        {/* LAYERS */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { id: 'exits', emoji: '🚪', name: 'Exits', count: '6 on this floor', color: 'rgba(16,185,129,0.15)' },
            { id: 'fire', emoji: '🧯', name: 'Extinguishers', count: '6 on this floor', color: 'rgba(79,142,247,0.15)' },
            { id: 'firstaid', emoji: '🏥', name: 'First Aid', count: '3 on this floor', color: 'rgba(251,191,36,0.15)' },
            { id: 'stairs', emoji: '🪜', name: 'Stairwells', count: '4 on this floor', color: 'rgba(139,143,168,0.15)' },
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={`flex items-center gap-2.5 p-3.5 rounded-2xl border transition-all text-left ${activeLayers.includes(layer.id) ? 'bg-[#4f8ef7]/10 border-[#4f8ef7]' : 'bg-[#1a1d27] border-white/10'}`}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: layer.color }}>
                {layer.emoji}
              </div>
              <div>
                <div className="text-[13px] font-bold">{layer.name}</div>
                <div className="text-[11px] text-[#8b8fa8] mt-px">{layer.count}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
     <BottomNav />
    </div>
    
    
  );
};

export default SafetyMap;