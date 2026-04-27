import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { User, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../style/LoginPage.css";
import { useI18n } from "../i18n/I18nProvider";
import { auth } from "../config/firebase"; // Aapki firebase config file
import { signInWithEmailAndPassword } from "firebase/auth";

const cardVariants: Variants = {
  initial: { rotateY: -90, x: "15%", opacity: 0, skewY: -5 },
  animate: { 
    rotateY: 0, x: 0, opacity: 1, skewY: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
  },
  exit: { 
    rotateY: 90, x: "-15%", opacity: 0, skewY: 5,
    transition: { duration: 0.5, ease: "easeIn" }
  },
};

const bubbleAnimate = (xRange: number[], yRange: number[], duration: number) => ({
  animate: { x: xRange, y: yRange },
  transition: { 
    duration: duration / 2, 
    repeat: Infinity, 
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  }
});

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [role, setRole] = useState("guest");
//   const { t } = useI18n();

//   const handleLogin = () => {
//     localStorage.setItem("userRole", role);
//     if (role === "guest") navigate("/guest-dashboard");
//     else if (role === "staff") navigate("/staff-dashboard");
//     else if (role === "admin") navigate("/admin-dashboard");
//   };

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("guest");
  const [email, setEmail] = useState(""); // Username se Email change kiya
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const handleLogin = async () => {
    setLoading(true);
    try {
      // 1. Firebase Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Token se Role extract karna (Custom Claims)
      const idTokenResult = await user.getIdTokenResult();
      const userRole = idTokenResult.claims.role || role; 

      // 3. Navigation Logic
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
      alignItems: "center", 
      justifyContent: "center",
      padding: "20px"
    }}>
      <button className="back-btn" onClick={() => navigate("/")} style={{ position: "fixed", top: "20px", left: "20px" }}>
        {t("common.backToHome")}
      </button>

      <div className="perspective-container" style={{ maxWidth: "900px", width: "100%" }}>
        <motion.div 
          className="auth-card"
          // height adjust kiya hai aur overflows ko visible rakha hai
          style={{ height: "auto", minHeight: "550px", display: "flex", overflow: "hidden", position: "relative" }}
          initial="initial" animate="animate" exit="exit" variants={cardVariants}
        >
          {/* Sidebar Section */}
          <div className="auth-sidebar" style={{ flex: "0 0 35%", position: "relative" }}>
            <div className="sidebar-overlay" />
            <motion.div className="bubble b1" {...bubbleAnimate([0, 15], [0, 25], 4)} />
            <motion.div className="bubble b2" {...bubbleAnimate([0, -20], [0, -30], 6)} />
            <motion.div className="bubble b3" {...bubbleAnimate([0, 10], [0, 15], 5)} />
            <motion.div className="bubble b4" {...bubbleAnimate([0, -10], [0, 20], 7)} />
            
            <div style={{ zIndex: 10, position: "relative", padding: "40px 25px" }}>
                <h2 className="sidebar-title" style={{ fontSize: "2.2rem", color: "white" }}>{t("login.welcomeBack")}</h2>
                <p className="sidebar-subtitle" style={{ marginTop: "15px", color: "white", opacity: 0.9 }}>{t("login.sidebarSubtitle")}</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="auth-form-area" style={{ 
            flex: "1", 
            padding: "2.5rem 3rem", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center" 
          }}>
            <header className="form-header" style={{ marginBottom: "1.5rem" }}>
              <h3 className="form-category" style={{ fontSize: "0.75rem", color: "#e63946" }}>{t("login.platformAccess")}</h3>
              <h1 className="form-title" style={{ fontSize: "2rem", margin: "5px 0" }}>{t("login.title")}</h1>
            </header>

            {/* Role Selector */}
            <div className="role-selector" style={{ marginBottom: "1.2rem" }}>
              <label className="input-label" style={{ marginBottom: "6px", display: "block" }}>{t("login.loginAs")}</label>
              <div className="input-field-wrapper">
                <div className="input-icon"><ShieldCheck size={18} /></div>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  className="role-dropdown"
                  style={{ paddingLeft: "3.5rem", width: "100%" }}
                >
                  <option value="guest">{t("role.guest")}</option>
                  <option value="staff">{t("role.staff")}</option>
                  <option value="admin">{t("role.admin")}</option>
                </select>
              </div>
            </div>

            <div className="form-inputs" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Input icon={<User />} label="Email" placeholder="your_name" value={email} onChange={(e: any) => setEmail(e.target.value)} />
              <Input icon={<Lock />} label="Password" type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} />

              <button className="btn-submit" onClick={handleLogin} style={{ marginTop: "0.5rem", width: "100%", height: "48px" }}>
                {t("login.signInAs", { role: t(`role.${role}`) })} <ArrowRight size={20} style={{ marginLeft: "8px" }} />
              </button>
            </div>

            <footer className="form-footer" style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.9rem" }}>{t("login.noAccount")}</span>
              <button 
                onClick={() => navigate("/signup")} 
                className="toggle-btn" 
                style={{ fontWeight: "bold", marginLeft: "8px", color: "#e63946", border: "none", background: "none", cursor: "pointer" }}
              >
                {t("login.createOne")}
              </button>
            </footer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// function Input({ icon, label, type = "text", placeholder }) {
//   return (
//     <div className="input-group">
//       <label className="input-label" style={{ fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>{label}</label>
//       <div className="input-field-wrapper" style={{ marginTop: "5px" }}>
//         <div className="input-icon" style={{ left: "12px" }}>
//           {React.cloneElement(icon, { size: 18 })}
//         </div>
//         <input type={type} placeholder={placeholder} className="input-field" style={{ height: "42px", borderRadius: "10px" }} />
//       </div>
//     </div>
//   );
// }

function Input({ icon, label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="input-field-wrapper">
        <div className="input-icon">
          {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
        </div>
        <input 
          type={type} 
          placeholder={placeholder} 
          value={value} 
          onChange={onChange} // This is crucial for React state
          className="input-field" 
        />
      </div>
    </div>
  );
}