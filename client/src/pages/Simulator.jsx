import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Droplets, Leaf, Users, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getModels, simulate } from "../lib/api.js";

const presets = [{label:"Pilot",users:1000,requestsPerUser:10},{label:"Growing",users:100000,requestsPerUser:20},{label:"At scale",users:1000000,requestsPerUser:30}];
const fmt=n=>Number(n||0).toLocaleString("en-US",{maximumFractionDigits:4});
export default function Simulator(){
 const [models,setModels]=useState([]),[form,setForm]=useState({modelId:"demo-balanced",users:100000,requestsPerUser:20,inputTokens:1000,outputTokens:500,gridCarbonIntensity:400,waterIntensity:1.2}),[result,setResult]=useState(null),[error,setError]=useState("");
 useEffect(()=>{getModels().then(d=>{setModels(d.models);setForm(f=>({...f,gridCarbonIntensity:d.defaults.gridCarbonIntensity,waterIntensity:d.defaults.waterIntensity}));}).catch(e=>setError(e.message));},[]);
 const update=(k,v)=>setForm(f=>({...f,[k]:v}));
 const run=async()=>{setError("");try{setResult(await simulate({...form,users:Number(form.users),requestsPerUser:Number(form.requestsPerUser),inputTokens:Number(form.inputTokens),outputTokens:Number(form.outputTokens)}));}catch(e){setError(e.message);}};
 useEffect(()=>{if(models.length)run();},[models]);
 const chartData=result?[{name:"Electricity",value:result.results.electricityKwh},{name:"Water",value:result.results.waterLitres},{name:"Carbon (g)",value:result.results.carbonGrams}]:[];
 return <div className="page-stack">
  <div className="page-title-row"><div><div className="section-kicker">SCENARIO LABORATORY</div><h1>Global Impact Simulator</h1><p>Explore how adoption and usage assumptions can scale an estimated workload. These are hypothetical scenarios, not global measurements.</p></div><span className="page-index">03 <span>/ 05</span></span></div>
  <div className="preset-row">{presets.map(p=><button key={p.label} type="button" className={`preset-button ${Number(form.users)===p.users?"selected":""}`} onClick={()=>{setForm(f=>({...f,users:p.users,requestsPerUser:p.requestsPerUser}));}}><span>{p.label}</span><small>{p.users.toLocaleString()} users · {p.requestsPerUser} requests/user</small></button>)}</div>
  <div className="simulator-layout">
   <section className="panel sim-controls"><div className="panel-heading"><div><span className="section-kicker">SCENARIO INPUTS</span><h3>Shape the scenario</h3></div><span className="quick-icon"><Users size={18}/></span></div>
    <div className="range-field"><div className="range-label"><label htmlFor="users">AI users</label><output>{Number(form.users).toLocaleString()}</output></div><input id="users" type="range" min="100" max="10000000" step="100" value={form.users} onChange={e=>update("users",e.target.value)}/><div className="range-limits"><span>100</span><span>10 million</span></div></div>
    <div className="range-field"><div className="range-label"><label htmlFor="rpu">Requests per user</label><output>{form.requestsPerUser}</output></div><input id="rpu" type="range" min="1" max="500" value={form.requestsPerUser} onChange={e=>update("requestsPerUser",e.target.value)}/><div className="range-limits"><span>1</span><span>500</span></div></div>
    <div className="two-col-fields"><div><label className="field-label" htmlFor="sim-model">Model scenario</label><select id="sim-model" value={form.modelId} onChange={e=>update("modelId",e.target.value)}>{models.map(m=><option value={m.id} key={m.id}>{m.name}</option>)}</select></div><div><label className="field-label" htmlFor="sim-output">Output tokens/request</label><input id="sim-output" type="number" min="0" max="1000000000" value={form.outputTokens} onChange={e=>update("outputTokens",e.target.value)}/></div></div>
    <label className="field-label" htmlFor="sim-input">Input tokens per request</label><input id="sim-input" type="number" min="0" max="1000000000" value={form.inputTokens} onChange={e=>update("inputTokens",e.target.value)}/>
    <button className="button-primary full-width" type="button" onClick={run}>Run scenario <Activity size={16}/></button>{error&&<div className="error-banner" role="alert">{error}</div>}
   </section>
   <section className="panel sim-results"><div className="panel-heading"><div><span className="section-kicker">MODELLED OUTCOME</span><h3>Estimated resource impact</h3></div><span className="tiny-tag">HYPOTHETICAL</span></div>
    {result?<motion.div key={result.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="sim-result-content">
      <div className="scenario-summary"><span><Users size={16}/> Total requests</span><strong>{Number(result.assumptions.totalRequests).toLocaleString()}</strong></div>
      <div className="sim-metric-grid"><div className="sim-metric"><Zap size={18}/><small>Electricity</small><strong>{fmt(result.results.electricityKwh)} <i>kWh</i></strong></div><div className="sim-metric blue"><Droplets size={18}/><small>Water</small><strong>{fmt(result.results.waterLitres)} <i>L</i></strong></div><div className="sim-metric amber"><Leaf size={18}/><small>Carbon</small><strong>{fmt(result.results.carbonKg)} <i>kg CO₂e</i></strong></div></div>
      <div className="chart-area simulator-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{top:8,right:8,left:0,bottom:0}}><CartesianGrid stroke="#e7ebe3" vertical={false} strokeDasharray="3 4"/><XAxis dataKey="name" tick={{fill:"#7e8a80",fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#7e8a80",fontSize:10}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{borderRadius:12,border:"1px solid #e3e9df",fontSize:12}} formatter={v=>Number(v).toLocaleString("en-US",{maximumFractionDigits:5})}/><Bar dataKey="value" name="Estimated value" fill="#397958" radius={[6,6,0,0]} animationDuration={550}/></BarChart></ResponsiveContainer></div>
      <p className="chart-caveat">The chart uses each metric's native unit, so bar heights are not directly comparable. Change a control and run the scenario to update the underlying calculation.</p>
    </motion.div>:<p className="muted-copy">Adjust the scenario and run it to calculate an estimate.</p>}
   </section>
  </div>
  <div className="notice-bar"><span className="notice-icon">i</span><div><strong>Scale is not certainty.</strong> This simulator multiplies per-request assumptions by a hypothetical user population. It does not model grid capacity, batching, hardware scheduling, regional water stress or demand response.</div></div>
 </div>;
}
