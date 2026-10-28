import { motion, useReducedMotion } from "framer-motion";
export default function MetricCard({ icon: Icon, label, value, unit, note, tone = "green", delay = 0 }) {
  const reduce = useReducedMotion();
  return <motion.article className={`metric-card tone-${tone} hover-lift`} initial={reduce ? false : {opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.38,delay,ease:"easeOut"}}>
    <div className="metric-top"><span className="metric-icon"><Icon size={19}/></span><span className="metric-label">{label}</span><span className="metric-arrow">↗</span></div>
    <div className="metric-value">{value}<span>{unit}</span></div><p>{note}</p>
  </motion.article>;
}
