// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Users, PersonStanding, AlertTriangle, BadgeCheck, 
//   Upload, Pencil, Trash2, Plus, UserCircle2, 
//   Phone, MessageSquare, Shield, Flame, Stethoscope, 
//   BriefcaseBusiness, Megaphone, ShieldCheck, Send, Bell, CheckCircle2,
//   HardHat, LifeBuoy, Construction, Siren, X
// } from "lucide-react";

// // Components Import
// import { Header } from "../components/Header";
// import { BottomNav } from "../components/BottomNav";

// // --- 1. ICON & COLOR MAPPING (Video Style) ---
// const CONTACT_THEME = {
//   Police: { icon: Siren, color: "bg-blue-100 text-blue-700" },
//   Fire: { icon: Flame, color: "bg-red-100 text-red-700" },
//   Hospital: { icon: Stethoscope, color: "bg-emerald-100 text-emerald-700" },
//   Manager: { icon: BriefcaseBusiness, color: "bg-amber-100 text-amber-700" },
//   Security: { icon: Shield, color: "bg-slate-100 text-slate-700" },
// };

// const STAFF_THEME = {
//   "Floor Wardens": { icon: HardHat, color: "bg-orange-100 text-orange-700" },
//   "Security": { icon: Shield, color: "bg-slate-100 text-slate-700" },
//   "Medical": { icon: Stethoscope, color: "bg-emerald-100 text-emerald-700" },
//   "Reception": { icon: LifeBuoy, color: "bg-blue-100 text-blue-700" },
//   "Maintenance": { icon: Construction, color: "bg-amber-100 text-amber-700" },
// };

// // --- Mock Data ---
// const FLOORS = ["1F", "2F", "3F", "4F"];
// const INITIAL_STAFF = [
//   { id: "STF-001", name: "Priya Sharma", department: "Floor Wardens", status: "on" },
//   { id: "STF-002", name: "Arjun Khanna", department: "Security", status: "on" },
//   { id: "STF-003", name: "Meera Iyer", department: "Medical", status: "on" },
//   { id: "STF-004", name: "Daniel Cole", department: "Reception", status: "off" },
//   { id: "STF-005", name: "Sara Qureshi", department: "Maintenance", status: "on" },
// ];

// const INITIAL_CONTACTS = [
//   { id: "C1", name: "City Police HQ", number: "+91 100", type: "Police" },
//   { id: "C2", name: "Marine Fire Station", number: "+91 101", type: "Fire" },
//   { id: "C3", name: "Bombay Hospital ER", number: "+91 22 2206 7676", type: "Hospital" },
//   { id: "C4", name: "Hotel Manager — R. Kapoor", number: "+91 98200 11200", type: "Manager" },
// ];

// const INITIAL_ACTIVITY = [
//   { id: "L1", level: "danger", message: "Guest in Room 305 reported smoke in Staircase B.", time: "16:32" },
//   { id: "L2", level: "warning", message: "Evacuation broadcast sent to floors 3-6.", time: "14:38" },
//   { id: "L3", level: "success", message: "Staff member Priya marked Floor 5 as cleared.", time: "14:28" },
//   { id: "L4", level: "danger", message: "Fire alarm triggered manually by reception.", time: "14:16" },
// ];

// const AdminDashboard = () => {
//   const [activeFloor, setActiveFloor] = useState("1F");
//   const [editing, setEditing] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     document.title = "Sentinel · Admin Command Center";
//     if (!localStorage.getItem("userRole")) localStorage.setItem("userRole", "admin");
//   }, []);

//   // --- Sub-Component: Summary Cards ---
//   const cards = [
//     { title: "Total Guests", value: 412, sub: "Checked-in tonight", Icon: Users, iconBg: "bg-slate-100", iconColor: "text-slate-700", accent: "border-l-slate-300" },
//     { title: "Evacuated", value: 287, sub: "Confirmed safe", Icon: PersonStanding, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", accent: "border-l-emerald-500" },
//     { title: "Trapped", value: 4, sub: "Awaiting rescue", Icon: AlertTriangle, iconBg: "bg-red-100", iconColor: "text-red-600", accent: "border-l-red-500" },
//     { title: "Staff Active", value: 38, sub: "On the floor", Icon: BadgeCheck, iconBg: "bg-amber-100", iconColor: "text-amber-600", accent: "border-l-amber-500" },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 pb-32 font-sans antialiased">
//       <Header />
      
//       <main className="relative mx-auto max-w-7xl px-5 pt-32 lg:px-8 flex flex-col gap-6">
        
//         {/* 1. Summary Cards */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//           {cards.map((c) => {
//             const IconComp = c.Icon;
//             return (
//               <div key={c.title} className={`flex items-center justify-between rounded-xl border border-slate-200 border-l-4 ${c.accent} bg-white p-5 shadow-sm`}>
//                 <div>
//                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{c.title}</p>
//                   <p className="mt-1 text-4xl font-black text-slate-900">{c.value}</p>
//                   <p className="text-[10px] font-bold text-slate-400">{c.sub}</p>
//                 </div>
//                 <div className={`grid h-12 w-12 place-items-center rounded-full ${c.iconBg}`}>
//                   <IconComp className={`h-6 w-6 ${c.iconColor}`} />
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* 2. Venue Floor Plans */}
//         <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h2 className="text-base font-bold text-slate-900">Venue Floor Plans</h2>
//               <p className="text-xs text-slate-500">Upload PDF maps and mark danger zones for first responders.</p>
//             </div>
//             <div className="flex gap-2">
//               <button className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-wide"><Upload size={14}/> Upload PDF Map</button>
//               <button className="bg-white border border-slate-200 px-3 py-2 rounded-md text-[10px] font-bold text-slate-600">Choose File</button>
//             </div>
//           </div>
          
//           <div className="flex justify-between items-center mb-4">
//             <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
//               {FLOORS.map(f => (
//                 <button key={f} onClick={() => setActiveFloor(f)} className={`px-4 py-1.5 rounded-md text-xs font-bold ${activeFloor === f ? 'bg-white shadow text-red-600' : 'text-slate-500'}`}>{f}</button>
//               ))}
//             </div>
//             <button onClick={() => setEditing(!editing)} className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase border ${editing ? 'bg-slate-900 text-white' : 'bg-red-50 border-red-100 text-red-600'}`}>
//               <Pencil size={12}/> {editing ? "Done Editing" : "Edit Map / Mark Hazards"}
//             </button>
//           </div>

//           <div className="relative aspect-[16/7] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
//              <svg viewBox="0 0 800 350" className="h-full w-full opacity-20"><rect x="40" y="40" width="720" height="270" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
//              <div className="absolute h-4 w-4 bg-red-600 rounded-full border-2 border-white shadow-lg"><span className="absolute inset-0 rounded-full bg-red-500 animate-ping"/></div>
//              <div className="absolute right-4 top-4 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">● 1 Hazard Detected</div>
//           </div>
//         </section>

//         {/* 3. Broadcast Center */}
//         <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="flex items-center gap-3 mb-4 text-red-600">
//             <Megaphone size={20} />
//             <h2 className="text-base font-bold text-slate-900">Emergency Broadcast Center</h2>
//           </div>
//           <textarea 
//             value={message} onChange={(e) => setMessage(e.target.value)}
//             className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-red-100"
//             placeholder="Type your emergency broadcast message here..." rows={2}
//           />
//           <div className="flex gap-4 mt-4">
//             <button className="flex-1 bg-red-600 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">Broadcast to All Guests</button>
//             <button className="flex-1 bg-white border-2 border-red-600 text-red-600 py-3 rounded-lg text-xs font-bold uppercase tracking-wider">Broadcast to All Staff</button>
//           </div>
//         </section>

//         {/* 4. Staff & Contacts Grid (With Specific Icons) */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Staff Directory */}
//           <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-base font-bold text-slate-900">Staff Directory</h2>
//               <button className="bg-red-600 text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase">+ Add Staff</button>
//             </div>
//             <div className="space-y-4">
//               {INITIAL_STAFF.map(s => {
//                 const theme = STAFF_THEME[s.department] || { icon: UserCircle2, color: "bg-slate-100 text-slate-500" };
//                 const StaffIcon = theme.icon;
//                 return (
//                   <div key={s.id} className="flex items-center justify-between border-b border-slate-50 pb-3">
//                     <div className="flex items-center gap-3">
//                       <div className={`p-2 rounded-full ${theme.color}`}><StaffIcon size={18}/></div>
//                       <div><p className="text-sm font-bold text-slate-800">{s.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.department}</p></div>
//                     </div>
//                     <div className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${s.status === 'on' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
//                       {s.status === 'on' ? '● On-Duty' : 'Off-Duty'}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>

//           {/* Emergency Contacts */}
//           <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-base font-bold text-slate-900">Key Emergency Contacts</h2>
//               <button className="bg-red-600 text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase">+ Add Contact</button>
//             </div>
//             <div className="space-y-4">
//               {INITIAL_CONTACTS.map(c => {
//                 const theme = CONTACT_THEME[c.type] || { icon: Shield, color: "bg-slate-100 text-slate-700" };
//                 const ContactIcon = theme.icon;
//                 return (
//                   <div key={c.id} className="flex items-center justify-between border-b border-slate-50 pb-3">
//                     <div className="flex items-center gap-3">
//                       <div className={`p-2 rounded-full ${theme.color}`}><ContactIcon size={18}/></div>
//                       <div><p className="text-sm font-bold text-slate-800">{c.name}</p><p className="text-[10px] text-slate-400 font-bold">{c.number}</p></div>
//                     </div>
//                     <div className="flex gap-2">
//                       <button className="p-2 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100"><Phone size={14}/></button>
//                       <button className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"><MessageSquare size={14}/></button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         </div>

//         {/* 5. Activity Log */}
//         <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-base font-bold text-slate-900">Activity Log</h2>
//             <button className="text-red-600 text-[10px] font-black uppercase hover:underline">View All Records</button>
//           </div>
//           <div className="space-y-6">
//             {INITIAL_ACTIVITY.map(log => (
//               <div key={log.id} className="flex gap-4">
//                 <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${log.level === 'danger' ? 'bg-red-100 text-red-600' : log.level === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
//                   {log.level === 'danger' ? <Flame size={18}/> : log.level === 'warning' ? <Bell size={18}/> : <CheckCircle2 size={18}/>}
//                 </div>
//                 <div className="flex-1 pt-1">
//                   <div className="flex justify-between items-start">
//                     <p className="text-sm font-bold text-slate-700 leading-snug">{log.message}</p>
//                     <span className="text-[10px] font-mono font-bold text-slate-400">{log.time}</span>
//                   </div>
//                   <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded mt-2 inline-block tracking-tighter ${log.level === 'danger' ? 'bg-red-100 text-red-600' : log.level === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
//                     Status: {log.level}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//       </main>

//       <BottomNav />
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState } from "react";
import { useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { 
  Users, PersonStanding, AlertTriangle, BadgeCheck, 
  Upload, Pencil, Phone, Shield, Flame, Stethoscope, 
  BriefcaseBusiness, Megaphone, Bell, CheckCircle2,
  Radio, Clock, Map as MapIcon, ShieldAlert, Sparkles, 
  Share2, MessageSquare, Globe, Siren, ChevronRight,
  Info
} from "lucide-react";
// import { db } from "../config/firebase";
import { doc, updateDoc, setDoc, collection, onSnapshot } from "firebase/firestore";
import { storage, db } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {addDoc, serverTimestamp } from "firebase/firestore";
import {query, where} from "firebase/firestore";
import { MoreVertical, X, XCircle, AlertCircle} from 'lucide-react';
import { Activity, Briefcase} from "lucide-react";  
import { RefreshCw } from 'lucide-react';
// import { doc, updateDoc, onSnapshot } from "firebase/firestore";
// import { db } from "../config/firebase";
// import { collection, onSnapshot, doc } from "firebase/firestore";

// Components Import
import { BottomNav } from "../components/BottomNav";

// --- Hover Animation Settings ---
// const cardHover = {
//   hover: { 
//     y: -4, 
//     shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
//     transition: { duration: 0.2, ease: "easeOut" }
//   }
// };
// --- Hover Animation Settings ---
const cardHover: Variants = {
  hover: { 
    y: -4, 
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
    transition: { 
      duration: 0.2, 
      ease: "easeOut" 
    }
  }
};
// const [stats, setStats] = useState({ total: 0, evacuated: 0, trapped: 0 });
// const [trappedUsers, setTrappedUsers] = useState(
const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, evacuated: 0, trapped: 0, staffActive: 0 });
  const [trappedUsers, setTrappedUsers] = useState<any[]>([]);
  const [mapUrl, setMapUrl] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("1F");
  const [isEditMode, setIsEditMode] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [selectedMember, setSelectedMember] = useState(null); // Detail view ke liye
const [newMember, setNewMember] = useState({ fullName: '', role: '',jobTitle: 'Floor Warden', phone: '', status: 'on-duty' });
const [staffMembers, setStaffMembers] = useState([]);
const [emergencyContacts, setEmergencyContacts] = useState([]);
const [isContactModalOpen, setIsContactModalOpen] = useState(false);
const [newContact, setNewContact] = useState({ name: '', phone: '', category: 'Medical' });
const [aiInsight, setAiInsight] = useState("Analyzing real-time emergency data...");
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [logs, setLogs] = useState([]);
const [isAllRecordsOpen, setIsAllRecordsOpen] = useState(false);
const [selectedLog, setSelectedLog] = useState(null);
const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  useEffect(() => {
    // Check if db is defined to prevent crash
    if (!db) return;

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      try {
        const usersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];

        // Debugging: Console mein dekhein data aa raha hai ya nahi
        console.log("Users fetched:", usersList);

        const trapped = usersList.filter(u => u.status === 'trapped');
        const evacuated = usersList.filter(u => u.status === 'safe');
        const activeStaff = usersList.filter(u => u.role === 'staff');
        setStats({
          total: usersList.length,
          evacuated: evacuated.length,
          trapped: trapped.length,
          staffActive: activeStaff.length
        });
        setTrappedUsers(trapped);
      } catch (err) {
        console.error("Error processing firestore data:", err);
      }
    });

    return () => unsubscribe();
  }, []);
//   useEffect(() => {
//     // 1. Listen for ALL Users to update Stats
//     const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
//         const usersList = snapshot.docs.map(doc => doc.data());
        
//         const trapped = usersList.filter(u => u.status === 'trapped');
//         const evacuated = usersList.filter(u => u.status === 'safe');

//         setStats({
//             total: usersList.length,
//             evacuated: evacuated.length,
//             trapped: trapped.length
//         });
//         setTrappedUsers(trapped); // For your "Quick Peek" section
//     });

//     return () => unsubscribeUsers();
// }, []);

// Emergency Trigger Function
// const handleEmergencyToggle = async (isActive: boolean) => {
//     const endpoint = isActive ? "/api/admin/trigger" : "/api/admin/clear";
//     await fetch(`http://localhost:5000${endpoint}`, {
//         method: 'POST',
//         headers: { 
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}` 
//         },
//         body: JSON.stringify({ type: 'FIRE', message: 'Evacuate now!' })
//     });
// };
// const handleMapUpload = async (e: any) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const storageRef = ref(storage, `maps/marlowe_grand_${selectedFloor}.png`);
//   await uploadBytes(storageRef, file);
//   const url = await getDownloadURL(storageRef);

//   // Firestore mein link save karein
//   await updateDoc(doc(db, "venues", "marlowe_grand"), {
//     [`maps.${selectedFloor}`]: url
//   });
//   setMapUrl(url);
// };
const handleEmergencyActivation = async () => {
  const confirmAction = window.confirm("Are you sure you want to ACTIVATE Emergency Mode? This will alert all guests and staff.");
  
  if (confirmAction) {
    try {
      // 1. Firestore mein global state update karein
      await setDoc(doc(db, "system", "status"), {
        isEmergency: true,
        activatedAt: serverTimestamp(),
        activatedBy: "Admin"
      }, { merge: true });

      // 2. Activity Log mein entry daalein
      await logActivity("CRITICAL: Emergency Mode activated by Admin.", "danger", "High Alert");

      // 3. Optional: Sabhi guests ko automatic broadcast bhejein
      await addDoc(collection(db, "broadcasts"), {
        message: "EMERGENCY: Please follow evacuation protocols immediately.",
        target: "guest",
        timestamp: serverTimestamp()
      });

      alert("Emergency Mode Active!");
    } catch (e) {
      console.error(e);
    }
  }
};
const shareResponderLink = () => {
  // Aapke naya page ka route (e.g., /responder-view/project-id)
  const responderUrl = `${window.location.origin}/responder`;

  // Navigator API se link copy ya share karein
  if (navigator.share) {
    navigator.share({
      title: 'Emergency Responder Access',
      text: 'Live evacuation and hazard tracking link.',
      url: responderUrl,
    }). catch(err => console.log("Share failed:", err));
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(responderUrl);
    alert("Responder Link copied to clipboard! Share it with emergency teams.");
  }
};
const toggleEmergencyMode = async () => {
  const newStatus = !isEmergencyActive;
  const actionText = newStatus ? "ACTIVATE" : "DEACTIVATE";

  if (window.confirm(`Are you sure you want to ${actionText} Emergency Mode?`)) {
    try {
      // 1. Firestore Global Status Update
      await setDoc(doc(db, "system", "status"), {
        isEmergency: newStatus,
        lastUpdated: serverTimestamp(),
        updatedBy: "Admin"
      }, { merge: true });

      // 2. Activity Log mein entry
      await logActivity(
        newStatus ? "CRITICAL: Global Emergency Mode Activated." : "INFO: Emergency Mode Deactivated. System returning to normal.",
        newStatus ? "danger" : "success",
        "System Alert"
      );

      // 3. Local State update
      setIsEmergencyActive(newStatus);
      
      alert(`Emergency Mode ${newStatus ? "Started" : "Stopped"} Successfully!`);
    } catch (e) {
      console.error("Toggle failed:", e);
    }
  }
};

const handleMapUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // 1. Storage reference banana (Floor wise save hoga)
    const storageRef = ref(storage, `maps/${activeFloor}_plan_${Date.now()}`);
    
    // 2. File upload karna
    // const uploadTask = await uploadBytes(storageRef, file);
    await uploadBytes(storageRef, file);
    
    // 3. Link fetch karna
    const url = await getDownloadURL(storageRef);
    
    // 4. Firestore mein save karna (Replace 'marlowe_grand' with your building ID)
    // Agar venues collection nahi hai toh ban jayegi
    await setDoc(doc(db, "venues", "marlowe_grand"), {
      maps: {
        [activeFloor]: url
      }
    }, { merge: true });

    setMapUrl(url); // Local state update
    console.log("Firestore updated with:", url);
    await logActivity(`Floor map for ${activeFloor} was updated by Admin.`, "success", "System Update");
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
//     await setDoc(doc(db, "venues", "marlowe_grand"), {
//       [`maps.${activeFloor}`]: url
//     }, { merge: true });

//     setMapUrl(url); // UI turant update hogi
//     alert(`Map for ${activeFloor} uploaded successfully!`);
//   } catch (error) {
//     console.error("Upload error:", error);
//     alert("Upload failed. Check Firebase Storage rules.");
//   }
// };

// 2. Fetch Map Real-time
const sendBroadcast = async (target: 'guest' | 'staff') => {
  if (!broadcastMsg.trim()) return alert("Please type a message first!");

  try {
    // Firestore mein broadcast message add karein
    await addDoc(collection(db, "broadcasts"), {
      message: broadcastMsg,
      target: target,
      sender: "Admin",
      timestamp: serverTimestamp(),
    });

    // Option: Agar aapne notification backend banaya hai toh yahan call karein
    // await fetch('/api/notifications/send', { ... });

    alert(`Message broadcasted to all ${target}s!`);
    setBroadcastMsg(""); // Clear textarea
    await logActivity(`Evacuation broadcast sent to all ${target}s.`, "warning", "Broadcast");
  } catch (error) {
    console.error("Broadcast failed:", error);
  }
};
const [activeFloor, setActiveFloor] = useState("1F");
useEffect(() => {
  if (!db) return;

  // Building ID wahi rakhein jo Firestore mein hai
  const venueRef = doc(db, "venues", "marlowe_grand");

  const unsubscribe = onSnapshot(venueRef, (docSnap) => {
    if (docSnap.exists()) {
      // 'as any' use karke TypeScript ko chup karayein
      const data = docSnap.data() as any; 
      
      console.log("Venue Data:", data); // Check karein console mein data aa raha hai

      // Check karein ki kya maps aur activeFloor ka link maujood hai
      if (data.maps && data.maps[activeFloor]) {
        console.log(`Loading map for ${activeFloor}:`, data.maps[activeFloor]);

        setMapUrl(data.maps[activeFloor]);
      } else {
        console.log(`No map found for ${activeFloor}`);
        setMapUrl(""); // Blank set karein taaki purana floor ka map na dikhe
      }
    }
  }, (error) => {
    console.error("Firestore Error:", error);
  });

  return () => unsubscribe();
}, [activeFloor]); // activeFloor change hone par naya map load hoga
// useEffect(() => {
//   const unsub = onSnapshot(doc(db, "venues", "marlowe_grand"), (doc) => {
//     const data = doc.data();
//     if (data?.maps?.[selectedFloor]) {
//       setMapUrl(data.maps[selectedFloor]);
//     }
//   });
//   return () => unsub();
// }, [selectedFloor]);
  // const [activeFloor, setActiveFloor] = useState("1F");
// const handleAddMember = async () => {
//   try {
//     await addDoc(collection(db, "users"), {
//       ...newMember,
//       role: 'staff', // Force role as staff
//       createdAt: serverTimestamp()
//     });
//     setIsAddModalOpen(false);
//     setNewMember({ fullName: '', role: '', phone: '', status: 'on-duty' });
//     alert("Staff member added!");
//   } catch (e) { console.error(e); }
// };
const handleAddMember = async () => {
  try {
    await addDoc(collection(db, "users"), {
      fullName: newMember.fullName,
      // 'role' login type ke liye 'staff' hi rahega
      role: 'staff', 
      // 'jobTitle' mein woh value jayegi jo aapne dropdown se pick ki hai
      jobTitle: newMember.jobTitle, 
      phone: newMember.phone,
      status: 'on-duty',
      createdAt: serverTimestamp()
    });
    setIsAddModalOpen(false);
    // Reset state
    setNewMember({ fullName: '',role: 'staff', jobTitle: 'Floor Warden', phone: '', status: 'on-duty' });
    alert("Member Added Successfully!");
    await logActivity(`New Staff member ${newMember.fullName} added to directory.`, "success", "Staff Update");
  } catch (e) { console.error(e); }
};
useEffect(() => {
  // Agar aapne 'members' collection banayi hai toh yahan "members" likhein
  // Warna "users" collection use karein jaisa niche dikhaya hai
  const q = query(collection(db, "users"), where("role", "==", "staff"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const membersList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setStaffMembers(membersList);
  });

  return () => unsubscribe();
}, []);
useEffect(() => {
  const q = query(collection(db, "emergency_contacts"));
  const unsub = onSnapshot(q, (snap) => {
    setEmergencyContacts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
  return () => unsub();
}, []);

// 2. Add Contact Function
const handleAddContact = async () => {
  if(!newContact.name || !newContact.phone) return alert("Fields cannot be empty");
  await addDoc(collection(db, "emergency_contacts"), {
    ...newContact,
    timestamp: serverTimestamp()
  });
  setIsContactModalOpen(false);
  setNewContact({ name: '', phone: '', category: 'Medical' });
};
// const fetchAIInsight = async () => {
//   setIsAnalyzing(true);
//   try {
//     // 1. Apne current stats collect karein
//     const context = {
//       trapped: stats.trapped,
//       hazards: 2, // Static or from your hazard state
//       evacuationProgress: Math.round(((stats.total - stats.trapped) / stats.total) * 100)
//     };

//     // 2. Apne backend ko call karein jo Gemini API use karta hai
//     const response = await fetch('/api/get-ai-insight', {
//       method: 'POST',
//       body: JSON.stringify(context)
//     });
//     const data = await response.json();
//     setAiInsight(data.insight);
//   } catch (err) {
//     setAiInsight("Unable to generate insight. Check network status.");
//   } finally {
//     setIsAnalyzing(false);
//   }
// };
const fetchAIInsight = async () => {
  setIsAnalyzing(true);
  try {
    const statsContext = {
      trapped: stats.trapped,
      total: stats.total,
      hazards: 2,
      progress: 70
    };

    const response = await fetch('http://localhost:5000/api/get-ai-insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statsContext)
    });

    const data = await response.json();
    setAiInsight(data.insight);
  } catch (error) {
    console.log("Error fetching AI insight", error);
  } finally {
    setIsAnalyzing(false);
  }
};
// Initial load par fetch karein
useEffect(() => {
  fetchAIInsight();
}, []);
useEffect(() => {
  // Latest 5 logs ko real-time listen karein
  const q = query(
    collection(db, "activity_log")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const logsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setLogs(logsList);
  });

  return () => unsubscribe();
}, []);
// Example: Jab Admin broadcast bhej raha ho
const logActivity = async (msg, type, label) => { // 1. Yahan 'label' add kiya
  try { // 2. Try block start kiya
    await addDoc(collection(db, "activity_log"), {
      msg: msg,
      type: type, // 'danger', 'warning', or 'success'
      label: label,
      timestamp: serverTimestamp(),
    });
  } catch (e) { // 3. Catch block ab sahi se kaam karega
    console.error("Error logging activity:", e);
  }
};

// Ise aise use karein:
// logActivity("Evacuation broadcast sent", "warning", "Broadcast");
// Ise aise use karein:
// logActivity("Evacuation broadcast sent to Floors 3-6.", "warning", "Evacuation");
  return (
    <div className={`min-h-screen transition-colors duration-700 ${isEmergencyActive ? 'bg-red-200' : 'bg-red-100'}`}>
  {isEmergencyActive && (
    <div className="fixed top-0 left-0 w-full h-1.5 bg-red-600 z-[200]">
      <div className="w-full h-full bg-red-400 animate-pulse origin-left" />
    </div>
  )}
      {/* <div className={`min-h-screen transition-colors duration-700 ${isEmergencyMode ? 'bg-red-50/50' : 'bg-slate-50'}`}> */}
  
  {/* Agar mode active hai toh top par ek warning bar dikhao */}
  
      {isAllRecordsOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6 md:p-12">
    <motion.div 
      initial={{ opacity: 0, y: 40, scale: 0.95 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] rounded-[3.5rem] w-full max-w-5xl h-full flex flex-col overflow-hidden relative"
    >
      {/* Background Decorative Glows */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -z-10" />

      {/* Modal Header */}
      <div className="p-10 border-b border-white/40 flex justify-between items-center bg-white/20">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">System Logs</h3>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            Full Activity <span className="text-red-600">Archive</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 bg-white/50 w-fit px-3 py-1 rounded-full border border-white/50">
            Total Records: {logs.length}
          </p>
        </div>
        <button 
          onClick={() => setIsAllRecordsOpen(false)}
          className="h-14 w-14 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center hover:bg-red-600 transition-all duration-300 shadow-xl shadow-slate-900/20 active:scale-90"
        >
          <X size={28} />
        </button>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-10 space-y-5 custom-scrollbar bg-slate-50/20">
        {logs.map((log, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={log.id} 
            className="p-6 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-white flex justify-between items-center group hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:scale-[1.01] transition-all duration-300"
          >
             <div className="flex items-center gap-6">
                {/* Icon with Dynamic Background */}
                <div className={`h-14 w-14 rounded-[1.5rem] bg-gradient-to-br ${
                  log.type === 'danger' ? 'from-red-500 to-rose-600' : 
                  log.type === 'warning' ? 'from-amber-400 to-orange-500' : 
                  'from-emerald-400 to-teal-600'
                } text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                   <Clock size={24} />
                </div>
                <div>
                   <p className="text-[15px] font-black text-slate-800 leading-tight mb-1.5">{log.msg}</p>
                   <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white rounded-lg border border-slate-100 text-slate-400 group-hover:text-red-500 group-hover:border-red-100 transition-colors">
                     {log.label}
                   </span>
                </div>
             </div>
             <div className="text-right">
                <p className="text-slate-900 font-black text-xs tracking-tighter">
                   {log.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                   {log.timestamp?.toDate().toLocaleDateString()}
                </p>
             </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
)}
          
      
      {/* 1. TOP HEADER */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 px-4 py-2.5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 5 }} className="h-9 w-9 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-100">
              <Shield size={18} fill="currentColor" />
            </motion.div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 leading-none">Sentinel</p>
              <p className="text-sm font-black text-slate-900">Command Center</p>
            </div>
            <div className="ml-4 hidden md:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">Live — The Marlowe Grand</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Globe size={14} /> English
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
              <Bell size={18} />
            </button>
            <button onClick={shareResponderLink}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wide border border-blue-100 hover:bg-blue-100 transition-all active:scale-95">
              <Radio size={14} strokeWidth={2.5}/> Responder Link
            </button>
            <motion.button 
  onClick={toggleEmergencyMode}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
    isEmergencyActive 
    ? "bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800" // Stop Mode
    : "bg-red-600 text-white shadow-red-200 hover:bg-red-700 animate-pulse" // Active Mode
  }`}
>
  {isEmergencyActive ? (
    <>
      <div className="h-2 w-2 bg-red-500 rounded-full animate-ping" />
      Stop Emergency Mode
    </>
  ) : (
    <>
      <Siren size={14}/> Activate Emergency Mode
    </>
  )}
</motion.button>
            
            {/* <motion.button 
              // onClick={() => handleEmergencyToggle(true)}
              onClick={handleEmergencyActivation}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
            >
              <Siren size={14}/> Activate Emergency Mode
            </motion.button> */}
          </div>
        </div>
      </nav>
      
      <main className="mx-auto max-w-7xl px-4 pt-24 lg:px-6 flex flex-col gap-4">
        
        {/* 2. Stat Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Guests", val: stats.total.toString(), sub: "Checked in tonight", icon: Users, col: "blue", border: "border-blue-500" },
            // { label: "Total Guests", val: "412", sub: "Checked in tonight", icon: Users, col: "blue", border: "border-blue-500" },
            { label: "Evacuated", val: stats.evacuated.toString(), sub: "Confirmed safe", icon: CheckCircle2, col: "emerald", border: "border-emerald-500" },
            { label: "Trapped", val: stats.trapped.toString(), sub: "Click for triage →", icon: AlertTriangle, col: "red", border: "border-red-500", pulse: true },
            { label: "Staff Active", val: stats.staffActive.toString(), sub: "On the floor", icon: BadgeCheck, col: "amber", border: "border-amber-500" }
          ].map((s) => (
            <motion.div 
              key={s.label}
              variants={cardHover}
              whileHover="hover"
              className={`bg-white p-4 rounded-2xl border-l-4 ${s.border} shadow-sm border border-slate-100 relative cursor-default`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider leading-none">{s.label}</span>
                <div className={`p-2 bg-${s.col}-50 rounded-lg text-${s.col}-600`}>
                  <s.icon size={16} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{s.val}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1">{s.sub}</p>
              {s.pulse && <div className="absolute top-2 right-2"><span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" /></div>}
            </motion.div>
          ))}
        </div>

        {/* 3. Trapped Guests Peek */}
        <div className="bg-red-50/40 border border-red-100 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-black uppercase text-red-600 tracking-widest flex items-center gap-2">
              <AlertTriangle size={14}/> Trapped Guests — Quick Peek
            </h3>
            <button className="text-[9px] font-black text-red-600 uppercase tracking-tighter hover:underline flex items-center gap-1 transition-all">Open Live Triage <ChevronRight size={10}/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {[
              { name: "Rahul Mehta", loc: "Room 402", status: "Injured", color: "bg-amber-100 text-amber-700" },
              { name: "Anjali Verma", loc: "Room 405", status: "Critical", color: "bg-red-600 text-white shadow-sm" },
              { name: "Karthik Iyer", loc: "Stairwell B", status: "Stable", color: "bg-emerald-500 text-white" },
              { name: "Mei Tanaka", loc: "Conference Hall", status: "Unknown", color: "bg-slate-100 text-slate-600" },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-red-100/30 last:border-0 hover:bg-white/50 rounded-lg px-1 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                  <span className="text-xs font-bold text-slate-700">{p.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">· {p.loc}</span>
                </div>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${p.color}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Floor Plans Section */}
        {/* 4. Floor Plans Section */}
        <motion.div whileHover={{ boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05)" }} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 flex flex-wrap justify-between items-center border-b border-slate-50">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">Venue Floor Plans</h2>
              <p className="text-[10px] text-slate-500 font-medium">Upload PDF maps and mark danger zones for first responders.</p>
            </div>
            <div 
  onClick={(e) => {
    if (!isEditMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Yahan hum Firestore mein Hazard add karenge
    console.log(`Hazard at: X:${x}%, Y:${y}%`);
    // Future: addDoc(collection(db, "hazards"), { x, y, floor: activeFloor })
  }}
  className="..." 
>
  {/* Map Content */}
</div>
            <div className="flex gap-2">
              <input type="file" id="map-input" className="hidden" accept="image/*" onChange={handleMapUpload}/>
               <button onClick={() => document.getElementById('map-input')?.click()} className="bg-red-700 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 transition-all active:scale-95 shadow-md shadow-red-100">
                 <Upload size={14}/> Upload Map
               </button>
               <button onClick={() => setIsEditMode(!isEditMode)} className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm hover:bg-red-50 transition-all active:scale-95">
                 <Pencil size={14}/> {isEditMode ? 'Exit Edit Mode' : 'Edit Map / Mark Hazards'}
               </button>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                {["1F", "2F", "3F", "4F"].map(f => (
                  <button key={f} onClick={() => setActiveFloor(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeFloor === f ? 'bg-white shadow-sm text-red-600' : 'text-slate-400 hover:text-slate-600'}`}>{f}</button>
                ))}
              </div>
              <div className="bg-red-700 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter flex items-center gap-2 animate-pulse">
                <div className="h-1.5 w-1.5 rounded-full bg-white" /> 2 Live Hazards
              </div>
            </div>
            {/* <div className="aspect-[21/9] bg-[#FAFAFA] rounded-2xl border border-slate-100 relative group cursor-crosshair transition-all hover:border-slate-300" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
               <div className="absolute top-1/2 left-1/3">
                 <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="h-10 w-10 bg-amber-400/20 rounded-full flex items-center justify-center border border-amber-400">
                   <Users size={16} className="text-amber-600" />
                 </motion.div>
               </div>
            </div> */}
            <div className="aspect-[21/9] bg-[#FAFAFA] rounded-2xl border border-slate-100 relative overflow-hidden">
  {mapUrl ? (
    <img 
      src={mapUrl} 
      alt={`Floor ${activeFloor}`} 
      className="absolute inset-0 w-full h-full object-contain" 
      onError={() => console.error("Image load failed for URL:", mapUrl)}
      key={activeFloor}
    />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-[10px]">
      No Map available for {activeFloor}. Please upload one.
    </div>
  )}
  
  {/* Trapped Users Dots yahan aayenge... */}
</div>
          </div>
        </motion.div>
        {/* <motion.div whileHover={{ boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05)" }} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 flex flex-wrap justify-between items-center border-b border-slate-50">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">Venue Floor Plans</h2>
              <p className="text-[10px] text-slate-500 font-medium">Upload PDF maps and mark danger zones for first responders.</p>
            </div>
            <div className="flex gap-2">
               <button className="bg-red-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-all active:scale-95 shadow-md shadow-red-100">
                 <Upload size={14}/> Upload Map
               </button>
               <button className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm hover:bg-red-50 transition-all active:scale-95">
                 <Pencil size={14}/> Edit Map / Mark Hazards
               </button>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                {["1F", "2F", "3F", "4F"].map(f => (
                  <button key={f} onClick={() => setActiveFloor(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeFloor === f ? 'bg-white shadow-sm text-red-600' : 'text-slate-400 hover:text-slate-600'}`}>{f}</button>
                ))}
              </div>
              <div className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter flex items-center gap-2 animate-pulse">
                <div className="h-1.5 w-1.5 rounded-full bg-white" /> 2 Live Hazards
              </div>
            </div>
            <div className="aspect-[21/9] bg-[#FAFAFA] rounded-2xl border border-slate-100 relative group cursor-crosshair transition-all hover:border-slate-300" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
               <div className="absolute top-1/2 left-1/3">
                 <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="h-10 w-10 bg-amber-400/20 rounded-full flex items-center justify-center border border-amber-400">
                   <Users size={16} className="text-amber-600" />
                 </motion.div>
               </div>
            </div>
          </div>
        </motion.div> */}

        {/* 5. Broadcast Center */}
        {/* <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
             <Megaphone size={14}/> Emergency Broadcast Center
           </h3>
           <textarea 
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              rows={3}
             placeholder="Type your emergency broadcast message here..."
             className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-red-100 min-h-[70px] transition-all"
           />
           <div className="grid grid-cols-2 gap-3 mt-4">
             <motion.button onClick={() => sendBroadcast('guest')} whileTap={{ scale: 0.98 }} className="w-full bg-red-50 border border-red-600 text-red-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Broadcast to All Guests</motion.button>
             <motion.button onClick={() => sendBroadcast('staff')} whileTap={{ scale: 0.98 }} className="w-full bg-red-50 border border-red-600 text-red-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Broadcast to All Staff</motion.button>
           </div>
        </div> */}
        <motion.div 
  initial={{ opacity: 0, scale: 0.98 }}
  animate={{ opacity: 1, scale: 1 }}
  className="relative overflow-hidden bg-slate-50/40 backdrop-blur-2xl rounded-[3rem] border border-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
>
  {/* Header Section */}
  <div className="flex items-center gap-3 mb-6 px-2">
    <div className="h-8 w-8 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shadow-sm border border-red-100">
      <Megaphone size={16} strokeWidth={3} />
    </div>
    <div>
      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-red-400/80 block leading-none">Command Center</span>
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mt-1">
        Emergency <span className="text-red-600">Broadcast</span>
      </h3>
    </div>
  </div>

  {/* Message Input Area */}
  <div className="relative group">
    <textarea 
      value={broadcastMsg}
      onChange={(e) => setBroadcastMsg(e.target.value)}
      rows={3}
      placeholder="Type your emergency broadcast message here..."
      className="w-full bg-white/60 backdrop-blur-sm border-2 border-slate-100 rounded-[2rem] p-5 text-sm font-bold text-red-900 placeholder:text-red-200 outline-none focus:border-red-200 focus:ring-4 focus:ring-red-50/50 min-h-[100px] transition-all resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
    />
    <div className="absolute bottom-4 right-5 flex gap-1 items-center opacity-30">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse"></span>
        <span className="text-[8px] font-black uppercase tracking-widest text-red-400">Live Input</span>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="grid grid-cols-2 gap-4 mt-6">
    <motion.button 
      onClick={() => sendBroadcast('guest')} 
      whileHover={{ y: -2, boxShadow: "0 10px 20px -10px rgba(220, 38, 38, 0.3)" }}
      whileTap={{ scale: 0.97 }} 
      className="group relative overflow-hidden w-full bg-white border-2 border-red-100 text-red-600 py-4 rounded-2xl text-[13px] font-black uppercase tracking-[0.15em] transition-all hover:bg-red-600 hover:text-white hover:border-red-600"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        📢 All Guests
      </span>
    </motion.button>

    <motion.button 
      onClick={() => sendBroadcast('staff')} 
      whileHover={{ y: -2, boxShadow: "0 10px 20px -10px rgba(220, 38, 38, 0.3)" }}
      whileTap={{ scale: 0.97 }} 
      className="group relative overflow-hidden w-full bg-white border-2 border-red-100 text-red-600 py-4 rounded-2xl text-[13px] font-black uppercase tracking-[0.15em] transition-all hover:bg-red-600 hover:text-white hover:border-red-600"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        🛡️ All Staff
      </span>
    </motion.button>
  </div>

  {/* Decorative Glow */}
  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-100/30 rounded-full blur-3xl -z-10" />
</motion.div>

        {/* 6. Staff & Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
          {/* <motion.div whileHover={{ y: -2 }} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest">Staff <span className="text-red-600">Directory</span></h3>
                <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-700 transition-all">+ Add Staff</button>
             </div>
             <div className="space-y-2">
               {[
                 { name: "Priya Sharma", role: "Floor Warden", icon: "P", status: "ON-DUTY" },
                 { name: "Arjun Khanna", role: "Security", icon: "A", status: "ON-DUTY" },
                 { name: "Meera Iyer", role: "Medical", icon: "M", status: "ON-DUTY" },
                 { name: "Daniel Cole", role: "Reception", icon: "D", status: "OFF-DUTY" },
               ].map((s) => (
                 <div key={s.name} className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-white hover:border-slate-200 transition-all">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-slate-400 text-xs font-black border border-slate-100 shadow-sm">{s.icon}</div>
                      <div>
                        <p className="text-xs font-black text-slate-800 leading-tight">{s.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.role}</p>
                      </div>
                   </div>
                   <div className={`text-[8px] font-black px-2 py-1 rounded-full border ${s.status === 'ON-DUTY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{s.status}</div>
                 </div>
               ))}
             </div>
          </motion.div> */}
          <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative overflow-hidden bg-slate-50/40 backdrop-blur-2xl rounded-[3rem] border border-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
  {/* Header: More Spacing & Clean Typography */}
  <div className="flex justify-between items-end mb-8 px-2">
  {/* <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar"> */}
    <div>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/80 mb-1 block">Operational Staff</span>
      <h2 className="text-xl font-black text-slate-900 tracking-tight">
        STAFF <span className="text-red-600 font-medium">DIRECTORY</span>
      </h2>
    </div>
    <button onClick={() => setIsAddModalOpen(true)} className="group relative flex items-center gap-2 bg-red-700 text-white px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:bg-red-600 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-red-200">
      <span className="group-hover:rotate-90 transition-transform duration-300">+</span>
      Add Member
    </button>
    {isAddModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
      className="bg-white/80 backdrop-blur-xl border border-white rounded-[40px] shadow-2xl w-full max-w-md p-8 overflow-hidden relative">
      
      <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Add New Staff</h2>
      
      <div className="space-y-4">
        <input placeholder="Full Name" className="w-full p-4 bg-slate-100/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium" 
          onChange={e => setNewMember({...newMember, fullName: e.target.value})} />
        
        <select className="w-full p-4 bg-slate-100/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium appearance-none"
          value={newMember.jobTitle}
          onChange={e => setNewMember({...newMember, jobTitle: e.target.value})}>
          <option value="Floor Warden">Floor Warden</option>
          <option value="Security">Security</option>
          <option value="Medical">Medical</option>
          <option value="Reception">Reception</option>
        </select>
        
        <input placeholder="Phone Number" className="w-full p-4 bg-slate-100/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
          onChange={e => setNewMember({...newMember, phone: e.target.value})} />
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
        <button onClick={handleAddMember} className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition-all">SAVE MEMBER</button>
      </div>
    </motion.div>
  </div>
)}
  </div>

  {/* Staff List */}
  <div className="space-y-4">
  {staffMembers.map((s) => {
    // Dynamic color picker based on role
    const getTheme = (job) => {
    //   if (role === 'Security') return "from-orange-400 to-red-500";
    //   if (role === 'Medical') return "from-rose-400 to-pink-600";
    //   if (role === 'Floor Warden') return "from-blue-500 to-indigo-600";
    //   return "from-slate-400 to-slate-600";
    const title = job?.toLowerCase(); // Case-insensitive check
    if (title?.includes('security')) return "from-orange-400 to-red-500";
    if (title?.includes('medical')) return "from-rose-400 to-pink-600";
    if (title?.includes('warden')) return "from-blue-500 to-indigo-600";
    return "from-slate-400 to-slate-600";
    };
const themeClass = getTheme(s.jobTitle);
    return (
      <motion.div 
        key={s.id} // Use Firestore ID
        whileHover={{ x: 8 }}
        className="group relative flex items-center justify-between p-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
        onClick={() => setSelectedMember(s)} // Member detail pop-up ke liye
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className={`h-12 w-12 bg-gradient-to-br ${themeClass} opacity-50 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300`}>
              {s.fullName?.charAt(0) || "U"}
            </div>
            <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-4 border-white ${s.status === 'on-duty' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          </div>
          
          <div>
            <p className="text-[14px] font-black text-slate-800 tracking-tight">{s.fullName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="h-1 w-1 bg-slate-300 rounded-full" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.jobTitle || "Staff"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`hidden md:block text-[9px] font-black px-3 py-1.5 rounded-xl uppercase ${
            s.status === 'on-duty' 
            ? 'bg-emerald-50 text-emerald-600' 
            : 'bg-slate-50 text-slate-400'
          }`}>
            {s.status}
          </div>
          
          {/* Action Menu (Three Dots) */}
          <div className="relative group/menu">
            <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-300 hover:text-slate-600 transition-colors">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            
            {/* Hover Actions Menu */}
            <div className="absolute right-0 top-0 hidden group-hover/menu:flex items-center gap-2 bg-white/80 backdrop-blur-md p-1 pr-10 rounded-full border border-slate-100 shadow-xl z-10 transition-all">
               <a href={`tel:${s.phone}`} className="h-8 w-8 flex items-center justify-center bg-emerald-500 text-white rounded-full hover:scale-110 transition-transform">
                 <svg fontSize={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
               </a>
            </div>
          </div>
        </div>
      </motion.div>
    );
  })}
</div>
  
</motion.div>

          {/* <motion.div whileHover={{ y: -2 }} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest">Key Emergency Contacts</h3>
                <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-700 transition-all">+ Add Contact</button>
             </div>
             <div className="space-y-2">
               {[
                 { name: "City Police HQ", num: "+91 100", type: "blue" },
                 { name: "Marine Fire Station", num: "+91 101", type: "red" },
                 { name: "Bombay Hospital ER", num: "+91 22 2206 7676", type: "emerald" },
                 { name: "Hotel Manager — R. Kapoor", num: "+91 98200 11248", type: "amber", active: true },
               ].map((c) => (
                 <div key={c.name} className={`flex items-center justify-between p-2.5 bg-slate-50/50 rounded-2xl border transition-all ${c.active ? 'border-red-200 bg-red-50/20' : 'border-slate-100/50 hover:bg-white hover:border-slate-200'}`}>
                   <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 bg-white rounded-full flex items-center justify-center text-${c.type}-500 border border-slate-100 shadow-sm`}>
                        {c.name.includes("Police") ? <Shield size={14}/> : c.name.includes("Fire") ? <Flame size={14}/> : c.name.includes("Hospital") ? <Stethoscope size={14}/> : <BriefcaseBusiness size={14}/>}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 leading-tight">{c.name}</p>
                        <p className="text-[9px] font-bold text-slate-400">{c.num}</p>
                      </div>
                   </div>
                   <div className="flex gap-1.5">
                      <button className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"><Phone size={14}/></button>
                      <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><MessageSquare size={14}/></button>
                      <button className="p-1.5 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-all"><Share2 size={12}/></button>
                   </div>
                 </div>
               ))}
             </div>
          </motion.div> */}
          <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative overflow-hidden bg-slate-50/40 backdrop-blur-2xl rounded-[3rem] border border-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
>
  {/* Header Section */}
  <div className="flex justify-between items-end mb-8 px-2">
    <div>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/80 mb-1 block">Quick Response</span>
      <h2 className="text-xl font-black text-slate-900 tracking-tight">
        KEY <span className="text-red-600 font-medium">EMERGENCY</span>
      </h2>
    </div>
    <button 
      onClick={() => setIsContactModalOpen(true)}
    className="group flex items-center gap-2 bg-red-700 text-white px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:bg-red-600 transition-all duration-300 shadow-lg shadow-slate-200">
      <span className="group-hover:scale-125 transition-transform">+</span>
      Add Contact
    </button>
  </div>

  {/* Contacts List */}
  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
  {emergencyContacts.map((contact) => {
    // Category wise icon and color logic
    const getIconDetails = (cat) => {
      switch(cat) {
        case 'Police': return { icon: <Shield size={20}/>, color: "bg-blue-50 text-blue-500" };
        case 'Fire': return { icon: <Flame size={20}/>, color: "bg-orange-50 text-orange-500" };
        case 'Medical': return { icon: <Activity size={20}/>, color: "bg-emerald-50 text-emerald-500" };
        default: return { icon: <Briefcase size={20}/>, color: "bg-amber-50 text-amber-500" };
      }
    };
    const details = getIconDetails(contact.category);

    return (
      <div key={contact.id} className="flex items-center justify-between p-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-5">
          {/* Circular Icon Area */}
          <div className={`h-14 w-14 rounded-full flex items-center justify-center ${details.color}`}>
            {details.icon}
          </div>
          <div>
            <h4 className="text-[15px] font-black text-slate-800">{contact.name}</h4>
            <p className="text-[11px] font-bold text-slate-400 mt-0.5">{contact.phone}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <a href={`tel:${contact.phone}`} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
            <Phone size={18} />
          </a>
          <a href={`sms:${contact.phone}`} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
            <MessageSquare size={18} />
          </a>
          <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-colors ml-2">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    );
  })}
</div>
{isContactModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
      className="bg-white/90 backdrop-blur-2xl border border-white rounded-[40px] shadow-2xl w-full max-w-md p-8 relative">
      
      <h2 className="text-2xl font-black text-slate-900 mb-6">Add Emergency Contact</h2>
      
      <div className="space-y-4">
        <input placeholder="Service Name (e.g. City Police)" className="w-full p-4 bg-slate-100/50 rounded-2xl outline-none focus:ring-2 focus:ring-red-500" 
          onChange={e => setNewContact({...newContact, name: e.target.value})} />
        
        <input placeholder="Phone Number" className="w-full p-4 bg-slate-100/50 rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
          onChange={e => setNewContact({...newContact, phone: e.target.value})} />

        <select className="w-full p-4 bg-slate-100/50 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 appearance-none"
          onChange={e => setNewContact({...newContact, category: e.target.value})}>
          <option value="Police">Police</option>
          <option value="Fire">Fire Service</option>
          <option value="Medical">Medical / Hospital</option>
          <option value="Manager">Management</option>
        </select>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={() => setIsContactModalOpen(false)} className="flex-1 py-4 text-slate-500 font-bold">Cancel</button>
        <button onClick={handleAddContact} className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all">ADD CONTACT</button>
      </div>
    </motion.div>
  </div>
)}
  
</motion.div>
        </div>

        {/* 7. Gemini AI Insight */}
        {/* <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-r from-blue-50/50 via-white to-red-50/50 rounded-3xl border border-blue-100 p-5 shadow-sm relative overflow-hidden">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-tr from-blue-600 to-red-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-100">
                  <Sparkles size={14}/>
                </div>
                <h3 className="text-[13px] font-black uppercase tracking-widest flex items-center gap-2">
                  Gemini AI Insight <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full lowercase text-[10px] tracking-normal font-bold">Live - Vertex AI</span>
                </h3>
              </div>
              <button className="text-[10px] font-black uppercase flex items-center gap-1 text-slate-400 border border-slate-200 px-2 py-1 rounded-lg hover:bg-white transition-all"><Clock size={10}/> Refresh</button>
           </div>
           <p className="text-base font-bold text-slate-700 leading-relaxed max-w-5xl">
             Evacuation 70% complete. Prioritize evacuation of 4th floor due to active fires and heavy smoke, specifically addressing trapped persons and the 3rd floor stairwell bottleneck.
           </p>
           <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1 text-[11px] font-black text-red-500 uppercase tracking-widest">
                <Radio size={12} className="animate-pulse"/> Recommendation auto-generated by Gemini 1.5 Flash
              </div>
              <span className="text-[10px] font-bold text-slate-300">Updated 10:59:11 PM</span>
           </div>
        </motion.div> */}
        <motion.div className="bg-white/60 opacity-90 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
  <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-3">
      {/* Gemini Gradient Icon */}
      <div className="h-10 w-10 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-100">
        <Sparkles size={20} className="text-white" />
      </div>
      <div>
        <div className="flex items-center gap-2">
           <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Gemini AI Insight</h2>
           <span className="px-2 py-0.5 bg-emerald-50 text-emerald-500 text-[8px] font-black rounded-full uppercase">live - vertex ai</span>
        </div>
      </div>
    </div>
    
    <button 
      onClick={fetchAIInsight}
      disabled={isAnalyzing}
      className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-bold text-slate-500 transition-all active:scale-95"
    >
      <RefreshCw size={12} className={isAnalyzing ? "animate-spin" : ""} /> REFRESH
    </button>
  </div>

  <p className="text-slate-700 text-base font-bold leading-relaxed tracking-tight">
    {aiInsight}
  </p>
  
  <div className="mt-6 flex justify-between items-center border-t border-slate-50 pt-4">
    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
      <div className="h-1 w-1 bg-red-500 rounded-full animate-ping" />
      Recommendation Auto-generated by Gemini 1.5 Flash
    </p>
    <p className="text-[9px] font-bold text-slate-300">
      Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </p>
  </div>
</motion.div>
        
        
        {/* 8. Activity Log */}
        {/* <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest">Activity Log</h3>
            <button className="text-[9px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1 hover:underline">View All Records <ChevronRight size={10}/></button>
          </div>
          <div className="space-y-2">
            {[
              { msg: "Guest in Room 305 reported smoke in Staircase B.", type: "danger", time: "14:32", label: "Initial Report", icon: AlertTriangle },
              { msg: "Evacuation broadcast sent to Floors 3-6.", type: "warning", time: "14:35", label: "Broadcast", icon: Megaphone },
              { msg: "Staff member Priya marked Floor 5 as cleared.", type: "success", time: "14:38", label: "Staff Update", icon: CheckCircle2 },
            ].map((l, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-white hover:border-slate-300 transition-all cursor-default">
                <div className="flex items-center gap-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${l.type === 'danger' ? 'bg-red-50 text-red-500 border-red-100' : l.type === 'warning' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
                    <l.icon size={14}/>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{l.msg}</p>
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none bg-white px-2 py-0.5 rounded border border-slate-100 mt-1 inline-block">{l.label}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">{l.time}</span>
              </div>
            ))}
          </div>
        </div> */}
        <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative overflow-hidden bg-slate-50/40 backdrop-blur-2xl rounded-[3rem] border border-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)] mb-12 "
>
  {/* Header Section */}
  <div className="flex justify-between items-end mb-8 px-2">
    <div>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 block">Real-time Monitoring</span>
      <h2 className="text-xl font-black text-slate-900 tracking-tight">
        Activity <span className="text-red-600">Log</span>
      </h2>
    </div>

{selectedLog && (
  <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/20 backdrop-blur-md">
    <motion.div 
      layoutId={selectedLog.id}
      className="bg-white rounded-[2.5rem] p-8 shadow-2xl w-full max-w-sm border border-slate-100"
    >
      <div className="h-16 w-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
        <Info size={32} />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">Event Intelligence</h3>
      <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
        {selectedLog.msg}
      </p>
      
      <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
           <span>Timestamp</span>
           <span className="text-slate-900">{selectedLog.timestamp?.toDate().toLocaleTimeString()}</span>
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
           <span>Severity</span>
           <span className="text-red-600">{selectedLog.type === 'danger' ? 'High' : 'Normal'}</span>
        </div>
      </div>

      <button 
        onClick={() => setSelectedLog(null)}
        className="w-full mt-6 py-4 bg-slate-900 text-white font-black rounded-2xl active:scale-95 transition-transform"
      >
        DISMISS
      </button>
    </motion.div>
  </div>
)}
    <button
    onClick={() => setIsAllRecordsOpen(true)} 
    className="group flex items-center gap-1.5 text-[10px] font-black text-red-600 uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl transition-all">
      View All Records 
      <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/>
    </button>
  </div>

  {/* Activity Timeline */}
  <div className="relative space-y-4">
    <div className="absolute left-10 top-2 bottom-2 w-[1px] bg-slate-100 hidden md:block" />

    {/* Yahan Dynamic Logs use ho rahe hain */}
    {logs.map((l, i) => {
      // Logic for dynamic icons and colors based on type
      const config = {
        danger: { icon: AlertTriangle, color: "from-red-400 to-rose-600", label: "Initial Report" },
        warning: { icon: Megaphone, color: "from-amber-400 to-orange-500", label: "Broadcast" },
        success: { icon: CheckCircle2, color: "from-emerald-400 to-teal-600", label: "Staff Update" },
      }[l.type] || { icon: Info, color: "from-slate-400 to-slate-600", label: "System Info" };

      const Icon = config.icon;

      return (
        <motion.div
        onClick={() => setSelectedLog(l)}
          key={l.id} 
          whileHover={{ x: 10 }}
          className="group relative flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-slate-100 hover:border-red-100 hover:bg-white hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-5">
            <div className="relative z-10">
              <div className={`h-11 w-11 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={18} />
              </div>
              {/* Latest log ke liye pulsing indicator */}
              {i === 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${l.type === 'danger' ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${l.type === 'danger' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-[13px] font-black text-slate-800 leading-tight group-hover:text-red-600 transition-colors">
                {l.msg}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.15em] bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 group-hover:bg-red-50 group-hover:text-red-500 group-hover:border-red-100 transition-colors">
                  {l.label || config.label}
                </span>
                <span className="md:hidden text-[10px] font-bold text-slate-400">
                  {l.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <span className="text-[11px] font-black text-slate-900 tracking-tighter">
              {l.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Received</span>
          </div>
        </motion.div>
      );
    })}
  </div>
   
</motion.div>
        

      </main>

      {/* FOOTER IS BACK */}
      <BottomNav />
    </div>
  );
};

export default AdminDashboard;