// import { motion } from "framer-motion";
// import { useState } from "react";
// import { Icon } from "../components/Icon";
// import { BottomNav } from "../components/BottomNav";

// const Profile = () => {
//   // States for dynamic inputs
//   const [room, setRoom] = useState("402");
//   const [floor, setFloor] = useState("4");
//   const [name] = useState("Alex"); // Updated name as per your profile

//   return (
//     <div className="relative min-h-screen bg-slate-50 pb-28 font-sans antialiased">
//       {/* Background Header */}
//       <div className="absolute inset-x-0 top-0 h-64 bg-red-600 shadow-lg" />

//       <div className="relative mx-auto max-w-2xl px-5 pt-12">
//         {/* Profile Header */}
//         <motion.div 
//           initial={{ opacity: 0, y: -10 }} 
//           animate={{ opacity: 1, y: 0 }} 
//           className="flex items-center gap-4"
//         >
//           <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-2xl font-black text-red-600 shadow-xl">
//             {name.substring(0, 2).toUpperCase()}
//           </div>
//           <div className="text-white">
//             <h1 className="text-2xl font-black">{name}</h1>
//             <p className="text-sm font-bold opacity-90">Staff · Floor {floor}, Room {room}</p>
//           </div>
//         </motion.div>

//         {/* Input Controls Section */}
//         <motion.section 
//           initial={{ opacity: 0, y: 20 }} 
//           animate={{ opacity: 1, y: 0 }} 
//           transition={{ delay: 0.1 }}
//           className="mt-8 grid grid-cols-2 gap-3"
//         >
//           <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
//             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Set Floor</p>
//             <input 
//               type="text" 
//               value={floor} 
//               onChange={(e) => setFloor(e.target.value)}
//               className="w-full text-lg font-black text-slate-900 outline-none focus:text-red-600"
//               placeholder="e.g. 4"
//             />
//           </div>
//           <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
//             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Set Room</p>
//             <input 
//               type="text" 
//               value={room} 
//               onChange={(e) => setRoom(e.target.value)}
//               className="w-full text-lg font-black text-slate-900 outline-none focus:text-red-600"
//               placeholder="e.g. 402"
//             />
//           </div>
//         </motion.section>

//         {/* Info Cards Section */}
//         <motion.section 
//           initial={{ opacity: 0, y: 20 }} 
//           animate={{ opacity: 1, y: 0 }} 
//           transition={{ delay: 0.2 }} 
//           className="mt-4 space-y-3"
//         >
//           {[
//             { icon: "call", label: "Emergency contact", value: "Sara Carter · +1 555 220 1290" },
//             { icon: "bloodtype", label: "Blood group", value: "O+" },
//             { icon: "layers", label: "Assigned Floor", value: `Level ${floor}` }, // Floor replace Allergies
//             { icon: "meeting_room", label: "Current Room", value: `Room ${room}` }, // QR code replaced with Room display
//           ].map((r) => (
//             <div key={r.label} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
//                 <Icon name={r.icon} filled />
//               </div>
//               <div className="flex-1">
//                 <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{r.label}</p>
//                 <p className="font-bold text-slate-800">{r.value}</p>
//               </div>
//               <Icon name="chevron_right" className="text-slate-300" />
//             </div>
//           ))}
//         </motion.section>

//         {/* Settings Area */}
//         <h2 className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Security Settings</h2>
//         <div className="mt-3 space-y-3">
//           {[
//             { icon: "notifications_active", label: "Critical alert permissions", on: true },
//             { icon: "volume_up", label: "Override silent mode", on: true },
//             { icon: "translate", label: "Voice guide language", on: false, value: "English" },
//           ].map((r) => (
//             <div key={r.label} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//                 <Icon name={r.icon} filled />
//               </div>
//               <p className="flex-1 font-bold text-slate-700">{r.label}</p>
//               {typeof r.on === "boolean" ? (
//                 <div className={`relative h-6 w-11 rounded-full transition-colors ${r.on ? "bg-red-500" : "bg-slate-200"}`}>
//                   <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${r.on ? "left-[22px]" : "left-0.5"}`} />
//                 </div>
//               ) : null}
//               {r.value && <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{r.value}</span>}
//             </div>
//           ))}
//         </div>
//       </div>
//       <BottomNav />
//     </div>
//   );
// };

// export default Profile;

import { motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "../components/Icon";
import { BottomNav } from "../components/BottomNav";
import { useEffect } from "react";
import { db, auth } from "../config/firebase"; // Aapka path alag ho sakta hai
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";

const Profile = () => {
  // States for dynamic inputs
  const [name, setName] = useState("Loading..."); // Initial state updated
  const [room, setRoom] = useState("");
  const [floor, setFloor] = useState("");
  const [isSafe, setIsSafe] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  // useEffect(() => {
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   // Real-time listener: Jaise hi Firestore mein name ya room badlega, page update ho jayega
  //   const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
  //     if (doc.exists()) {
  //       const data = doc.data();
  //       setName(data.name || user.displayName || "Guest");
  //       setRoom(data.roomNumber || "");
  //       setFloor(data.floor || "");
  //       setUserProfile(data); // Baki medical data ke liye
  //     }
  //   });

  //   return () => unsub();
  // }, []);
  useEffect(() => {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user logged in");
    return;
  }

  // User document ko listen karein
  const userRef = doc(db, "users", user.uid);
  const unsub = onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      console.log("Firestore Data:", docSnap.data()); // Debugging ke liye
      setUserProfile(docSnap.data());
    } else {
      console.log("No such document in Firestore!");
    }
  });

  return () => unsub();
}, []);
  // Location update karne ke liye function (Inputs ke liye)
  const handleUpdateLocation = async (field: string, value: string) => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      await updateDoc(doc(db, "users", user.uid), {
        [field]: value,
        lastUpdated: serverTimestamp()
      });
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] pb-32 font-sans antialiased">
      {/* Red Header - Fixed height and clean shadow */}
      <div className="absolute inset-x-0 top-0 h-60 bg-[#E11D48] shadow-lg shadow-red-200" />

      <div className="relative mx-auto max-w-2xl px-5 pt-12">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white text-2xl font-black text-red-600 shadow-2xl">
              {name.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-black tracking-tight">{userProfile?.name || auth.currentUser?.displayName || "Guest"}</h1>
              <div className="flex items-center gap-2 mt-1 bg-black/10 px-3 py-1 rounded-full w-fit">
                <div className={`h-2 w-2 rounded-full ${isSafe ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <p className="text-[10px] font-bold uppercase tracking-wider">Status: {isSafe ? 'Safe' : 'Needs Help'}</p>
              </div>
            </div>
          </div>
          <button className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white">
            <Icon name="settings" />
          </button>
        </div>

        {/* Quick Info Grid (Set Floor/Room) */}
        <section className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">Set Floor</p>
            <input 
              type="text" 
              value={floor} 
              onChange={(e) => setFloor(e.target.value)}
              onBlur={() => handleUpdateLocation("floor", floor)}
              className="w-full text-xl font-black text-slate-900 outline-none focus:text-red-600"
            />
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">Set Room</p>
            <input 
              type="text" 
              value={room} 
              onChange={(e) => setRoom(e.target.value)}
              onBlur={() => handleUpdateLocation("roomNumber", room)}
              className="w-full text-xl font-black text-slate-900 outline-none focus:text-red-600"
            />
          </div>
        </section>

        {/* Medical & Safety Section (New feature - High Visibility) */}
        <h2 className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Medical & Safety</h2>
        <div className="mt-3 space-y-3">
          {/* Medical Condition Card */}
          <div className="flex items-start gap-4 rounded-3xl bg-red-50/50 p-5 border border-red-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Icon name="medical_information" filled />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">ALLERGIES/CONDITIONS</p>
              <p className="font-bold text-slate-800">{userProfile?.allergies || userProfile?.conditions || "No medical information available"}</p>
              <p className="text-xs text-red-600/70 mt-1 italic">Responders will see this in emergency</p>
            </div>
            <Icon name="chevron_right" className="text-red-200 mt-2" />
          </div>

          {/* Disability Toggle Card */}
          <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Icon name="accessible" filled />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800">Mobility Assistance</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Wheelchair required</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-slate-200 relative">
              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        </div>

        {/* Identity & Contact Section */}
        <h2 className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Identity & Contact</h2>
        <div className="mt-3 space-y-3">
          {[
            { icon: "contacts", label: "Emergency contact", value: "Sara Carter · +1 555 220 1290" },
            { icon: "fingerprint", label: "Identity Vault", value: "Passport / National ID Scanned", color: "bg-blue-50 text-blue-600" },
            { icon: "bloodtype", label: "Blood group", value: "O+" },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${r.color || 'bg-slate-50 text-slate-500'}`}>
                <Icon name={r.icon} filled />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{r.label}</p>
                <p className="font-bold text-slate-800">{r.value}</p>
              </div>
              <Icon name="chevron_right" className="text-slate-300" />
            </div>
          ))}
        </div>

        {/* Security Settings */}
        <h2 className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Security & Permissions</h2>
        <div className="mt-3 mb-10 space-y-3">
          <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Icon name="my_location" filled />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800">Location Permissions</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Only during emergency</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-red-500 relative">
              <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;