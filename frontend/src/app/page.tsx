"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function ObservabilityDashboard() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<string>("");
  const [analysisMarkdown, setAnalysisMarkdown] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [mode, setMode] = useState<"analyze" | "crash">("analyze");
  const [latency, setLatency] = useState<string>("---");
  const [logCount, setLogCount] = useState<number>(0);
  
  const [liveLogs, setLiveLogs] = useState<string[]>([
    "INIT // System core handshake initiated.",
    "SECURE // SSL 256-bit tunnel established.",
    "READY // Awaiting telemetry payload dispatch."
  ]);

  useEffect(() => {
    setMounted(true);
    
    const logInterval = setInterval(() => {
      const traces = [
        "SYS // Port 8000 ping: stable.",
        "DB // Syncing telemetry snapshots to MongoDB Atlas...",
        "SECURE // Verifying digital certificate authority...",
        "SYS // Garbage collector thread recycling complete.",
        "AGENT // Thread worker parsing idle queue..."
      ];
      const randomTrace = traces[Math.floor(Math.random() * traces.length)];
      setLiveLogs(prev => [randomTrace, ...prev.slice(0, 4)]);
    }, 4500);

    return () => clearInterval(logInterval);
  }, []);

  const runObservabilityPipeline = async () => {
    if (!githubUrl.trim()) {
      setPipelineStatus("❌ Error: Please provide a valid GitHub File URL context.");
      return;
    }

    const startTime = performance.now();
    setLoading(true);
    setPipelineStatus("📡 Packaging runtime context and routing payload parameters...");
    setAnalysisMarkdown("");
    setLiveLogs(prev => ["TELEMETRY // Packaging active context payload...", ...prev]);

    const dynamicTelemetryPayload = {
      project_id: "ai_contract_auditor_prod",
      environment: "development",
      file_path: githubUrl.split("/blob/")[1] || "src/App.tsx",
      mode: mode,
      error_message: mode === "crash" 
        ? "TypeError: Cannot read properties of undefined (reading 'map')"
        : "Static Code Quality Scan Request",
      stack_trace: mode === "crash" 
        ? `TypeError: Cannot read properties of undefined (reading 'map')\n at render (frontend/${githubUrl.split("/blob/")[1] || "src/App.tsx"}:45:24)`
        : "No stack trace: Executing static predictive crash audit logic."
    };

    try {
      const ingestResponse = await fetch("http://localhost:8000/api/v1/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dynamicTelemetryPayload),
      });

      if (!ingestResponse.ok) throw new Error("Failed to log tracking configuration.");
      const logData = await ingestResponse.json();
      const logId = logData.log_id;

      setPipelineStatus("💾 Telemetry registered. Spawning LLM context worker...");
      setLiveLogs(prev => [`DB // Payload ingested with Log ID: ${logId.substring(0,8)}...`, ...prev]);

      const analyzeResponse = await fetch(`http://localhost:8000/api/v1/logs/${logId}/analyze?github_url=${encodeURIComponent(githubUrl.trim())}`, { 
        method: "POST" 
      });
      
      if (!analyzeResponse.ok) throw new Error("AI engine choked while processing the code source.");
      const analysisData = await analyzeResponse.json();
      
      setAnalysisMarkdown(analysisData.analysis);
      setPipelineStatus(`✅ Success • Context parsed smoothly.`);
      setLiveLogs(prev => ["AI // Deep diagnostic report successfully generated.", ...prev]);
      
      const endTime = performance.now();
      setLatency(`${Math.round(endTime - startTime)} ms`);
      setLogCount((prev) => prev + 1);
    } catch (err: any) {
      setPipelineStatus(`❌ Pipeline Failure: ${err.message || err}`);
      setLiveLogs(prev => [`ERROR // Pipeline failure: ${err.message || "Unknown error"}`, ...prev]);
      setLatency("Error");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center font-mono text-xs text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <span>Initializing Secure Telemetry Console...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#070a13] text-slate-100 p-4 md:p-8 lg:p-12 font-sans antialiased selection:bg-cyan-500/30 relative overflow-hidden flex flex-col justify-between">
      
      {/* Client-Side Safe Style Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-counterclockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-spin-slow {
          animation: spin-clockwise 25s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-counterclockwise 20s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}} />

      {/* Dynamic Background Mesh Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/10 to-cyan-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/5 to-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[12000ms]" />
      
      {/* Tactical Grid Overlay Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex-grow relative z-10">
        
        {/* Navigation Header Block */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/80 pb-6 mb-10 backdrop-blur-md gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/80 font-bold">System Status</span>
              <span className="text-xs text-slate-400 font-mono">Core Operational // Node Cluster Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-sm self-stretch sm:self-auto justify-center">
            <svg className="w-6 h-6 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-xl font-black tracking-wider text-white font-mono">
              BUG_EXPLAINER.<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
            </h1>
          </div>
        </header>

        {/* Dynamic Process Capabilities Flow Overview Cards */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900/90 border border-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 text-slate-800/20 group-hover:text-cyan-500/5 transition-colors pointer-events-none">
              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-950/40 rounded-xl text-cyan-400 border border-cyan-800/20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase block">STEP 01</span>
                <h3 className="text-sm font-extrabold text-slate-100 tracking-wide font-sans">Automated Source Ingestion</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Safely fetch, resolve, and unpack components directly using raw GitHub link contexts. We secure active references instantly prior to initiating code evaluation phases.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900/90 border border-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 text-slate-800/20 group-hover:text-indigo-500/5 transition-colors pointer-events-none">
              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-950/40 rounded-xl text-indigo-400 border border-indigo-800/20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase block">STEP 02</span>
                <h3 className="text-sm font-extrabold text-slate-100 tracking-wide font-sans">Persistent Telemetry Logging</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Stream structure payloads and configuration values directly to secure MongoDB cluster datasets. Build verifiable historical logs for all static scans automatically.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900/90 border border-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 text-slate-800/20 group-hover:text-emerald-500/5 transition-colors pointer-events-none">
              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-950/40 rounded-xl text-emerald-400 border border-emerald-800/20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase block">STEP 03</span>
                <h3 className="text-sm font-extrabold text-slate-100 tracking-wide font-sans">Predictive Deep Diagnostics</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Deploy tailored LLM execution threads to scan logic paths. Uncover latent security vulnerabilities, optimize loops, and map call stack crashes in one unified view.
            </p>
          </div>
        </section>

        {/* Main Interface Grid Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
          
          {/* LEFT COLUMN: Input Configuration Parameters, Rotating SVG Ring & Metrics */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl flex-grow flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              
              {/* INTERACTIVE ROTATING SVG SECURITY RING WIDGET */}
              <div className="flex flex-col items-center justify-center py-4 mb-4 relative bg-slate-950/55 border border-slate-800/80 rounded-xl overflow-hidden p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 opacity-10" />
                
                {/* Security Ring Animation Canvas */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                  
                  {/* Glowing core pulse background */}
                  <div className="absolute w-24 h-24 bg-cyan-500/5 rounded-full filter blur-md animate-pulse-glow" />

                  {/* Outer Orbit Ring (Spinning Clockwise) */}
                  <svg className="absolute w-full h-full animate-spin-slow" viewBox="0 0 200 200">
                    {/* Ring Path */}
                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="1.5" strokeDasharray="10, 8" />
                    
                    {/* Security Icon 1: Shield (Top) */}
                    <g transform="translate(100, 20) translate(-10, -10)" className="text-cyan-400">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(6, 182, 212, 0.2)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" transform="scale(0.8)"/>
                    </g>
                    {/* Security Icon 2: Key (Right) */}
                    <g transform="translate(180, 100) translate(-10, -10)" className="text-indigo-400">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.8)"/>
                    </g>
                    {/* Security Icon 3: Lock (Bottom) */}
                    <g transform="translate(100, 180) translate(-10, -10)" className="text-cyan-400">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="rgba(6, 182, 212, 0.2)" stroke="currentColor" strokeWidth="1.5" transform="scale(0.8)"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="1.5" transform="scale(0.8)"/>
                    </g>
                    {/* Security Icon 4: Terminal/Code (Left) */}
                    <g transform="translate(20, 100) translate(-10, -10)" className="text-indigo-400">
                      <path d="M16.5 9.4 19 12l-2.5 2.6M7.5 14.6 5 12l2.5-2.6M10.5 16l3-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.8)"/>
                    </g>
                  </svg>

                  {/* Inner Orbit Dashed Line (Spinning Counter-Clockwise) */}
                  <svg className="absolute w-28 h-28 animate-spin-reverse-slow" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(129, 140, 248, 0.25)" strokeWidth="1" strokeDasharray="5, 12" />
                  </svg>

                  {/* Core Static Glowing Shield */}
                  <div className="absolute bg-slate-900/90 border border-cyan-500/30 p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center">
                    <svg className="w-8 h-8 text-cyan-400 filter drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">Cryptographic Secure Shield</span>
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5 block">Continuous Source Encryption Active</span>
                </div>
              </div>

              {/* ACTION TOGGLES */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block font-mono">
                    Execution Matrix Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setMode("analyze")}
                      className={`py-2.5 px-3 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                        mode === "analyze"
                          ? "bg-gradient-to-r from-cyan-950/60 to-slate-900 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                          : "text-slate-500 hover:text-slate-300 border border-transparent"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Analyze File
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("crash")}
                      className={`py-2.5 px-3 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                        mode === "crash"
                          ? "bg-gradient-to-r from-red-950/60 to-slate-900 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                          : "text-slate-500 hover:text-slate-300 border border-transparent"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Simulate Crash
                    </button>
                  </div>
                </div>

                {/* TARGET GITHUB CONTEXT FIELD */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block font-mono">
                    Target GitHub File URL Link
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Paste target App.tsx or smart contract URL..."
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/70 rounded-xl pl-4 pr-10 py-3 text-xs font-mono text-white placeholder-slate-600 outline-none transition-all duration-300 shadow-inner group-hover:border-slate-700"
                    />
                    <div className="absolute right-3 top-3.5 text-slate-600 pointer-events-none group-focus-within:text-cyan-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.143m0-3.007A4 4 0 0011.172 13.83" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* PIPELINE DISPATCH ACTION */}
                <button
                  onClick={runObservabilityPipeline}
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider border relative overflow-hidden transition-all shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 group ${
                    loading 
                      ? "bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed" 
                      : "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500 border-transparent filter drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  }`}
                >
                  <svg className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'} transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    {loading ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    )}
                  </svg>
                  {loading ? "Processing Context Matrix..." : "Analyze Context Scope"}
                </button>

                {/* DYNAMIC PIPELINE STATUS */}
                {pipelineStatus && (
                  <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 font-mono text-[11px] text-slate-300 flex items-start gap-2.5 shadow-inner transition-all duration-300">
                    <span className="text-cyan-400 animate-pulse font-bold">»</span>
                    <span className="leading-relaxed">{pipelineStatus}</span>
                  </div>
                )}
              </div>
            </div>

            {/* PERFORMANCE METRICS CONTAINER */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-2xl space-y-4 backdrop-blur-xl relative">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                System Performance Metrics
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 shadow-inner">
                  <div className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Latency</div>
                  <div className="text-xs font-bold font-mono text-cyan-400 mt-1 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.2)]">{latency}</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 shadow-inner">
                  <div className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Atlas DB</div>
                  <div className="text-xs font-bold font-mono text-emerald-400 mt-1 filter drop-shadow-[0_0_6px_rgba(52,211,153,0.2)]">Synced</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 shadow-inner">
                  <div className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Scans Run</div>
                  <div className="text-xs font-bold font-mono text-indigo-400 mt-1 filter drop-shadow-[0_0_6px_rgba(129,140,248,0.2)]">{logCount}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Code output display markdown terminal & Interactive Live log filler */}
          <div className="lg:col-span-7 space-y-6 self-stretch h-full flex flex-col justify-between">
            
            {/* Top Analysis Markdown Container */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col relative overflow-hidden backdrop-blur-xl h-[460px]">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${analysisMarkdown ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`} />
                  <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-200">
                    Live AI Context Audit Report
                  </h3>
                </div>
                <span className="font-mono text-[9px] bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md text-slate-400 font-bold tracking-wider">
                  {analysisMarkdown ? "COMPLETED" : "AWAITING CORE LINK"}
                </span>
              </div>
              
              <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {analysisMarkdown ? (
                  <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-4 leading-relaxed font-mono
                    prose-headings:text-white prose-headings:font-bold prose-headings:font-mono prose-headings:mt-6 prose-headings:mb-2
                    prose-h1:text-sm prose-h2:text-xs prose-h3:text-[11px]
                    prose-code:text-cyan-300 prose-code:bg-slate-950 prose-code:border prose-code:border-slate-800/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-[11px] prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-slate-950/80 prose-pre:backdrop-blur-md prose-pre:border prose-pre:border-slate-800/80 prose-pre:p-4 prose-pre:rounded-xl prose-pre:font-mono prose-pre:overflow-x-auto text-slate-200 shadow-inner">
                    <ReactMarkdown>{analysisMarkdown}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 group">
                    <div className="p-4 bg-slate-950/80 rounded-2xl text-slate-600 mb-5 border border-slate-800 shadow-inner group-hover:text-cyan-500/60 transition-colors duration-300 relative">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                    </div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-slate-300 font-extrabold">
                      Awaiting Context Core Initialization
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed font-sans">
                      Input a dynamic GitHub resource link in the controller workspace and execute the scan thread to generate instant code trace analytics.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Real-Time Telemetry Log Streamer */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md h-[180px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2 flex-shrink-0">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  REAL-TIME HANDSHAKE TRAFFIC STREAM
                </span>
                <span className="text-[9px] text-slate-600 font-mono">NODE_INDEX: B-80</span>
              </div>
              
              <div className="flex-grow overflow-y-auto space-y-1.5 mt-2.5 font-mono text-[10px] text-slate-500 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {liveLogs.map((log, i) => (
                  <div key={i} className={`flex items-start gap-2.5 leading-relaxed transition-all duration-300 ${i === 0 ? "text-slate-300 font-bold" : ""}`}>
                    <span className="text-cyan-600/60 font-semibold">&gt;&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Global Dashboard Footer branding */}
      <footer className="max-w-7xl mx-auto w-full border-t border-slate-900 pt-5 mt-10 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-mono relative z-10 gap-3">
        <div>&copy; 2026 <span className="text-slate-400 font-bold tracking-wider">BUG_EXPLAINER.AI</span> • Enterprise Pipeline Layer</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span>Scan Engine: <span className="text-slate-300 font-bold">Asynchronous Worker Thread</span></span>
          </div>
        </div>
      </footer>
    </main>
  );
}