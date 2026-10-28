import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Atom, CheckCircle2, ChevronDown, CircleAlert, Droplets, Download, Leaf, RotateCcw, Zap } from "lucide-react";
import { calculate, getModels } from "../lib/api.js";

const num = n => Number(n||0).toLocaleString("en-US",{maximumFractionDigits:6});
export default function Calculator() {
  const [models,setModels]=useState([]),[form,setForm]=useState({modelId:"demo-balanced",inputTokens:1000,outputTokens:500,requests:100,gridCarbonIntensity:400,waterIntensity:1.2});
  const [result,setResult]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[showBreakdown,setShowBreakdown]=useState(true);
  useEffect(()=>{getModels().then(d=>{setModels(d.models);setForm(f=>({...f,gridCarbonIntensity:d.defaults.gridCarbonIntensity,waterIntensity:d.defaults.waterIntensity}));}).catch(e=>setError(e.message));},[]);
  const update=(key,value)=>setForm(f=>({...f,[key]:value}));
  const submit=async e=>{e.preventDefault();setBusy(true);setError("");try{const data=await calculate({...form,inputTokens:Number(form.inputTokens),outputTokens:Number(form.outputTokens),requests:Number(form.requests),gridCarbonIntensity:Number(form.gridCarbonIntensity),waterIntensity:Number(form.waterIntensity)});setResult(data);}catch(e){setError(e.message);}finally{setBusy(false);}};
  const reset=()=>{setForm(f=>({...f,inputTokens:1000,outputTokens:500,requests:100}));setResult(null);setError("");};
  const exportResult=()=>{if(!result)return;const blob=new Blob([JSON.stringify(result,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="ai-footprint-estimate.json";a.click();URL.revokeObjectURL(url);};
  return <div className="page-stack">
    <div className="page-title-row"><div><div className="section-kicker">CALCULATION WORKSPACE</div><h1>AI Footprint calculator</h1><p>Estimate the resource implications of an inference workload with transparent, editable assumptions.</p></div><span className="page-index">02 <span>/ 05</span></span></div>
    <div className="calculator-layout">
      <form className="panel calculator-form" onSubmit={submit}>
        <div className="form-title"><span className="form-title-icon"><Atom size={19}/></span><div><h3>Define your workload</h3><p>All fields are used by the API calculation engine.</p></div></div>
        <label className="field-label" htmlFor="model">Model energy scenario <span className="required-label">Required</span></label>
        <select id="model" value={form.modelId} onChange={e=>update("modelId",e.target.value)}>{models.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select>
        {models.find(m=>m.id===form.modelId)&&<div className="model-note"><CircleAlert size={15}/><span>{models.find(m=>m.id===form.modelId).note}</span></div>}
        <div className="form-divider"/>
        <div className="field-section-head"><span>01</span><div><strong>Token volume</strong><small>Average tokens per request</small></div></div>
        <div className="two-col-fields"><div><label className="field-label" htmlFor="inputTokens">Input tokens</label><input id="inputTokens" type="number" min="0" max="1000000000" step="1" value={form.inputTokens} onChange={e=>update("inputTokens",e.target.value)} required/></div><div><label className="field-label" htmlFor="outputTokens">Output tokens</label><input id="outputTokens" type="number" min="0" max="1000000000" step="1" value={form.outputTokens} onChange={e=>update("outputTokens",e.target.value)} required/></div></div>
        <label className="field-label" htmlFor="requests">Number of requests</label><input id="requests" type="number" min="1" max="1000000000" step="1" value={form.requests} onChange={e=>update("requests",e.target.value)} required/>
        <div className="form-divider"/>
        <div className="field-section-head"><span>02</span><div><strong>Environmental context</strong><small>Factors used to convert electricity into impacts</small></div></div>
        <div className="two-col-fields"><div><label className="field-label" htmlFor="grid">Grid intensity <small>gCO₂e/kWh</small></label><input id="grid" type="number" min="0" max="5000" step="1" value={form.gridCarbonIntensity} onChange={e=>update("gridCarbonIntensity",e.target.value)} required/></div><div><label className="field-label" htmlFor="water">Water intensity <small>L/kWh</small></label><input id="water" type="number" min="0" max="1000" step="0.01" value={form.waterIntensity} onChange={e=>update("waterIntensity",e.target.value)} required/></div></div>
        <p className="field-help">Water boundary must be defined for real analysis. The current value is illustrative and not a verified local or provider-specific factor.</p>
        {error&&<div className="error-banner" role="alert">{error}</div>}
        <div className="form-actions"><button className="button-primary" type="submit" disabled={busy||models.length===0}>{busy?"Calculating…":"Calculate estimate"} <Zap size={16}/></button><button className="button-outline" type="button" onClick={reset}><RotateCcw size={15}/> Reset</button></div>
      </form>
      <section className="results-column">
        <div className="result-hero panel">
          <div className="result-top"><div><span className="section-kicker">ESTIMATED IMPACT</span><h3>Your results</h3></div><span className="result-badge"><span/> {result?"Calculated":"Awaiting inputs"}</span></div>
          {result?<motion.div key={result.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.32}} className="result-content">
            <div className="result-main"><span>Total estimated electricity</span><strong>{num(result.results.electricityKwh)} <small>kWh</small></strong><div className="result-sub">{num(result.results.electricityWh)} Wh across {Number(result.inputs.requests).toLocaleString()} requests</div></div>
            <div className="result-metrics">
              <div className="result-metric"><span className="result-icon blue"><Droplets size={17}/></span><div><small>Estimated water</small><strong>{num(result.results.waterLitres)} L</strong></div></div>
              <div className="result-metric"><span className="result-icon amber"><Leaf size={17}/></span><div><small>Estimated carbon</small><strong>{num(result.results.carbonGrams)} gCO₂e</strong></div></div>
            </div>
            <button className="breakdown-toggle" type="button" onClick={()=>setShowBreakdown(v=>!v)} aria-expanded={showBreakdown}><span><ChevronDown size={16} className={showBreakdown?"chevron-open":""}/> Calculation breakdown</span><small>{showBreakdown?"Hide":"Show"}</small></button>
            {showBreakdown&&<div className="breakdown-body"><div><span>Input energy</span><strong>{num(result.results.inputElectricityKwh)} kWh</strong></div><div><span>Output energy</span><strong>{num(result.results.outputElectricityKwh)} kWh</strong></div><div><span>Carbon factor</span><strong>{num(result.methodology.gridCarbonIntensity)} g/kWh</strong></div><div><span>Water factor</span><strong>{num(result.methodology.waterIntensity)} L/kWh</strong></div><p>{result.methodology.energyFormula}</p></div>}
            <button className="button-outline export-button" type="button" onClick={exportResult}><Download size={15}/> Export result JSON</button>
          </motion.div>:<div className="empty-result"><div className="empty-illustration"><Atom size={30}/><span/><i/></div><h4>Ready when you are</h4><p>Enter a workload and calculate to see its estimated resource footprint and the full formula breakdown.</p><div className="empty-steps"><span><CheckCircle2 size={15}/> Transparent formulas</span><span><CheckCircle2 size={15}/> Saved to local history</span></div></div>}
        </div>
        <div className="scientific-note"><span className="scientific-icon"><CircleAlert size={17}/></span><div><strong>Read the result with care</strong><p>These values are estimates, not measurements. The bundled token-energy factors are illustrative placeholders. Actual inference energy depends on model architecture, hardware, batching, utilisation and system boundaries.</p></div></div>
      </section>
    </div>
  </div>;
}
