import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CheckCircle2, Compass, Leaf, Recycle, ShieldCheck, Sparkles, Target } from "lucide-react";

const actions=[
 {id:1,category:"Prompting",title:"Make prompts more focused",description:"Provide clear constraints and relevant context to reduce avoidable back-and-forth.",impact:"Workflow efficiency"},
 {id:2,category:"Workflow",title:"Reuse stable outputs where appropriate",description:"Cache repeatable results when freshness, privacy and correctness requirements allow.",impact:"Fewer repeated requests"},
 {id:3,category:"Model choice",title:"Use the smallest capable model",description:"Evaluate quality against task requirements instead of defaulting to the largest model.",impact:"Right-sized computation"},
 {id:4,category:"Evaluation",title:"Measure quality and cost together",description:"Track task success, latency, tokens and estimated resource use as one evaluation.",impact:"Evidence-led choices"},
 {id:5,category:"Infrastructure",title:"Avoid unnecessary background calls",description:"Review retries, polling loops and automated tasks that may run without user value.",impact:"Less wasted activity"},
 {id:6,category:"Governance",title:"Keep claims traceable",description:"Attach sources and boundaries to environmental estimates before sharing them publicly.",impact:"More trustworthy reporting"}
];
export default function Guide(){
 const [done,setDone]=useState([]);
 const toggle=id=>setDone(d=>d.includes(id)?d.filter(x=>x!==id):[...d,id]);
 return <div className="page-stack">
  <div className="page-title-row"><div><div className="section-kicker">PRACTICAL SUSTAINABILITY</div><h1>Sustainable AI guide</h1><p>Small, measurable choices for building more thoughtful AI workflows.</p></div><span className="page-index">05 <span>/ 05</span></span></div>
  <section className="guide-hero"><div className="guide-hero-copy"><span className="guide-icon"><Leaf size={22}/></span><div className="section-kicker">A PRACTICAL STARTING POINT</div><h2>Better AI starts with<br/><em>intentional choices.</em></h2><p>Environmental efficiency is a systems problem. Start with actions you can measure, validate and improve — rather than assuming one simple metric tells the whole story.</p></div><div className="guide-visual"><div className="guide-circle circle-a"/><div className="guide-circle circle-b"/><motion.div className="guide-center" animate={{rotate:360}} transition={{duration:50,repeat:Infinity,ease:"linear"}}><Leaf size={42}/></motion.div><span className="guide-tag tag-one"><Target size={14}/> Right-sized models</span><span className="guide-tag tag-two"><Recycle size={14}/> Reduce repetition</span><span className="guide-tag tag-three"><ShieldCheck size={14}/> Evidence-led</span></div></section>
  <section className="section-block"><div className="section-heading"><div><div className="section-kicker">YOUR ACTION PLAN</div><h2>Build a better AI workflow</h2><p>Mark actions as you adopt them. Progress is saved for this page session.</p></div><div className="progress-ring"><strong>{Math.round(done.length/actions.length*100)}%</strong><small>complete</small></div></div><div className="guide-progress"><span style={{width:`${done.length/actions.length*100}%`}}/></div>
   <div className="action-list">{actions.map((a,i)=><motion.button key={a.id} type="button" className={`action-card panel hover-lift ${done.includes(a.id)?"completed":""}`} onClick={()=>toggle(a.id)} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25,delay:i*.04}}><span className={`action-check ${done.includes(a.id)?"checked":""}`}>{done.includes(a.id)&&<Check size={15}/>}</span><span className="action-copy"><span className="action-category">{a.category}</span><strong>{a.title}</strong><small>{a.description}</small></span><span className="action-impact">{a.impact}</span></motion.button>)}</div>
  </section>
  <div className="notice-bar"><span className="notice-icon"><Sparkles size={15}/></span><div><strong>Efficiency is not the whole impact story.</strong> Evaluate whether AI is needed for the task, whether the outcome is useful, and whether increased efficiency leads to increased overall usage.</div></div>
 </div>;
}
