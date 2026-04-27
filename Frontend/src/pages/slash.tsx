import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useI18n } from "../i18n/I18nProvider";
const Splash = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden gradient-emergency">
      <div className="absolute inset-0 gradient-hero opacity-50" />
      {/* Ripples */}
      {[0, 0.4, 0.8].map((d) => (
        <motion.div
          key={d}
          className="absolute h-40 w-40 rounded-full border-2 border-primary-foreground/30"
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 2, delay: d, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
      <div className="relative flex flex-col items-center gap-6">
        <div className="scale-[2.5]">
          <Logo size={56} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <h1 className="text-4xl font-black tracking-tight text-primary-foreground">{t("app.name")}</h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.3em] text-primary-foreground/80">
            {t("splash.tagline")}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Splash;
// import { Logo } from "../components/Logo";

// const Splash = () => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-red-600 text-white">
//       <Logo size={80} />
//       <h1 className="text-4xl font-black mt-4">RESPONDER LIVE VIEW</h1>
//       <p className="opacity-80">Crisis Simulator Real-time Feed</p>
//     </div>
//   );
// };

// export default Splash;