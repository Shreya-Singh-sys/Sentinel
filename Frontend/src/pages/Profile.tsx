// import { motion } from "framer-motion";
// import { useState, useEffect } from "react";
// import { Icon } from "../components/Icon";
// import { BottomNav } from "../components/BottomNav";
// import { db, auth } from "../config/firebase"; // Firebase imports
// import { doc, onSnapshot, updateDoc } from "firebase/firestore";

// const Profile = () => {
//   // 1. User Profile State
//   const [userProfile, setUserProfile] = useState<any>(null);
//   const [room, setRoom] = useState("...");
//   const [floor, setFloor] = useState("...");

//   // 2. Fetch User Data from Firestore
//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const userRef = doc(db, "users", user.uid);
//     const unsub = onSnapshot(userRef, (doc) => {
//       if (doc.exists()) {
//         const data = doc.data();
//         setUserProfile(data);
//         setRoom(data.roomNumber || "---");
//         setFloor(data.floor || "---");
//       }
//     });

//     return () => unsub();
//   }, []);

//   // 3. Logic to update Room/Floor in Database
//   const handleUpdateLocation = async (field: string, value: string) => {
//     const user = auth.currentUser;
//     if (!user) return;
    
//     const userRef = doc(db, "users", user.uid);
//     await updateDoc(userRef, { [field]: value });
//   };

//   return (
//     <div className="relative min-h-screen bg-slate-50 pb-28 font-sans antialiased">
//       <div className="absolute inset-x-0 top-0 h-64 bg-red-600 shadow-lg" />

//       <div className="relative mx-auto max-w-2xl px-5 pt-12">
//         {/* Profile Header - DYNAMIC NAME */}
//         {/* Profile Header - DYNAMIC NAME FIX */}
// <motion.div 
//   initial={{ opacity: 0, y: -10 }} 
//   animate={{ opacity: 1, y: 0 }} 
//   className="flex items-center gap-4"
// >
//   <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-2xl font-black text-red-600 shadow-xl overflow-hidden uppercase">
//     {/* Initials fallback logic */}
//     {(userProfile?.fullName || userProfile?.name || "GU").substring(0, 2)}
//   </div>
//   <div className="text-white">
//     <h1 className="text-2xl font-black">
//         {/* Priority: fullName (Admin) -> name (Guest/Staff) */}
//         {userProfile?.fullName || userProfile?.name || "Guest User"} 
//     </h1>
//     <p className="text-sm font-bold opacity-90 uppercase tracking-wider">
//         {/* Role Display: Admin/Guest or Staff's jobTitle */}
//         {userProfile?.role === "staff" 
//           ? (userProfile?.jobTitle || "Staff Responder") 
//           : (userProfile?.role || "Guest")} 
//         {" · "} Floor {floor}, Room {room}
//     </p>
//   </div>
// </motion.div>

//         {/* Input Controls Section */}
//         <motion.section 
//           className="mt-8 grid grid-cols-2 gap-3"
//         >
//           <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
//             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Set Floor</p>
//             <input 
//               type="text" 
//               value={floor} 
//               onChange={(e) => setFloor(e.target.value)}
//               onBlur={() => handleUpdateLocation("floor", floor)} // Auto-save to DB
//               className="w-full text-lg font-black text-slate-900 outline-none focus:text-red-600"
//             />
//           </div>
//           <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
//             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Set Room</p>
//             <input 
//               type="text" 
//               value={room} 
//               onChange={(e) => setRoom(e.target.value)}
//               onBlur={() => handleUpdateLocation("roomNumber", room)} // Auto-save to DB
//               className="w-full text-lg font-black text-slate-900 outline-none focus:text-red-600"
//             />
//           </div>
//         </motion.section>

//         {/* Rest of the Info Cards... */}
//         <motion.section className="mt-4 space-y-3">
//   {[
//     { 
//       icon: "badge", 
//       label: "Official Role", 
//       value: userProfile?.jobTitle || userProfile?.role || "Guest" 
//     },
//     { 
//       icon: "call", 
//       label: "Emergency contact", 
//       value: userProfile?.phone || userProfile?.emergencyContact || "Not Set" 
//     },
//     { 
//       icon: "layers", 
//       label: "Current Floor", 
//       value: `Level ${floor}` 
//     },
//     { 
//       icon: "meeting_room", 
//       label: "Assigned Room", 
//       value: `Room ${room}` 
//     },
//   ].map((r) => (
//     <div key={r.label} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
//       <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
//         <Icon name={r.icon} filled />
//       </div>
//       <div className="flex-1">
//         <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{r.label}</p>
//         <p className="font-bold text-slate-800">{r.value}</p>
//       </div>
//       <Icon name="chevron_right" className="text-slate-300" />
//     </div>
//   ))}
// </motion.section>
//         {/* Settings Area remains the same... */}
//       </div>
//       <BottomNav />
//     </div>
//   );
// };

// export default Profile;

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Icon } from "../components/Icon";
import { BottomNav } from "../components/BottomNav";
import { db, auth } from "../config/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

const Profile = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [room, setRoom] = useState("...");
  const [floor, setFloor] = useState("...");
  const [emergencyContact, setEmergencyContact] = useState("..."); // Naya state

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserProfile(data);
        setRoom(data.roomNumber || "---");
        setFloor(data.floor || "---");
        setEmergencyContact(data.phone || data.emergencyContact || ""); // Sync from DB
      }
    });

    return () => unsub();
  }, []);

  // Profile.tsx ke handleUpdateLocation ko replace karein:
const handleUpdateLocation = async (field: string, value: string) => {
  const user = auth.currentUser;
  if (!user || value === "..." || value === "") return; // Empty value check
  
  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { [field]: value });
    toast.success(`${field} updated successfully!`); // User ko feedback dein
  } catch (error) {
    console.error("Update failed:", error);
    toast.error("Failed to update profile.");
  }
};
  return (
    <div className="relative min-h-screen bg-slate-50 pb-28 font-sans antialiased">
      <div className="absolute inset-x-0 top-0 h-64 bg-red-600 shadow-lg" />

      <div className="relative mx-auto max-w-2xl px-5 pt-12">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex items-center gap-4"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-2xl font-black text-red-600 shadow-xl overflow-hidden uppercase">
            {(userProfile?.fullName || userProfile?.name || "GU").substring(0, 2)}
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-black">
              {userProfile?.fullName || userProfile?.name || "Guest User"} 
            </h1>
            <p className="text-sm font-bold opacity-90 uppercase tracking-wider">
              {userProfile?.role === "staff" 
                ? (userProfile?.jobTitle || "Staff Responder") 
                : (userProfile?.role || "Guest")} 
              {" · "} Floor {floor}, Room {room}
            </p>
          </div>
        </motion.div>

        {/* Input Controls Section (Floor & Room) */}
        <motion.section className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Set Floor</p>
            <input 
              type="text" 
              value={floor} 
              onChange={(e) => setFloor(e.target.value)}
              onBlur={() => handleUpdateLocation("floor", floor)}
              className="w-full text-lg font-black text-slate-900 outline-none focus:text-red-600 bg-transparent"
              placeholder="Level..."
            />
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Set Room</p>
            <input 
              type="text" 
              value={room} 
              onChange={(e) => setRoom(e.target.value)}
              onBlur={() => handleUpdateLocation("roomNumber", room)}
              className="w-full text-lg font-black text-slate-900 outline-none focus:text-red-600 bg-transparent"
              placeholder="Room..."
            />
          </div>
        </motion.section>

        {/* Info Cards Section */}
        <motion.section className="mt-4 space-y-3">
          {/* Official Role (Non-editable) */}
          <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100 opacity-80">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Icon name="badge" filled />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Official Role</p>
              <p className="font-bold text-slate-800">{userProfile?.jobTitle || userProfile?.role || "Guest"}</p>
            </div>
          </div>

          {/* Emergency Contact (Editable) */}
          <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Icon name="call" filled />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Emergency contact</p>
              <input 
                type="tel"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                onBlur={() => handleUpdateLocation("phone", emergencyContact)} // Updates 'phone' field
                className="w-full font-bold text-slate-800 outline-none focus:text-red-600 bg-transparent"
                placeholder="Enter phone number..."
              />
            </div>
            <Icon name="edit" className="text-slate-300 w-4 h-4" />
          </div>

          {/* Current Floor Card (Editable) */}
          <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Icon name="layers" filled />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Current Floor</p>
              <input 
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                onBlur={() => handleUpdateLocation("floor", floor)}
                className="w-full font-bold text-slate-800 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Assigned Room Card (Editable) */}
          <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Icon name="meeting_room" filled />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Assigned Room</p>
              <input 
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                onBlur={() => handleUpdateLocation("roomNumber", room)}
                className="w-full font-bold text-slate-800 outline-none bg-transparent"
              />
            </div>
          </div>
        </motion.section>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;