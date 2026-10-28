import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Atom, BookOpen, ChartNoAxesCombined, CircleHelp, Droplets, Leaf, LayoutDashboard, Menu, Settings2, Waves, X, Zap } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/calculator", label: "Footprint calculator", icon: Atom },
  { to: "/simulator", label: "Global simulator", icon: ChartNoAxesCombined },
  { to: "/research", label: "Research library", icon: BookOpen },
  { to: "/guide", label: "Sustainable AI guide", icon: Leaf }
];
export default function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Leaf size={21}/></div><div><strong>AI Footprint</strong><small>ENVIRONMENTAL INTELLIGENCE</small></div>
        <button className="mobile-close icon-button" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={18}/></button>
      </div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">{nav.map(({to,label,icon:Icon,end}) => <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)} className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}><Icon size={18}/><span>{label}</span>{label==="Footprint calculator" && <span className="nav-dot"/>}</NavLink>)}</nav>
      <div className="sidebar-bottom">
        <div className="side-note"><div className="side-note-icon"><Waves size={17}/></div><strong>Measure what matters.</strong><p>Explore the hidden resource costs behind AI computation.</p></div>
        <div className="profile-row"><div className="avatar">AF</div><div><strong>Research workspace</strong><small>Local demo environment</small></div><Settings2 size={16} className="muted-icon"/></div>
      </div>
    </aside>
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation overlay" onClick={() => setMobileOpen(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20}/></button><div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>Environmental overview</strong></div><div className="topbar-right"><span className="status-pill"><span className="status-pulse"/>API-ready prototype</span><button className="help-button" title="Methodology and limitations"><CircleHelp size={18}/></button></div></header>
      <motion.div className="page-content" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.32,ease:"easeOut"}}><Outlet/></motion.div>
      <footer className="app-footer"><span>AI Footprint <span className="footer-dot">•</span> Estimates, not measurements</span><span><Zap size={13}/> Transparent by design</span></footer>
    </main>
  </div>;
}
