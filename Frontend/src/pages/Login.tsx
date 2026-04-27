// import React, { useState } from "react";
// import { motion, type Variants } from "framer-motion";
// import { User, Lock, ArrowRight, ShieldCheck } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import "../style/LoginPage.css";
// import { useI18n } from "../i18n/I18nProvider";
// import { auth } from "../config/firebase"; // Aapki firebase config file
// import { signInWithEmailAndPassword } from "firebase/auth";

// const cardVariants: Variants = {
//   initial: { rotateY: -90, x: "15%", opacity: 0, skewY: -5 },
//   animate: { 
//     rotateY: 0, x: 0, opacity: 1, skewY: 0,
//     transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
//   },
//   exit: { 
//     rotateY: 90, x: "-15%", opacity: 0, skewY: 5,
//     transition: { duration: 0.5, ease: "easeIn" }
//   },
// };

// const bubbleAnimate = (xRange: number[], yRange: number[], duration: number) => ({
//   animate: { x: xRange, y: yRange },
//   transition: { 
//     duration: duration / 2, 
//     repeat: Infinity, 
//     repeatType: "reverse" as const,
//     ease: "easeInOut" as const,
//   }
// });

// // export default function LoginPage() {
// //   const navigate = useNavigate();
// //   const [role, setRole] = useState("guest");
// //   const { t } = useI18n();

// //   const handleLogin = () => {
// //     localStorage.setItem("userRole", role);
// //     if (role === "guest") navigate("/guest-dashboard");
// //     else if (role === "staff") navigate("/staff-dashboard");
// //     else if (role === "admin") navigate("/admin-dashboard");
// //   };

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [role, setRole] = useState("guest");
//   const [email, setEmail] = useState(""); // Username se Email change kiya
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { t } = useI18n();

//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       // 1. Firebase Login
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // 2. Token se Role extract karna (Custom Claims)
//       const idTokenResult = await user.getIdTokenResult();
//       const userRole = idTokenResult.claims.role || role; 

//       // 3. Navigation Logic
//       if (userRole === "admin") navigate("/admin-dashboard");
//       else if (userRole === "staff") navigate("/staff-dashboard");
//       else navigate("/guest-dashboard");

//     } catch (error: any) {
//       alert("Login Failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page-root" style={{ 
//       minHeight: "100vh", 
//       display: "flex", 
//       alignItems: "center", 
//       justifyContent: "center",
//       padding: "20px"
//     }}>
//       <button className="back-btn" onClick={() => navigate("/")} style={{ position: "fixed", top: "20px", left: "20px" }}>
//         {t("common.backToHome")}
//       </button>

//       <div className="perspective-container" style={{ maxWidth: "900px", width: "100%" }}>
//         <motion.div 
//           className="auth-card"
//           // height adjust kiya hai aur overflows ko visible rakha hai
//           style={{ height: "auto", minHeight: "550px", display: "flex", overflow: "hidden", position: "relative" }}
//           initial="initial" animate="animate" exit="exit" variants={cardVariants}
//         >
//           {/* Sidebar Section */}
//           <div className="auth-sidebar" style={{ flex: "0 0 35%", position: "relative" }}>
//             <div className="sidebar-overlay" />
//             <motion.div className="bubble b1" {...bubbleAnimate([0, 15], [0, 25], 4)} />
//             <motion.div className="bubble b2" {...bubbleAnimate([0, -20], [0, -30], 6)} />
//             <motion.div className="bubble b3" {...bubbleAnimate([0, 10], [0, 15], 5)} />
//             <motion.div className="bubble b4" {...bubbleAnimate([0, -10], [0, 20], 7)} />
            
//             <div style={{ zIndex: 10, position: "relative", padding: "40px 25px" }}>
//                 <h2 className="sidebar-title" style={{ fontSize: "2.2rem", color: "white" }}>{t("login.welcomeBack")}</h2>
//                 <p className="sidebar-subtitle" style={{ marginTop: "15px", color: "white", opacity: 0.9 }}>{t("login.sidebarSubtitle")}</p>
//             </div>
//           </div>

//           {/* Form Section */}
//           <div className="auth-form-area" style={{ 
//             flex: "1", 
//             padding: "2.5rem 3rem", 
//             display: "flex", 
//             flexDirection: "column", 
//             justifyContent: "center" 
//           }}>
//             <header className="form-header" style={{ marginBottom: "1.5rem" }}>
//               <h3 className="form-category" style={{ fontSize: "0.75rem", color: "#e63946" }}>{t("login.platformAccess")}</h3>
//               <h1 className="form-title" style={{ fontSize: "2rem", margin: "5px 0" }}>{t("login.title")}</h1>
//             </header>

//             {/* Role Selector */}
//             <div className="role-selector" style={{ marginBottom: "1.2rem" }}>
//               <label className="input-label" style={{ marginBottom: "6px", display: "block" }}>{t("login.loginAs")}</label>
//               <div className="input-field-wrapper">
//                 <div className="input-icon"><ShieldCheck size={18} /></div>
//                 <select 
//                   value={role} 
//                   onChange={(e) => setRole(e.target.value)} 
//                   className="role-dropdown"
//                   style={{ paddingLeft: "3.5rem", width: "100%" }}
//                 >
//                   <option value="guest">{t("role.guest")}</option>
//                   <option value="staff">{t("role.staff")}</option>
//                   <option value="admin">{t("role.admin")}</option>
//                 </select>
//               </div>
//             </div>

//             <div className="form-inputs" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//               <Input icon={<User />} label="Email" placeholder="your_name" value={email} onChange={(e: any) => setEmail(e.target.value)} />
//               <Input icon={<Lock />} label="Password" type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} />

//               <button className="btn-submit" onClick={handleLogin} style={{ marginTop: "0.5rem", width: "100%", height: "48px" }}>
//                 {t("login.signInAs", { role: t(`role.${role}`) })} <ArrowRight size={20} style={{ marginLeft: "8px" }} />
//               </button>
//             </div>

//             <footer className="form-footer" style={{ marginTop: "1.5rem", textAlign: "center" }}>
//               <span style={{ fontSize: "0.9rem" }}>{t("login.noAccount")}</span>
//               <button 
//                 onClick={() => navigate("/signup")} 
//                 className="toggle-btn" 
//                 style={{ fontWeight: "bold", marginLeft: "8px", color: "#e63946", border: "none", background: "none", cursor: "pointer" }}
//               >
//                 {t("login.createOne")}
//               </button>
//             </footer>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// // function Input({ icon, label, type = "text", placeholder }) {
// //   return (
// //     <div className="input-group">
// //       <label className="input-label" style={{ fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>{label}</label>
// //       <div className="input-field-wrapper" style={{ marginTop: "5px" }}>
// //         <div className="input-icon" style={{ left: "12px" }}>
// //           {React.cloneElement(icon, { size: 18 })}
// //         </div>
// //         <input type={type} placeholder={placeholder} className="input-field" style={{ height: "42px", borderRadius: "10px" }} />
// //       </div>
// //     </div>
// //   );
// // }

// function Input({ icon, label, type = "text", placeholder, value, onChange }) {
//   return (
//     <div className="input-group">
//       <label className="input-label">{label}</label>
//       <div className="input-field-wrapper">
//         <div className="input-icon">
//           {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
//         </div>
//         <input 
//           type={type} 
//           placeholder={placeholder} 
//           value={value} 
//           onChange={onChange} // This is crucial for React state
//           className="input-field" 
//         />
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { User, Lock, ArrowRight, ShieldCheck, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../style/LoginPage.css";
import { useI18n } from "../i18n/I18nProvider";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("guest");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idTokenResult = await user.getIdTokenResult();
      const userRole = idTokenResult.claims.role || role; 

      if (userRole === "admin") navigate("/admin-dashboard");
      else if (userRole === "staff") navigate("/staff-dashboard");
      else navigate("/guest-dashboard");

    } catch (error: any) {
      alert("Login Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-root" style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      background: "#FDF8F8", // Soft emergency red tint
      padding: isMobile ? "15px" : "20px",
    }}>
      {/* Dynamic Back Button */}
      <button 
        onClick={() => navigate("/")} 
        style={{ 
          position: "absolute", top: "20px", left: "20px",
          display: "flex", alignItems: "center", gap: "5px",
          background: "white", border: "1px solid #eee", padding: "8px 15px",
          borderRadius: "12px", fontSize: "12px", fontWeight: "bold", color: "#e63946",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", zIndex: 100
        }}
      >
        <ChevronLeft size={16} /> {t("common.backToHome")}
      </button>

      <div style={{ maxWidth: "1000px", width: "100%", display: "flex", justifyContent: "center" }}>
        <motion.div 
          style={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            width: "100%",
            maxWidth: isMobile ? "400px" : "900px",
            background: "white",
            borderRadius: isMobile ? "32px" : "24px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(230, 57, 70, 0.15)",
            border: "1px solid rgba(255,255,255,0.7)"
          }}
          initial="initial" animate="animate" variants={cardVariants}
        >
          
          {/* Sidebar / Top Banner */}
          <div style={{ 
            flex: isMobile ? "none" : "0 0 38%", 
            height: isMobile ? "160px" : "600px",
            background: "linear-gradient(135deg, #e63946 0%, #f59e0b 100%)",
            position: "relative",
            padding: isMobile ? "30px 20px" : "50px 35px",
            display: "flex",
            flexDirection: "column",
            justifyContent: isMobile ? "center" : "flex-end"
          }}>
            {/* Decorative circles for that high-tech feel */}
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
            
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 style={{ fontSize: isMobile ? "1.8rem" : "2.8rem", color: "white", fontWeight: 900, lineHeight: 1 }}>
                {t("login.welcomeBack")}
              </h2>
              {!isMobile && (
                <p style={{ marginTop: "20px", color: "rgba(255,255,255,0.9)", fontSize: "1rem", lineHeight: 1.6 }}>
                  {t("login.sidebarSubtitle")}
                </p>
              )}
            </div>
          </div>

          {/* Form Area */}
          <div style={{ 
            flex: 1, 
            padding: isMobile ? "2rem 1.5rem" : "3.5rem 4rem",
            display: "flex",
            flexDirection: "column"
          }}>
            <header style={{ marginBottom: "2rem" }}>
              <span style={{ color: "#e63946", fontSize: "11px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase" }}>
                {t("login.platformAccess")}
              </span>
              <h1 style={{ fontSize: isMobile ? "1.8rem" : "2.4rem", fontWeight: 900, color: "#1e293b", margin: "5px 0" }}>
                {t("login.title")}
              </h1>
            </header>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              
              {/* Role Dropdown */}
              <div style={{ textAlign: "left" }}>
                <label style={{ fontSize: "11px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", display: "block", marginLeft: "4px" }}>
                  {t("login.loginAs")}
                </label>
                <div style={{ position: "relative" }}>
                  <ShieldCheck size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#e63946", zIndex: 2 }} />
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    style={{ 
                      width: "100%", height: "54px", paddingLeft: "3.2rem", borderRadius: "16px", 
                      border: "1.5px solid #f1f5f9", fontSize: "14px", fontWeight: "bold", color: "#334155",
                      appearance: "none", background: "#f8fafc", cursor: "pointer", outline: "none"
                    }}
                  >
                    <option value="guest">{t("role.guest")}</option>
                    <option value="staff">{t("role.staff")}</option>
                    <option value="admin">{t("role.admin")}</option>
                  </select>
                </div>
              </div>

              <CustomInput icon={<User />} label="Email Address" placeholder="alex@sentinel.com" value={email} onChange={(e:any) => setEmail(e.target.value)} />
              <CustomInput icon={<Lock />} label="Password" type="password" placeholder="••••••••" value={password} onChange={(e:any) => setPassword(e.target.value)} />

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                style={{ 
                  marginTop: "1rem", height: "56px", borderRadius: "18px", 
                  background: "#1e293b", color: "white", fontSize: "14px", fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  border: "none", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(30, 41, 59, 0.2)"
                }}
              >
                {loading ? "..." : t("login.signInAs", { role: t(`role.${role}`) })}
                <ArrowRight size={18} />
              </motion.button>
            </div>

            <footer style={{ marginTop: "2.5rem", textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: "#64748b", fontWeight: "bold" }}>
                {t("login.noAccount")}
                <button 
                  onClick={() => navigate("/signup")} 
                  style={{ marginLeft: "6px", color: "#e63946", fontWeight: 900, background: "none", border: "none", cursor: "pointer" }}
                >
                  {t("login.createOne")}
                </button>
              </p>
            </footer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function CustomInput({ icon, label, type = "text", placeholder, value, onChange }: any) {
  return (
    <div style={{ textAlign: "left" }}>
      <label style={{ fontSize: "11px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", display: "block", marginLeft: "4px" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", zIndex: 2 }}>
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <input 
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{ 
            width: "100%", height: "54px", paddingLeft: "3.2rem", borderRadius: "16px", 
            border: "1.5px solid #f1f5f9", fontSize: "14px", fontWeight: "600", color: "#334155",
            background: "#f8fafc", outline: "none", transition: "all 0.2s"
          }} 
        />
      </div>
    </div>
  );
}