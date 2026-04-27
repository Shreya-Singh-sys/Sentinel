import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "./Icon";
import { useI18n } from "../i18n/I18nProvider";

export const BottomNav = () => {
  const location = useLocation();
  const { t } = useI18n();
  
  // 1. Dynamic Role Detection
  const rawUserRole = localStorage.getItem("userRole") || "guest";
  const userRole = rawUserRole.toLowerCase() === "owner" ? "admin" : rawUserRole.toLowerCase();

  const items = [
    { to: "/", icon: "home", label: t("nav.home") },
    { to: "/safety-map", icon: "map", label: t("nav.map") },
    { to: "/emergency", icon: "emergency_home", label: t("nav.sos") },
    
    // 2. Role based Profile link
    { 
      to: userRole === "admin" 
          ? "/admin-profile" 
          : userRole === "staff" 
          ? "/staff-profile" 
          : "/profile", // Guest ke liye default
      icon: "person", 
      label: t("nav.profile") 
    },
    
    // 3. Role based Dashboard link
    { 
      to: userRole === "admin"
          ? "/admin-dashboard"
          : userRole === "staff"
          ? "/staff-dashboard"
          : "/guest-dashboard",

      icon: "dashboard", 
      label: t(`role.${userRole}`),
      isAuthority: userRole === "staff" || userRole === "admin" 
    },
  ];

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/85 backdrop-blur-xl font-sans"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 pb-4 pt-2">
        {items.map((item) => {
          const active = location.pathname === item.to;
          const isSos = item.to === "/emergency";
          
          const highlightColor = item.isAuthority ? "text-red-600" : "text-primary";
          const bgColor = item.isAuthority ? "bg-red-50" : "bg-primary/10";

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex min-w-[56px] flex-col items-center gap-1 px-2 py-1.5"
            >
              {isSos ? (
                <div className="relative -mt-6">
                  <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg ring-4 ring-white">
                    <Icon name="emergency_home" filled className="text-white" weight={700} />
                  </div>
                </div>
              ) : (
                <div className="relative flex h-9 w-9 items-center justify-center">
                  {active && (
                    <motion.span
                      layoutId="navActive"
                      className={`absolute inset-0 rounded-xl ${bgColor}`}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <Icon
                    name={item.icon}
                    filled={active}
                    className={`relative text-[22px] transition-colors ${
                      active ? highlightColor : "text-slate-400"
                    }`}
                  />
                </div>
              )}
              <span className={`text-[10px] font-bold ${
                active && !isSos ? highlightColor : "text-slate-400"
              }`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </motion.nav>
  );
};