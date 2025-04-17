import { motion } from "framer-motion";

export default function TestMotion() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      Hello from Framer Motion!
    </motion.div>
  );
}
