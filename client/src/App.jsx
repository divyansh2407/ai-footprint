import { Routes, Route } from "react-router-dom";
import Shell from "./components/Shell.jsx";
import Overview from "./pages/Overview.jsx";
import Calculator from "./pages/Calculator.jsx";
import Simulator from "./pages/Simulator.jsx";
import Research from "./pages/Research.jsx";
import Guide from "./pages/Guide.jsx";
function NotFound(){return <div className="panel empty-state"><h2>Page not found</h2><p>The requested page does not exist.</p></div>}
export default function App(){return <Routes><Route element={<Shell/>}><Route index element={<Overview/>}/><Route path="calculator" element={<Calculator/>}/><Route path="simulator" element={<Simulator/>}/><Route path="research" element={<Research/>}/><Route path="guide" element={<Guide/>}/><Route path="*" element={<NotFound/>}/></Route></Routes>}
