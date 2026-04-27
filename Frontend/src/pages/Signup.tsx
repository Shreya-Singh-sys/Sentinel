import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { User, Lock, Mail, MapPin, Building, Droplets, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../style/LoginPage.css";
import { useI18n } from "../i18n/I18nProvider";

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

// Bubbles Animation Function (Wapas Add Kiya)
const bubbleAnimate = (xRange: number[], yRange: number[], duration: number) => ({
  animate: { x: xRange, y: yRange },
  transition: { 
    duration: duration / 2, 
    repeat: Infinity, 
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  }
});

export default function SignUpPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("guest");
  const { t } = useI18n();
  const roleLabel = t(`role.${role}`);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    workingPlace: "", // staff ke liye
    bloodGroup: "",   // staff ke liye
    address: ""       // admin ke liye
  });
  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SIGNUP LOGIC (BACKEND CALL) ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Page refresh hone se rokne ke liye
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role, // guest, staff, or admin
          fullName: formData.fullName,
          // Baki optional data bhi bhej sakte hain
          extraInfo: {
            address: formData.address,
            bloodGroup: formData.bloodGroup
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful!");
        navigate("/login"); // Login page par bhejein
      } else {
        alert(data.error || "Signup Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Backend server se connect nahi ho paya!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page-root" style={{ height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button className="back-btn" onClick={() => navigate("/")}>{t("common.backToHome")}</button>
      
      <div className="perspective-container" style={{ maxWidth: "1000px", width: "95%" }}> 
        <motion.div 
          className="auth-card reverse"
          style={{ height: "auto", minHeight: "fit-content", display: "flex", overflow: "hidden", position: "relative" }}
          initial="initial" animate="animate" exit="exit" variants={cardVariants}
        >
          {/* Sidebar Section (Wapas Bubbles Add Kiye) */}
          <div className="auth-sidebar" style={{ flex: "0 0 30%", position: "relative", overflow: "hidden" }}> 
            <div className="sidebar-overlay" style={{ position: "absolute", inset: 0, background: "inherit", zIndex: 1 }} />
            
            {/* --- Animated Bubbles (WAPAS AAGAYE!) --- */}
            <motion.div className="bubble b1" {...bubbleAnimate([0, 15], [0, 25], 4)} style={{ position: "absolute", zIndex: 2 }} />
            <motion.div className="bubble b2" {...bubbleAnimate([0, -20], [0, -30], 6)} style={{ position: "absolute", zIndex: 2 }} />
            <motion.div className="bubble b3" {...bubbleAnimate([0, 10], [0, 15], 5)} style={{ position: "absolute", zIndex: 2 }} />
            <motion.div className="bubble b4" {...bubbleAnimate([0, -10], [0, 20], 7)} style={{ position: "absolute", zIndex: 2 }} />
            <motion.div className="bubble b5" {...bubbleAnimate([0, 20], [0, -10], 8)} style={{ position: "absolute", zIndex: 2 }} />
            <motion.div className="bubble b6" {...bubbleAnimate([0, -15], [0, -15], 9)} style={{ position: "absolute", zIndex: 2 }} />
            
            <div style={{ zIndex: 10, position: "relative", padding: "40px 20px" }}>
                <h2 className="sidebar-title" style={{fontSize: "2.2rem", lineHeight: "1", color: "white"}}>
                  {t("signup.joinAs", { role: roleLabel })}
                </h2>
                <p className="sidebar-subtitle" style={{ marginTop: "15px", fontSize: "0.9rem", color: "white", opacity: 0.9 }}>
                  {t("signup.createAccount", { role: roleLabel })}
                </p>
            </div>
          </div>

          {/* Form Area Section (No Changes here, Spacing remains compact) */}
          <div className="auth-form-area" style={{ flex: "1", padding: "2rem 3rem", overflow: "visible" }}>
            <header className="form-header" style={{ marginBottom: "1rem" }}>
              <h3 className="form-category" style={{ fontSize: "0.7rem", color: "#e63946" }}>{t("signup.registration")}</h3>
              <h1 className="form-title" style={{ fontSize: "1.8rem", margin: "0" }}>{t("signup.title")}</h1>
            </header>

            <div className="role-selector" style={{ marginBottom: "1rem" }}>
              <label className="input-label" style={{ fontSize: "0.8rem" }}>{t("signup.selectRole")}</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="role-dropdown">
                <option value="guest">{t("role.guest")}</option>
                <option value="staff">{t("role.staff")}</option>
                <option value="admin">{t("role.admin")}</option>
              </select>
            </div>
            
            <div className="form-inputs" style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "0.8rem 1.2rem",
              overflow: "visible" 
            }}>
              <Input icon={<User />} label="Full Name" placeholder="Your Name" name="fullName" value={formData.fullName} onChange={handleChange}/>
              <Input icon={<Mail />} label="Email Address" placeholder="email@example.com" name="email" value={formData.email} onChange={handleChange} />

              <AnimatePresence mode="popLayout">
                {role === "staff" && (
                  <>
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} key="staff-1">
                      <Input icon={<Building />} label="Working Place" placeholder="Office Location" name="workingPlace" value={formData.workingPlace} onChange={handleChange} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} key="staff-2">
                      <Input icon={<Droplets />} label="Blood Group" placeholder="O+ve" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
                    </motion.div>
                  </>
                )}

                {role === "admin" && (
                  <>
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} key="admin-1" style={{ gridColumn: "span 2" }}>
                      <Input icon={<MapPin />} label="Address" placeholder="Full Address" name="address" value={formData.address} onChange={handleChange} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} key="admin-2" style={{ gridColumn: "span 2" }}>
                      <div className="input-group">
                        <label className="input-label" style={{ fontSize: "0.75rem" }}>Map (PDF File)</label>
                        <div className="input-field-wrapper">
                          <div className="input-icon"><FileText size={16} /></div>
                          <input type="file" accept="application/pdf" className="input-field file-input" style={{ fontSize: "0.8rem" }} />
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <Input icon={<Lock />} label="Password" type="password" placeholder="••••••••" name="password" value={formData.password} onChange={handleChange} />
              <Input icon={<Lock />} label="Confirm Password" type="password" placeholder="••••••••" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </div>
            
            <div style={{ marginTop: "1.5rem" }}>
              <button 
      onClick={handleRegister} 
      className="btn-submit" 
      disabled={loading}
      style={{ width: "100%", padding: "12px", borderRadius: "10px" }}
    >
      {loading ? "Registering..." : t("signup.registerAs", { role: roleLabel })} 
      <ArrowRight size={18} />
    </button>
                {/* <button className="btn-submit" style={{ width: "100%", padding: "12px", borderRadius: "10px" }}>
                {t("signup.registerAs", { role: roleLabel })} <ArrowRight size={18} />
                </button> */}
                
                <footer className="form-footer" style={{ marginTop: "1rem", textAlign: "center" }}>
                {t("signup.alreadyMember")} <button onClick={() => navigate("/login")} className="toggle-btn" style={{ color: "#e63946", background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}>{t("signup.logIn")}</button>
                </footer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// function Input({ icon, label, type = "text", placeholder }) {
//   return (
//     <div className="input-group" style={{ marginBottom: "0" }}>
//       <label className="input-label" style={{ fontSize: "0.7rem", marginBottom: "4px", display: "block" }}>{label}</label>
//       <div className="input-field-wrapper">
//         <div className="input-icon" style={{ left: "10px" }}>{React.cloneElement(icon, { size: 16 })}</div>
//         <input type={type} placeholder={placeholder} className="input-field" style={{ height: "40px", padding: "8px 10px 8px 35px", fontSize: "0.9rem" }} />
//       </div>
//     </div>
//   );
// }

function Input({ icon, label, type = "text", placeholder, name, value, onChange }: any) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="input-field-wrapper">
        <div className="input-icon">
          {React.cloneElement(icon, { size: 16 })}
        </div>
        <input 
          name={name}      // Important!
          value={value}    // Important!
          onChange={onChange} // Important!
          type={type} 
          placeholder={placeholder} 
          className="input-field" 
        />
      </div>
    </div>
  );
}


