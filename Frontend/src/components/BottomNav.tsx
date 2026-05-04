// import { NavLink, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Icon } from "./Icon";
// import { useI18n } from "../i18n/I18nProvider";

// export const BottomNav = () => {
//   const location = useLocation();
//   const { t } = useI18n();
  
//   // 1. URL Path se current role detect karein
//   const getActiveRole = () => {
//     const path = location.pathname;
//     if (path.includes("admin")) return "admin";
//     if (path.includes("staff")) return "staff";
//     if (path.includes("guest") || path === "/profile") return "guest"; // Profile page ko guest hi maanein
//     return localStorage.getItem("userRole")?.toLowerCase() || "guest";
//   };

//   const userRole = getActiveRole();

//   const items = [
//     { to: "/", icon: "home", label: t("nav.home") },
//     { to: "/safety-map", icon: "map", label: t("nav.map") },
//     { to: "/emergency", icon: "emergency_home", label: t("nav.sos") },
    
//     // Role based Profile link
//     { 
//       to: userRole === "admin" 
//           ? "/admin-profile" 
//           : userRole === "staff" 
//           ? "/staff-profile" 
//           : "/profile",
//       icon: "person", 
//       label: t("nav.profile") 
//     },
    
//     // 2. Role based Dashboard link (Ab ye hamesha current path ke hisab se dikhega)
//     { 
//       to: userRole === "admin"
//           ? "/admin-dashboard"
//           : userRole === "staff"
//           ? "/staff-dashboard"
//           : "/guest-dashboard",

//       icon: "dashboard", 
//       label: userRole === "admin" ? "Admin" : userRole === "staff" ? "Staff" : "Guest",
//       isAuthority: userRole === "staff" || userRole === "admin" 
//     },
//   ];
//   // const user = getRoleFromPath();

//   const getRoleFromPath = () => {
//     const path = location.pathname;

//     // 1. URL based detection (High Priority)
//     if (path.includes("admin")) return "admin";
//     if (path.includes("staff")) return "staff";
//     if (path.includes("guest")) return "guest";

//     // 2. Neutral Pages (like /safety-map or /profile)
//     // Yahan hum local storage se real role uthayenge jo login ke waqt set hua tha
//     const storedRole = localStorage.getItem("userRole")?.toLowerCase();
    
//     if (storedRole === "owner" || storedRole === "admin") return "admin";
//     if (storedRole === "staff") return "staff";
    
//     return "guest"; // Default fallback
//   };
  

//   return (
//     <motion.nav
//       initial={{ y: 100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/85 backdrop-blur-xl"
//     >
//       <div className="mx-auto flex max-w-2xl items-center justify-around px-2 pb-4 pt-2">
//         {items.map((item) => {
//           const active = location.pathname === item.to;
//           const isSos = item.to === "/emergency";
          
//           return (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               className="relative flex min-w-[56px] flex-col items-center gap-1 px-2 py-1.5"
//             >
//               {isSos ? (
//                 <div className="relative -mt-6">
//                   <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg ring-4 ring-white">
//                     <Icon name="emergency_home" filled className="text-white" />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="relative flex h-9 w-9 items-center justify-center">
//                   {active && (
//                     <motion.span
//                       layoutId="navActive"
//                       className={`absolute inset-0 rounded-xl ${item.isAuthority ? 'bg-red-50' : 'bg-primary/10'}`}
//                     />
//                   )}
//                   <Icon
//                     name={item.icon}
//                     filled={active}
//                     className={`relative text-[22px] ${active ? (item.isAuthority ? 'text-red-600' : 'text-blue-600') : 'text-slate-400'}`}
//                   />
//                 </div>
//               )}
//               <span className={`text-[10px] font-bold ${active && !isSos ? (item.isAuthority ? 'text-red-600' : 'text-blue-600') : 'text-slate-400'}`}>
//                 {item.label}
//               </span>
//             </NavLink>
//           );
//         })}
//       </div>
//     </motion.nav>
//   );
// };


import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "./Icon";
import { useI18n } from "../i18n/I18nProvider";

export const BottomNav = () => {
  const location = useLocation();
  const { t } = useI18n();
  
  // ✅ Bullet-Proof Role Detection Logic
  const getCurrentRole = () => {
    const path = location.pathname;

    // 1. Sabse pehle URL dekho (High Priority)
    if (path.includes("admin")) return "admin";
    if (path.includes("staff")) return "staff";
    if (path.includes("guest")) return "guest";

    // 2. Agar Neutral page (Map/Profile) par ho, toh localStorage check karo
    // Yahan hum wahi role pick karenge jo login ke waqt set hua tha
    const storedRole = localStorage.getItem("userRole")?.toLowerCase();
    
    if (storedRole === "owner" || storedRole === "admin") return "admin";
    if (storedRole === "staff") return "staff";
    
    return "guest"; // Default fallback
  };

  const userRole = getCurrentRole();

  const items = [
    { to: "/", icon: "home", label: t("nav.home") },
    { to: "/safety-map", icon: "map", label: t("nav.map") },
    { to: "/emergency", icon: "emergency_home", label: t("nav.sos") },
    
    // Dynamic Profile Link
    { 
      to: userRole === "admin" 
          ? "/admin-profile" 
          : userRole === "staff" 
          ? "/staff-profile" 
          : "/profile",
      icon: "person", 
      label: t("nav.profile") 
    },
    
    // Dynamic Dashboard Link (Hamesha active role dikhayega)
    { 
      to: userRole === "admin"
          ? "/admin-dashboard"
          : userRole === "staff"
          ? "/staff-dashboard"
          : "/guest-dashboard",

      icon: "dashboard", 
      label: userRole.charAt(0).toUpperCase() + userRole.slice(1),
      isAuthority: userRole === "staff" || userRole === "admin" 
    },
  ];

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 pb-4 pt-2">
        {items.map((item) => {
          // Check if active based on path OR role-specific context
          const active = location.pathname === item.to;
          const isSos = item.to === "/emergency";
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex min-w-[56px] flex-col items-center gap-1 px-2 py-1.5"
            >
              {isSos ? (
                <div className="relative -mt-6">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg ring-4 ring-white">
                    <Icon name="emergency_home" filled className="text-white" />
                  </div>
                </div>
              ) : (
                <div className="relative flex h-9 w-9 items-center justify-center">
                  {active && (
                    <motion.span
                      layoutId="navActive"
                      className={`absolute inset-0 rounded-xl ${item.isAuthority ? 'bg-red-50' : 'bg-blue-50'}`}
                    />
                  )}
                  <Icon
                    name={item.icon}
                    filled={active}
                    className={`relative text-[22px] ${active ? (item.isAuthority ? 'text-red-600' : 'text-blue-600') : 'text-slate-400'}`}
                  />
                </div>
              )}
              <span className={`text-[10px] font-bold ${active && !isSos ? (item.isAuthority ? 'text-red-600' : 'text-blue-600') : 'text-slate-400'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </motion.nav>
  );
};