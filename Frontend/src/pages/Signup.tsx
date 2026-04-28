import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { User, Lock, Mail, MapPin, Building, Droplets, FileText, ArrowRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../style/LoginPage.css";
import { useI18n } from "../i18n/I18nProvider";

const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
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
    workingPlace: "",
    bloodGroup: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);

  // Responsive Hook
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
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
          role: role,
          fullName: formData.fullName,
          extraInfo: { address: formData.address, bloodGroup: formData.bloodGroup }
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful!");
        navigate("/login");
      } else {
        alert(data.error || "Signup Failed");
      }
    } catch (error) {
      alert("Backend server connection failed!");
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
      background: "#FDF8F8", 
      padding: isMobile ? "10px" : "20px",
      overflowX: "hidden"
    }}>
      {/* Back Button */}
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
            flexDirection: isMobile ? "column" : "row-reverse", // Reverse layout for signup
            width: "100%",
            maxWidth: isMobile ? "400px" : "1000px",
            background: "white",
            borderRadius: isMobile ? "32px" : "24px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(230, 57, 70, 0.15)",
            border: "1px solid rgba(255,255,255,0.7)"
          }}
          initial="initial" animate="animate" variants={cardVariants}
        >
          {/* Sidebar Section */}
          <div style={{ 
            flex: isMobile ? "none" : "0 0 30%", 
            height: isMobile ? "140px" : "auto",
            background: "linear-gradient(135deg, #e63946 0%, #f59e0b 100%)",
            position: "relative",
            padding: isMobile ? "30px 20px" : "50px 30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: isMobile ? "center" : "flex-end"
          }}>
            {!isMobile && (
              <>
                <motion.div className="bubble b1" {...bubbleAnimate([0, 15], [0, 25], 4)} style={{ position: "absolute" }} />
                <motion.div className="bubble b2" {...bubbleAnimate([0, -20], [0, -30], 6)} style={{ position: "absolute" }} />
                <motion.div className="bubble b3" {...bubbleAnimate([0, 10], [0, 15], 5)} style={{ position: "absolute" }} />
              </>
            )}
            
            <div style={{ zIndex: 10, position: "relative" }}>
                <h2 style={{ fontSize: isMobile ? "1.6rem" : "2.2rem", color: "white", fontWeight: 900, lineHeight: 1.1 }}>
                  {t("signup.joinAs", { role: roleLabel })}
                </h2>
                {!isMobile && (
                  <p style={{ marginTop: "15px", color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                    {t("signup.createAccount", { role: roleLabel })}
                  </p>
                )}
            </div>
          </div>

          {/* Form Area Section */}
          <div style={{ 
            flex: 1, 
            padding: isMobile ? "1.5rem" : "2.5rem 3rem",
            display: "flex",
            flexDirection: "column"
          }}>
            <header style={{ marginBottom: "1.5rem" }}>
              <span style={{ color: "#e63946", fontSize: "11px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase" }}>
                {t("signup.registration")}
              </span>
              <h1 style={{ fontSize: isMobile ? "1.6rem" : "2.2rem", fontWeight: 900, color: "#1e293b", margin: "5px 0" }}>
                {t("signup.title")}
              </h1>
            </header>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "11px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", display: "block" }}>
                {t("signup.selectRole")}
              </label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ 
                  width: "100%", height: "48px", padding: "0 16px", borderRadius: "14px", 
                  border: "1.5px solid #f1f5f9", fontSize: "14px", fontWeight: "bold", color: "#334155",
                  background: "#f8fafc", outline: "none", cursor: "pointer"
                }}
              >
                <option value="guest">{t("role.guest")}</option>
                <option value="staff">{t("role.staff")}</option>
                <option value="admin">{t("role.admin")}</option>
              </select>
            </div>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
              gap: isMobile ? "1rem" : "1rem 1.5rem"
            }}>
              <Input icon={<User />} label="Full Name" placeholder="Alex Carter" name="fullName" value={formData.fullName} onChange={handleChange} isMobile={isMobile}/>
              <Input icon={<Mail />} label="Email" placeholder="alex@sentinel.com" name="email" value={formData.email} onChange={handleChange} isMobile={isMobile}/>

              <AnimatePresence mode="popLayout">
                {role === "staff" && (
                  <>
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} key="staff-1">
                      <Input icon={<Building />} label="Working Place" placeholder="Grand Hyatt" name="workingPlace" value={formData.workingPlace} onChange={handleChange} isMobile={isMobile}/>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} key="staff-2">
                      <Input icon={<Droplets />} label="Blood Group" placeholder="O+ve" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} isMobile={isMobile}/>
                    </motion.div>
                  </>
                )}

                {role === "admin" && (
                  <>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="admin-1" style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
                      <Input icon={<MapPin />} label="Address" placeholder="123 Rescue St, Mumbai" name="address" value={formData.address} onChange={handleChange} isMobile={isMobile}/>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="admin-2" style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
                      <div style={{ textAlign: "left" }}>
                        <label style={{ fontSize: "11px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", display: "block" }}>Map (PDF File)</label>
                        <div style={{ position: "relative" }}>
                          <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#e63946" }}><FileText size={18} /></div>
                          <input type="file" accept="application/pdf" style={{ width: "100%", height: "48px", paddingLeft: "2.8rem", paddingTop: "12px", borderRadius: "14px", border: "1.5px solid #f1f5f9", background: "#f8fafc", fontSize: "12px" }} />
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <Input icon={<Lock />} label="Password" type="password" placeholder="••••••••" name="password" value={formData.password} onChange={handleChange} isMobile={isMobile}/>
              <Input icon={<Lock />} label="Confirm Password" type="password" placeholder="••••••••" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} isMobile={isMobile}/>
            </div>
            
            <div style={{ marginTop: "2rem" }}>
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleRegister} 
                disabled={loading}
                style={{ 
                  width: "100%", height: "54px", borderRadius: "16px", 
                  background: "linear-gradient(135deg, #e63946 0%, #f59e0b 100%)", color: "white", fontSize: "14px", fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  border: "none", cursor: "pointer", opacity: loading ? 0.7 : 1,
                  boxShadow: "0 10px 15px -3px rgba(30, 41, 59, 0.2)"
                }}
              >
                {loading ? "Registering..." : t("signup.registerAs", { role: roleLabel })} 
                <ArrowRight size={18} />
              </motion.button>
                
              <footer style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <p style={{ fontSize: "13px", color: "#64748b", fontWeight: "bold" }}>
                  {t("signup.alreadyMember")}
                  <button 
                    onClick={() => navigate("/login")} 
                    style={{ marginLeft: "6px", color: "#e63946", fontWeight: 900, background: "none", border: "none", cursor: "pointer" }}
                  >
                    {t("signup.logIn")}
                  </button>
                </p>
              </footer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Input({ icon, label, type = "text", placeholder, name, value, onChange, isMobile }: any) {
  return (
    <div style={{ textAlign: "left" }}>
      <label style={{ fontSize: "11px", fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px", display: "block", marginLeft: "2px" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", zIndex: 2 }}>
          {React.cloneElement(icon, { size: 16 })}
        </div>
        <input 
          name={name}
          value={value}
          onChange={onChange}
          type={type} 
          placeholder={placeholder} 
          style={{ 
            width: "100%", 
            height: isMobile ? "44px" : "48px", 
            paddingLeft: "2.8rem", 
            borderRadius: "14px", 
            border: "1.5px solid #f1f5f9", 
            fontSize: "14px", 
            fontWeight: "600", 
            color: "#334155",
            background: "#f8fafc", 
            outline: "none",
            transition: "border-color 0.2s"
          }} 
        />
      </div>
    </div>
  );
}