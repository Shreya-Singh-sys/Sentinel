import { motion } from "framer-motion";
import { Icon } from "./Icon";

export const Logo = ({ size = 40 }: { size?: number }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className="relative inline-flex items-center justify-center"
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 rounded-2xl gradient-emergency shadow-emergency" />
    <Icon name="shield" filled className="relative text-primary-foreground" weight={700} />
  </motion.div>
);
