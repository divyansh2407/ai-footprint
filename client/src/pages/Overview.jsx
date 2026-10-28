import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Atom, BookOpen, ChevronRight, Droplets, Leaf, MoveUpRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MetricCard from "../components/MetricCard.jsx";
import { getHealth, getHistory } from "../lib/api.js";

const chartData = [
  {name:"Mon", electricity:0.42, water:0.51}, {name:"Tue", electricity:0.56, water:0.63},
  {name:"Wed", electricity:0.49, water:0.59}, {name:"Thu", electricity:0.71, water:0.76},
  {name:"Fri", electricity:0.63, water:0.70}, {name:"Sat", electricity:0.82, water:0.86},
  {name:"Sun", electricity:0.68, water:0.74}
];
export default function Overview() {
  const [health,setHealth] = useState("checking");
  const [history,setHistory] = useState([]);
  useEffect(()=>{getHealth().then(()=>setHealth("online")).catch(()=>setHealth("offline"));getHistory().then(d=>setHistory(d.history||[])).catch(()=>{});},[]);
  const latest = history[0]?.results;
  const fmt = n => Number(n||0).toLocaleString("en-US",{maximumFractionDigits:4});
  return <div className="page-stack">
    <section className="hero-panel">
      <div className="hero-copy">
        <motion.div className="eyebrow" initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{duration:.4}}><span className="eyebrow-line"/> ENVIRONMENTAL INTELLIGENCE, REIMAGINED</motion.div>
        <motion.h1 initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.06}}>Understand the footprint<br/>behind <em>every token.</em></motion.h1>
        <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:.15}}>Explore how AI inference connects to electricity, water, and carbon — with transparent assumptions and a clearer view of uncertainty.</motion.p>
        <motion.div className="hero-actions" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.24}}><Link className="button-primary" to="/calculator">Calculate your footprint <ArrowRight size={16}/></Link><Link className="button-quiet" to="/research">Explore methodology <ChevronRight size={16}/></Link></motion.div>
        <div className="hero-proof"><span><span className={`health-dot ${health}`}/>{health==="online"?"API connected":health==="offline"?"API unavailable":"Connecting to API"}</span><span className="proof-divider"/><span><Activity size={14}/> Assumption-led estimates</span></div>
      </div>
      <div className="hero-art" aria-label="Illustration of connected AI, energy, water and carbon systems">
        <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-orbit orbit-three"/>
        <svg className="art-connectors" viewBox="0 0 420 350" role="img" aria-label="Connected environmental resource nodes"><path d="M210 175 L110 85 M210 175 L315 78 M210 175 L320 270 M210 175 L100 270" /><path d="M110 85 C190 35 250 30 315 78 M100 270 C180 315 250 320 320 270" className="connector-dash"/></svg>
        <motion.div className="art-core" animate={{scale:[1,1.035,1]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}><div className="core-ring"><Atom size={36}/></div><strong>AI</strong><small>COMPUTE</small></motion.div>
        <motion.div className="art-node node-energy" whileHover={{scale:1.09,y:-4}}><span><Zap size={17}/></span><b>Energy</b><small>Electricity</small></motion.div>
        <motion.div className="art-node node-water" whileHover={{scale:1.09,y:-4}}><span><Droplets size={17}/></span><b>Water</b><small>Cooling</small></motion.div>
        <motion.div className="art-node node-carbon" whileHover={{scale:1.09,y:-4}}><span><Leaf size={17}/></span><b>Carbon</b><small>CO₂e</small></motion.div>
        <motion.div className="art-node node-data" whileHover={{scale:1.09,y:-4}}><span><Activity size={17}/></span><b>Inference</b><small>Tokens</small></motion.div>
        <div className="art-caption"><span className="caption-pulse"/> SYSTEMS CONNECTED <span>·</span> IMPACT ESTIMATED</div>
      </div>
      <div className="hero-bottom-line"><span>01 / ENVIRONMENTAL OVERVIEW</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section className="section-block">
      <div className="section-heading"><div><div className="section-kicker">YOUR WORKSPACE</div><h2>Environmental snapshot</h2><p>Recent estimates from your local calculation history.</p></div><Link to="/calculator" className="text-link">New calculation <MoveUpRight size={15}/></Link></div>
      <div className="metrics-grid">
        <MetricCard icon={Zap} label="Electricity" value={fmt(latest?.electricityKwh)} unit="kWh" note={latest?"Latest saved estimate":"No saved estimates yet"} tone="green" delay={0}/>
        <MetricCard icon={Droplets} label="Water" value={fmt(latest?.waterLitres)} unit="L" note={latest?"Based on configured water factor":"Illustrative factor in demo"} tone="blue" delay={.07}/>
        <MetricCard icon={Leaf} label="Carbon emissions" value={fmt(latest?.carbonGrams)} unit="g CO₂e" note={latest?"Based on grid intensity assumption":"Illustrative grid factor in demo"} tone="amber" delay={.14}/>
      </div>
      <div className="notice-bar"><span className="notice-icon">i</span><div><strong>Demo factors are illustrative.</strong> The default factors are not verified measurements from an AI provider. Update them with sourced, versioned evidence before drawing factual comparisons.</div><Link to="/research">Read the methodology <ArrowRight size={14}/></Link></div>
    </section>

    <section className="section-block overview-lower">
      <div className="chart-panel panel">
        <div className="panel-heading"><div><span className="section-kicker">ILLUSTRATIVE TREND</span><h3>Resource intensity</h3></div><span className="tiny-tag">DEMO DATA</span></div>
        <p className="panel-subtitle">Example normalized trend — not measured usage.</p>
        <div className="chart-legend"><span><i className="legend-dot legend-green"/> Electricity index</span><span><i className="legend-dot legend-blue"/> Water index</span></div>
        <div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:10,right:8,left:-20,bottom:0}}><defs><linearGradient id="gElectric" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f7653" stopOpacity={.2}/><stop offset="95%" stopColor="#2f7653" stopOpacity={0}/></linearGradient><linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6daec4" stopOpacity={.2}/><stop offset="95%" stopColor="#6daec4" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#e7ebe3" vertical={false} strokeDasharray="3 4"/><XAxis dataKey="name" tick={{fill:"#8a948b",fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#8a948b",fontSize:10}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{borderRadius:12,border:"1px solid #e3e9df",fontSize:12}}/><Area type="monotone" dataKey="electricity" name="Electricity index" stroke="#2f7653" strokeWidth={2.5} fill="url(#gElectric)" animationDuration={800}/><Area type="monotone" dataKey="water" name="Water index" stroke="#6daec4" strokeWidth={2.5} fill="url(#gWater)" animationDuration={900}/></AreaChart></ResponsiveContainer></div>
      </div>
      <div className="quick-panel panel"><div className="panel-heading"><div><span className="section-kicker">GET STARTED</span><h3>Explore the platform</h3></div><span className="quick-icon"><Leaf size={18}/></span></div>
        <Link to="/calculator" className="quick-link"><span className="quick-link-icon"><Atom size={18}/></span><span><strong>Calculate a footprint</strong><small>Tokens → energy, water & carbon</small></span><ArrowRight size={16}/></Link>
        <Link to="/simulator" className="quick-link"><span className="quick-link-icon blue"><Activity size={18}/></span><span><strong>Model adoption scenarios</strong><small>Explore hypothetical scale effects</small></span><ArrowRight size={16}/></Link>
        <Link to="/research" className="quick-link"><span className="quick-link-icon amber"><BookOpen size={18}/></span><span><strong>Review assumptions</strong><small>Understand boundaries and caveats</small></span><ArrowRight size={16}/></Link>
        <div className="quick-footnote">A transparent estimate is more useful than a precise-looking guess.</div>
      </div>
    </section>
  </div>;
}
