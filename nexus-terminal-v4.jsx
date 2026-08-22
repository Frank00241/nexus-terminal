import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";

// ─── DONNÉES ──────────────────────────────────────────────────────────────────
const BASE = {
  NVDA: {
    name:"NVIDIA", sector:"Semi-IA", base:183.91, color:"#76b900",
    t1:196, t2:212, t3:268, stop:162, entryLow:175, entryHigh:182,
    pe:36, fwdPe:28, rev:130.5, revGrowth:78, grossMargin:73, roe:130,
    signal:"ACHETER", signalDesc:"Signal Convergent confirmé — Fondamentaux + technique alignés",
    pilier:"Pilier 1", conviction:5, mktcap:"4.42T",
    eps:1.62, nextEps:1.76, earningsDate:"20 mai 2026",
    low52:95.04, high52:212.19,
    thesis:"Leader mondial GPU IA. Marge EBITDA 61.7%. Supercycle IA intact. Investissement $2B dans Marvell.",
    risks:"Contrôles export Chine. Concurrence AMD/ASIC. Valorisation déjà élevée.",
    hist:[138,140,143,148,153,158,162,167,171,175,178,180,183.91],
    peers:[
      {n:"AMD",  pe:80,  growth:34,  margin:57, verdict:"JUSTE",c:"#f5a623"},
      {n:"AVGO", pe:35,  growth:25,  margin:65, verdict:"JUSTE",c:"#f5a623"},
      {n:"TSMC", pe:25,  growth:38,  margin:58, verdict:"SOUS", c:"#3fb950"},
      {n:"INTC", pe:999, growth:-4,  margin:33, verdict:"SUR",  c:"#f85149"},
    ]
  },
  AMD: {
    name:"AMD", sector:"Semi-IA", base:236.64, color:"#ed1c24",
    t1:250, t2:267, t3:289, stop:207, entryLow:220, entryHigh:228,
    pe:80, fwdPe:45, rev:10.27, revGrowth:34, grossMargin:57, roe:22,
    signal:"SURVEILLER", signalDesc:"Momentum fort mais 7 jours consécutifs de hausse — divergence volume détectée",
    pilier:"Pilier 1/2", conviction:4, mktcap:"385.8B",
    eps:1.53, nextEps:1.27, earningsDate:"5 mai 2026",
    low52:76.48, high52:267.08,
    thesis:"Challenger NVDA en IA. CA +34% YoY. Partenariat OpenAI H2 2026. Data center +60% prévu.",
    risks:"P/E >80 exige croissance soutenue. Dépendance TSMC. Position proche du sommet 52 sem.",
    hist:[130,138,148,158,168,175,182,190,198,206,215,224,236.64],
    peers:[
      {n:"NVDA", pe:36,  growth:78,  margin:73, verdict:"SOUS", c:"#3fb950"},
      {n:"AVGO", pe:35,  growth:25,  margin:65, verdict:"JUSTE",c:"#f5a623"},
      {n:"MRVL", pe:50,  growth:27,  margin:50, verdict:"JUSTE",c:"#f5a623"},
      {n:"QCOM", pe:15,  growth:12,  margin:56, verdict:"SOUS", c:"#3fb950"},
    ]
  },
  ORCL: {
    name:"Oracle", sector:"Cloud IA", base:143.09, color:"#f80000",
    t1:165, t2:200, t3:261, stop:122, entryLow:135, entryHigh:143,
    pe:24.74, fwdPe:20, rev:17.2, revGrowth:22, grossMargin:32, roe:999,
    signal:"ACHETER", signalDesc:"Opportunité contrariante — -59% du sommet avec RPO $553B intact",
    pilier:"Pilier 1", conviction:4, mktcap:"396B",
    eps:1.47, nextEps:1.55, earningsDate:"Juin 2026",
    low52:118.86, high52:345.72,
    thesis:"Transformation cloud réelle. RPO $553B (+325% YoY). Cloud infra +84% YoY. Contrats OpenAI/Meta/xAI.",
    risks:"FCF négatif. Capex $50B presse le bilan. Dette LT >$100B. Menace Iran sur infra MO.",
    hist:[290,310,330,345,310,270,230,200,175,160,152,148,143.09],
    peers:[
      {n:"MSFT", pe:32,  growth:14,  margin:45, verdict:"JUSTE",c:"#f5a623"},
      {n:"AMZN", pe:38,  growth:17,  margin:39, verdict:"JUSTE",c:"#f5a623"},
      {n:"GOOGL",pe:22,  growth:28,  margin:18, verdict:"SOUS", c:"#3fb950"},
      {n:"SNOW", pe:999, growth:29,  margin:74, verdict:"SUR",  c:"#f85149"},
    ]
  },
  TSLA: {
    name:"Tesla", sector:"EV / IA", base:345.62, color:"#cc0000",
    t1:374, t2:420, t3:465, stop:305, entryLow:310, entryHigh:325,
    pe:321, fwdPe:185, rev:24.9, revGrowth:-10, grossMargin:18, roe:4.89,
    signal:"ATTENDRE", signalDesc:"Risque binaire pré-earnings 22 avril — P/E 321x non justifié actuellement",
    pilier:"Pilier 3", conviction:2, mktcap:"1.297T",
    eps:1.08, nextEps:0.39, earningsDate:"22 avr 2026",
    low52:222.79, high52:498.83,
    thesis:"Pivot robotaxi/IA avec Cybercab. FSD v14.3. Potentiel asymétrique si exécution robotaxi réussie.",
    risks:"P/E 321x. Livraisons Q1 -14% séquentiel. 3e année de déclin EV. Boycott marque en hausse.",
    hist:[420,460,490,480,450,430,415,400,390,380,365,353,345.62],
    peers:[
      {n:"BYD",  pe:12,  growth:45,  margin:19, verdict:"SOUS", c:"#3fb950"},
      {n:"RIVN", pe:999, growth:16,  margin:-9, verdict:"SPEC", c:"#8b949e"},
      {n:"RACE", pe:45,  growth:12,  margin:53, verdict:"JUSTE",c:"#f5a623"},
      {n:"F",    pe:6,   growth:3,   margin:15, verdict:"SOUS", c:"#3fb950"},
    ]
  },
};

const MARKET=[
  {l:"S&P 500",v:"6 760",chg:"-0.33%",up:false},
  {l:"Nasdaq", v:"22 822",chg:"+0.83%",up:true},
  {l:"TSX",    v:"33 620 CAD",chg:"+1.15%",up:true},
  {l:"VIX",    v:"19.27",chg:"-1.13%",up:false},
  {l:"WTI",    v:"$97.43",chg:"+3.20%",up:true},
  {l:"Or",     v:"$4 786",chg:"-0.66%",up:false},
  {l:"USD/CAD",v:"1.386",chg:"-0.09%",up:false},
  {l:"10Y US", v:"4.293%",chg:"+0.05%",up:true},
  {l:"Bitcoin",v:"$71.6K",chg:"+0.84%",up:true},
];

const MONTHS=["Oct","Nov","Déc","Jan","Fév","Mar","Avr"];

// ─── GUIDE DES INDICATEURS ────────────────────────────────────────────────────
const GUIDES = {
  radar: {
    title:"🕸️ Comment lire le Radar",
    desc:"Le radar compare 5 dimensions simultanément. Plus la surface est grande, meilleur est le profil global.",
    items:[
      {icon:"📈",name:"Croissance",color:"#3fb950",
       explain:"Taux de croissance du chiffre d'affaires (YoY). Plus tu es loin du centre = croissance plus forte. NVDA mène avec +78%."},
      {icon:"💰",name:"Marge",color:"#58a6ff",
       explain:"Marge brute en %. Mesure l'efficacité opérationnelle. NVDA (73%) vs TSLA (18%) — différence énorme."},
      {icon:"🏷️",name:"Valorisation",color:"#f5a623",
       explain:"INVERSÉ — loin du centre = titre BON MARCHÉ. ORCL (P/E 24) score fort. TSLA (P/E 321) écrasé au centre."},
      {icon:"⚡",name:"Momentum",color:"#e879f9",
       explain:"Position du prix dans la fourchette 52 semaines. AMD proche du sommet = fort. ORCL dans le bas = faible."},
      {icon:"⭐",name:"Conviction",color:"#f59e0b",
       explain:"Score NEXUS 1→5 étoiles converti en %. NVDA (5★=100%), TSLA (2★=40%). Synthèse de tous les signaux."},
    ]
  },
  heatmap: {
    title:"🌡️ Comment lire la Heatmap",
    desc:"Chaque cellule est colorée selon la valeur : vert = bon, orange = neutre, rouge = mauvais.",
    items:[
      {icon:"🔴",name:"P/E ratio",color:"#3fb950",
       explain:"Prix divisé par les bénéfices. <40 = raisonnable (vert). 40-80 = cher (orange). >80 = très cher (rouge). Attention : P/E élevé peut être justifié par une forte croissance."},
      {icon:"📊",name:"Croissance CA%",color:"#58a6ff",
       explain:">30% = vert. 0-30% = orange. Négatif = rouge. Mesure la vitesse d'expansion de l'entreprise."},
      {icon:"💵",name:"Marge brute%",color:"#f5a623",
       explain:">60% = vert (business de logiciel/tech pur). 30-60% = orange. <30% = rouge. Indique le pouvoir de fixation des prix."},
      {icon:"🎯",name:"Upside T3%",color:"#e879f9",
       explain:"Potentiel de hausse vers la cible T3 de NEXUS depuis le prix actuel. >50% = vert. 20-50% = orange."},
      {icon:"⭐",name:"Conviction",color:"#f59e0b",
       explain:"Score global NEXUS. Synthèse technique + fondamentale + macro. 5/5 = position de conviction maximale."},
    ]
  },
  rr: {
    title:"⚖️ Comment lire le Ratio R/R",
    desc:"Le ratio Risque/Rendement compare combien tu peux gagner vs combien tu peux perdre sur une même opération.",
    items:[
      {icon:"✅",name:"R/R ≥ 3:1 — Excellent",color:"#3fb950",
       explain:"Pour chaque dollar risqué, tu en gagnes 3 potentiellement. C'est le seuil minimum recommandé par NEXUS pour les Piliers 1 et 2."},
      {icon:"🟡",name:"R/R 2:1 — Acceptable",color:"#f5a623",
       explain:"Acceptable uniquement avec une conviction très forte (4-5 étoiles) ou dans le cadre d'une position déjà en profit."},
      {icon:"🔴",name:"R/R <2:1 — Éviter",color:"#f85149",
       explain:"Ratio défavorable. Sauf exception documentée dans JOURNAL.md avec approbation SOVEREIGN."},
      {icon:"📐",name:"Calcul",color:"#58a6ff",
       explain:"R/R = (Cible - Entrée) ÷ (Entrée - Stop Loss). Ex: Entrée $180, T1 $196, SL $162 → gain $16 ÷ perte $18 = 0.89:1 (mauvais). Attendre entrée $175 → gain $21 ÷ perte $13 = 1.6:1."},
    ]
  },
  signal: {
    title:"🎯 Signal Convergent — Empire Capital",
    desc:"Une décision d'achat nécessite l'alignement de plusieurs agents. Plus d'agents alignés = conviction plus haute.",
    items:[
      {icon:"⭐⭐⭐⭐⭐",name:"Conviction Maximale (5/5)",color:"#3fb950",
       explain:"NEXUS + ORACLE+ + SIGMA + STRATEGOS + PULSE tous alignés. Allocation jusqu'à 8% du portefeuille. Très rare."},
      {icon:"⭐⭐⭐⭐",name:"Forte (4/5)",color:"#58a6ff",
       explain:"4 agents sur 5 alignés. Allocation 3-6% du portefeuille. Signal standard pour Pilier 1."},
      {icon:"⭐⭐⭐",name:"Modérée (3/5)",color:"#f5a623",
       explain:"Allocation max 2-3%. Surveiller de près. Souvent associé à une entrée sur correction."},
      {icon:"⭐⭐",name:"Insuffisante (<3/5)",color:"#f85149",
       explain:"Ne pas déployer de capital. Attendre clarification ou meilleure zone d'entrée. TSLA est ici actuellement."},
    ]
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function jitter(v){ return +(v*(1+(Math.random()-0.5)*0.004)).toFixed(2); }

const C={
  bg:"#0d1117", card:"#161b22", border:"#21262d", deep:"#0d1117",
  text:"#e6edf3", muted:"#8b949e", dim:"#484f58",
  green:"#3fb950", blue:"#58a6ff", yellow:"#f5a623",
  red:"#f85149", purple:"#e879f9",
};

const Tip=({active,payload,label})=>{
  if(!active||!payload?.length) return null;
  return(
    <div style={{background:C.bg,border:`1px solid ${C.border}`,padding:"6px 12px",borderRadius:6,fontSize:11}}>
      <div style={{color:C.muted,marginBottom:2}}>{label}</div>
      {payload.map(p=>(
        <div key={p.name} style={{color:p.color||C.blue,fontWeight:700}}>
          {typeof p.value==="number"?`$${p.value.toFixed(2)}`:p.value}
        </div>
      ))}
    </div>
  );
};

const Stars=({n,max=5,size=13})=>(
  <span>{Array.from({length:max},(_,i)=>(
    <span key={i} style={{color:i<n?C.yellow:C.border,fontSize:size}}>★</span>
  ))}</span>
);

const Badge=({signal})=>{
  const sc=signal==="ACHETER"?C.green:signal==="SURVEILLER"?C.yellow:C.red;
  return(
    <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:4,
      border:`1px solid ${sc}44`,color:sc,background:`${sc}11`}}>{signal}</span>
  );
};

const Pill=({label,value,color})=>(
  <div style={{background:C.deep,borderRadius:8,padding:"10px 12px",border:`1px solid ${C.border}`}}>
    <div style={{fontSize:8,color:C.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>{label}</div>
    <div style={{fontSize:13,fontWeight:700,color:color||C.text}}>{value}</div>
  </div>
);

// ─── GUIDE MODAL ─────────────────────────────────────────────────────────────
const GuidePanel=({guide,onClose})=>(
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,
    display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{background:C.card,border:`1px solid ${C.blue}`,borderRadius:16,
      padding:24,maxWidth:520,width:"100%",maxHeight:"80vh",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:15,fontWeight:700,color:C.blue}}>{guide.title}</div>
        <button onClick={onClose} style={{background:"transparent",border:"none",
          color:C.muted,cursor:"pointer",fontSize:18,lineHeight:1}}>✕</button>
      </div>
      <div style={{fontSize:12,color:C.muted,marginBottom:16,lineHeight:1.6}}>{guide.desc}</div>
      {guide.items.map((item,i)=>(
        <div key={i} style={{background:C.deep,borderRadius:10,padding:"12px 14px",
          marginBottom:10,border:`1px solid ${item.color}33`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{fontSize:16}}>{item.icon}</span>
            <span style={{fontWeight:700,fontSize:12,color:item.color}}>{item.name}</span>
          </div>
          <p style={{fontSize:11,color:C.muted,margin:0,lineHeight:1.6}}>{item.explain}</p>
        </div>
      ))}
    </div>
  </div>
);

const HelpBtn=({onClick})=>(
  <button onClick={onClick} style={{background:"transparent",
    border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 10px",
    cursor:"pointer",color:C.muted,fontSize:10}}>❓ Guide</button>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [prices,setPrices]=useState(()=>{
    const p={}; Object.keys(BASE).forEach(k=>{p[k]=BASE[k].base}); return p;
  });
  const [active,setActive]=useState("NVDA");
  const [view,setView]=useState("overview");
  const [tab,setTab]=useState("chart");
  const [guide,setGuide]=useState(null);

  useEffect(()=>{
    const id=setInterval(()=>{
      setPrices(prev=>{
        const n={}; Object.keys(BASE).forEach(k=>{n[k]=jitter(prev[k])}); return n;
      });
    },3000);
    return ()=>clearInterval(id);
  },[]);

  const s=BASE[active];
  const lp=prices[active];
  const chg=+((lp-s.base)/s.base*100).toFixed(2);
  const pct52=((lp-s.low52)/(s.high52-s.low52)*100).toFixed(0);
  const hist=s.hist.slice(0,-1).map((p,i)=>({d:MONTHS[i],p})).concat([{d:"Avr",p:lp}]);

  // ── OVERVIEW ────────────────────────────────────────────────────────────────
  const OverviewCard=({ticker})=>{
    const st=BASE[ticker]; const lv=prices[ticker];
    const cv=+((lv-st.base)/st.base*100).toFixed(2);
    const pp=((lv-st.low52)/(st.high52-st.low52)*100).toFixed(0);
    const miniH=st.hist.slice(0,-1).map((p,i)=>({d:MONTHS[i],p})).concat([{d:"Avr",p:lv}]);
    return(
      <div onClick={()=>{setActive(ticker);setView("detail");setTab("chart");}}
        style={{background:active===ticker?"#1c2128":C.card,
          border:`1px solid ${active===ticker?st.color:C.border}`,
          borderRadius:12,padding:"14px 16px",cursor:"pointer",transition:"all 0.2s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:st.color,letterSpacing:1}}>{ticker}</div>
            <div style={{fontSize:11,color:C.muted}}>{st.name}</div>
          </div>
          <Badge signal={st.signal}/>
        </div>
        <div style={{fontSize:22,fontWeight:700,marginBottom:2}}>
          ${lv.toFixed(2)}
          <span style={{fontSize:12,marginLeft:6,color:cv>=0?C.green:C.red}}>
            {cv>=0?"+":""}{cv}%
          </span>
        </div>
        <div style={{height:55,margin:"8px 0"}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={miniH} margin={{top:2,right:0,left:0,bottom:0}}>
              <defs>
                <linearGradient id={`g${ticker}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={st.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={st.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="p" stroke={st.color} strokeWidth={1.5}
                fill={`url(#g${ticker})`} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:"#21262d",borderRadius:3,height:5,position:"relative",marginBottom:4}}>
          <div style={{position:"absolute",left:0,top:0,height:"100%",borderRadius:3,
            width:`${pp}%`,background:`linear-gradient(90deg,${C.green},${st.color})`}}/>
          <div style={{position:"absolute",top:-3,width:11,height:11,borderRadius:"50%",
            background:st.color,border:`2px solid ${C.bg}`,left:`calc(${pp}% - 5.5px)`}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:C.dim,marginBottom:10}}>
          <span>${st.low52}</span><span style={{color:C.muted}}>{pp}% fourchette</span><span>${st.high52}</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          paddingTop:8,borderTop:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,color:C.muted}}>P/E <span style={{
            color:st.pe>100?C.red:st.pe>50?C.yellow:C.green,fontWeight:700}}>
            {st.pe>300?"300+":st.pe}</span></div>
          <Stars n={st.conviction}/>
          <div style={{fontSize:9,color:C.muted}}>{st.pilier}</div>
        </div>
      </div>
    );
  };

  // ── DETAIL ──────────────────────────────────────────────────────────────────
  const DetailView=()=>(
    <div style={{display:"grid",gap:16}}>
      {/* Header card */}
      <div style={{background:C.card,borderRadius:12,border:`1px solid ${s.color}55`,padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:12}}>
          <div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:6}}>
              <span style={{fontSize:22,fontWeight:700}}>{s.name}</span>
              <span style={{background:C.border,padding:"2px 8px",borderRadius:4,fontSize:11,color:C.muted}}>{active}</span>
              <Badge signal={s.signal}/>
              <span style={{fontSize:9,color:C.green}}>🟢 LIVE</span>
            </div>
            <div style={{fontSize:30,fontWeight:700}}>
              ${lp.toFixed(2)}
              <span style={{fontSize:13,marginLeft:8,color:chg>=0?C.green:C.red}}>
                {chg>=0?"+":""}{chg}%
              </span>
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:6,maxWidth:400,lineHeight:1.5}}>
              {s.signalDesc}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,alignSelf:"flex-start"}}>
            <Pill label="Cap. marché" value={s.mktcap} color={C.blue}/>
            <Pill label="Secteur" value={s.sector}/>
            <Pill label="Pilier" value={s.pilier} color={C.yellow}/>
            <Pill label="Résultats" value={s.earningsDate} color={C.red}/>
          </div>
        </div>
        {/* 52W */}
        <div style={{marginTop:8}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.muted,marginBottom:4}}>
            <span>Bas 52 sem: ${s.low52}</span>
            <span style={{color:C.text}}>Position: {pct52}% de la fourchette</span>
            <span>Haut 52 sem: ${s.high52}</span>
          </div>
          <div style={{background:"#21262d",borderRadius:4,height:8,position:"relative"}}>
            <div style={{position:"absolute",left:0,top:0,height:"100%",borderRadius:4,
              width:`${pct52}%`,background:`linear-gradient(90deg,${C.green},${s.color})`}}/>
            <div style={{position:"absolute",top:-2,width:12,height:12,borderRadius:"50%",
              background:s.color,border:`2px solid ${C.bg}`,left:`calc(${pct52}% - 6px)`}}/>
          </div>
        </div>
      </div>

      {/* Thèse + risques */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.green}33`,padding:14}}>
          <div style={{fontSize:9,color:C.green,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>✅ Thèse haussière</div>
          <div style={{fontSize:11,color:C.muted,lineHeight:1.7}}>{s.thesis}</div>
        </div>
        <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.red}33`,padding:14}}>
          <div style={{fontSize:9,color:C.red,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>⚠️ Risques principaux</div>
          <div style={{fontSize:11,color:C.muted,lineHeight:1.7}}>{s.risks}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {[
          {k:"chart",l:"📈 Graphique"},
          {k:"niveaux",l:"🎯 Niveaux"},
          {k:"fondamentaux",l:"📋 Fondamentaux"},
          {k:"oracle",l:"🔮 Oracle+"},
        ].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{
            background:tab===t.k?"#21262d":"transparent",
            border:tab===t.k?`1px solid ${C.blue}`:`1px solid ${C.border}`,
            borderRadius:6,padding:"6px 14px",cursor:"pointer",
            color:tab===t.k?C.blue:C.muted,fontSize:10,fontWeight:700,
          }}>{t.l}</button>
        ))}
      </div>

      {/* CHART */}
      {tab==="chart" && (
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:20}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>
            Évolution 6 mois — {active}
          </div>
          <div style={{height:260}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hist} margin={{top:10,right:30,left:-15,bottom:0}}>
                <defs>
                  <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.35}/>
                    <stop offset="95%" stopColor={s.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="d" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} domain={["auto","auto"]}/>
                <Tooltip content={<Tip/>}/>
                <ReferenceLine y={s.t1} stroke={C.yellow} strokeDasharray="4 4"
                  label={{value:"T1",fill:C.yellow,fontSize:9,position:"insideTopRight"}}/>
                <ReferenceLine y={s.t2} stroke={C.blue} strokeDasharray="4 4"
                  label={{value:"T2",fill:C.blue,fontSize:9,position:"insideTopRight"}}/>
                <ReferenceLine y={s.stop} stroke={C.red} strokeDasharray="4 4"
                  label={{value:"SL",fill:C.red,fontSize:9,position:"insideBottomRight"}}/>
                <Area type="monotone" dataKey="p" stroke={s.color} strokeWidth={2.5}
                  fill="url(#mainGrad)" dot={false} activeDot={{r:5,fill:s.color}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:16}}>
            <Pill label="Zone d'entrée" value={`$${s.entryLow}–${s.entryHigh}`} color={C.green}/>
            <Pill label="Stop Loss" value={`$${s.stop}`} color={C.red}/>
            <Pill label="Cible T3" value={`$${s.t3}`} color={C.blue}/>
            <Pill label="Conviction" value={<Stars n={s.conviction}/>}/>
          </div>
        </div>
      )}

      {/* NIVEAUX */}
      {tab==="niveaux" && (
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase"}}>Niveaux clés</div>
            <HelpBtn onClick={()=>setGuide(GUIDES.rr)}/>
          </div>
          <div style={{display:"grid",gap:8,marginBottom:20}}>
            {[
              {l:"🎯 Cible T3 — Consensus analystes",v:`$${s.t3}`,c:C.blue,bg:`${C.blue}08`},
              {l:"🎯 Cible T2",v:`$${s.t2}`,c:C.blue,bg:`${C.blue}05`},
              {l:"🎯 Cible T1",v:`$${s.t1}`,c:C.yellow,bg:`${C.yellow}06`},
              {l:"📍 Zone d'entrée idéale",v:`$${s.entryLow} – $${s.entryHigh}`,c:C.green,bg:`${C.green}06`},
              {l:"📍 Prix actuel",v:`$${lp.toFixed(2)}`,c:s.color,bg:`${s.color}11`},
              {l:"🛑 Stop Loss",v:`$${s.stop}`,c:C.red,bg:`${C.red}06`},
            ].map(n=>(
              <div key={n.l} style={{background:n.bg,border:`1px solid ${n.c}22`,
                borderRadius:8,padding:"12px 16px",display:"flex",
                justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,color:C.muted}}>{n.l}</span>
                <span style={{fontSize:16,fontWeight:700,color:n.c}}>{n.v}</span>
              </div>
            ))}
          </div>
          {/* R/R */}
          <div style={{background:C.deep,borderRadius:8,padding:14,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>
              Ratio Risque / Rendement (entrée milieu zone)
            </div>
            {[s.t1,s.t2,s.t3].map((t,i)=>{
              const mid=(s.entryLow+s.entryHigh)/2;
              const gain=t-mid; const loss=mid-s.stop;
              const rr=(gain/loss).toFixed(1);
              const ok=rr>=2;
              return(
                <div key={i} style={{display:"flex",justifyContent:"space-between",
                  alignItems:"center",marginBottom:10,paddingBottom:10,
                  borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
                  <div>
                    <div style={{fontSize:11,color:C.text}}>Vers T{i+1} — ${t}</div>
                    <div style={{fontSize:10,color:C.muted}}>
                      Gain potentiel: +${gain.toFixed(0)} | Risque: -${loss.toFixed(0)}
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:15,fontWeight:700,
                      color:rr>=3?C.green:rr>=2?C.yellow:C.red}}>1 : {rr}</div>
                    <div style={{fontSize:9,color:ok?C.green:C.red}}>
                      {rr>=3?"✅ Excellent":rr>=2?"🟡 Acceptable":"🔴 Éviter"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FONDAMENTAUX */}
      {tab==="fondamentaux" && (
        <div style={{display:"grid",gap:12}}>
          <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:20}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>
              Métriques financières clés
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
              {[
                {l:"BPA (TTM)",v:`$${s.eps}`,c:C.green},
                {l:"BPA estimé Q suivant",v:`$${s.nextEps}`,c:C.yellow},
                {l:"P/E TTM",v:s.pe>300?"300+":s.pe,c:s.pe>100?C.red:s.pe>50?C.yellow:C.green},
                {l:"P/E Forward",v:s.fwdPe,c:s.fwdPe>80?C.red:s.fwdPe>40?C.yellow:C.green},
                {l:"Chiffre d'affaires",v:`$${s.rev}B USD`,c:C.blue},
                {l:"Croissance CA YoY",v:`${s.revGrowth>0?"+":""}${s.revGrowth}%`,c:s.revGrowth>0?C.green:C.red},
                {l:"Marge brute",v:`${s.grossMargin}%`,c:s.grossMargin>50?C.green:s.grossMargin>25?C.yellow:C.red},
                {l:"Cap. boursière",v:s.mktcap,c:C.muted},
              ].map(m=>(
                <div key={m.l} style={{background:C.deep,borderRadius:8,padding:"12px 14px",border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:9,color:C.muted,marginBottom:4,textTransform:"uppercase"}}>{m.l}</div>
                  <div style={{fontSize:15,fontWeight:700,color:m.c}}>{m.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.red}33`,padding:16}}>
            <div style={{fontSize:9,color:C.red,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>
              ⚠️ Prochain événement binaire
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:11,color:C.muted,marginBottom:4}}>Résultats trimestriels</div>
                <div style={{fontSize:18,fontWeight:700,color:C.yellow}}>{s.earningsDate}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:4}}>BPA estimé: ${s.nextEps}</div>
              </div>
              <div style={{fontSize:11,color:C.red,fontWeight:700,
                padding:"8px 14px",border:`1px solid ${C.red}44`,borderRadius:8,
                background:`${C.red}08`}}>⚠️ Risque binaire</div>
            </div>
          </div>
        </div>
      )}

      {/* ORACLE+ */}
      {tab==="oracle" && (
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:20}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>
            🔮 Oracle+ — Analyse concurrentielle
          </div>
          {/* Header */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",
            gap:4,marginBottom:4,padding:"0 12px"}}>
            {["P/E","Croissance","Marge","Verdict"].map(h=>(
              <div key={h} style={{fontSize:9,color:C.muted,textAlign:"center",textTransform:"uppercase"}}>{h}</div>
            ))}
          </div>
          {/* Titre actif */}
          <div style={{background:`${s.color}11`,border:`1px solid ${s.color}44`,
            borderRadius:8,padding:"12px 16px",marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:700,color:s.color,marginBottom:8}}>
              ★ {active} — {s.name} (référence)
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:4}}>
              {[
                {v:s.pe>300?"300+":s.pe,c:s.pe>100?C.red:s.pe>50?C.yellow:C.green},
                {v:`${s.revGrowth>0?"+":""}${s.revGrowth}%`,c:s.revGrowth>0?C.green:C.red},
                {v:`${s.grossMargin}%`,c:s.grossMargin>50?C.green:s.grossMargin>25?C.yellow:C.red},
                {v:"RÉFÉRENCE",c:C.muted},
              ].map((m,i)=>(
                <div key={i} style={{textAlign:"center",fontWeight:700,fontSize:12,color:m.c}}>{m.v}</div>
              ))}
            </div>
          </div>
          {/* Concurrents */}
          {s.peers.map(p=>(
            <div key={p.n} style={{background:C.deep,border:`1px solid ${C.border}`,
              borderRadius:8,padding:"12px 16px",marginBottom:8}}>
              <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:8}}>{p.n}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:4}}>
                {[
                  {v:p.pe>300?"300+":p.pe,c:p.pe>100?C.red:p.pe>50?C.yellow:C.green},
                  {v:`${p.growth>0?"+":""}${p.growth}%`,c:p.growth>0?C.green:C.red},
                  {v:`${p.margin}%`,c:p.margin>50?C.green:p.margin>25?C.yellow:C.red},
                  {v:p.verdict,c:p.c},
                ].map((m,i)=>(
                  <div key={i} style={{textAlign:"center",fontWeight:700,fontSize:12,color:m.c}}>{m.v}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── HEATMAP ─────────────────────────────────────────────────────────────────
  const HeatmapView=()=>{
    const metrics=[
      {k:"P/E",tip:"Ratio prix/bénéfices — plus bas = moins cher"},
      {k:"Croiss.%",tip:"Croissance CA annuelle — plus haut = mieux"},
      {k:"Marge%",tip:"Marge brute — pouvoir de prix"},
      {k:"Upside%",tip:"Potentiel vers T3 — % gain possible"},
      {k:"Conviction",tip:"Score NEXUS 1-5 étoiles converti en %"},
    ];
    const getVal=(k,m)=>{
      const st=BASE[k];
      if(m==="P/E") return Math.min(st.pe,100);
      if(m==="Croiss.%") return Math.max(st.revGrowth,-20);
      if(m==="Marge%") return st.grossMargin;
      if(m==="Upside%") return Math.round((st.t3-prices[k])/prices[k]*100);
      return st.conviction*20;
    };
    const colorFor=(m,v)=>{
      if(m==="P/E") return v<40?C.green:v<80?C.yellow:C.red;
      if(m==="Croiss.%") return v>30?C.green:v>0?C.yellow:C.red;
      return v>60?C.green:v>30?C.yellow:C.red;
    };
    const displayVal=(k,m)=>{
      const st=BASE[k]; const v=getVal(k,m);
      if(m==="P/E") return st.pe>300?"300+":st.pe;
      if(m==="Conviction") return <Stars n={st.conviction} max={5} size={12}/>;
      if(m==="Upside%") return `+${v}%`;
      if(m==="Croiss.%") return `${v>0?"+":""}${v}%`;
      return `${v}%`;
    };
    return(
      <div style={{display:"grid",gap:16}}>
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase"}}>
              🌡️ Heatmap multi-métriques
            </div>
            <HelpBtn onClick={()=>setGuide(GUIDES.heatmap)}/>
          </div>
          {/* Légende couleurs */}
          <div style={{display:"flex",gap:16,marginBottom:16,flexWrap:"wrap"}}>
            {[[C.green,"Bon / Favorable"],[C.yellow,"Neutre / Attention"],[C.red,"Mauvais / Risqué"]].map(([c,l])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:C.muted}}>
                <div style={{width:10,height:10,borderRadius:2,background:c}}/>
                {l}
              </div>
            ))}
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"separate",borderSpacing:4}}>
              <thead>
                <tr>
                  <th style={{fontSize:10,color:C.muted,textAlign:"left",
                    padding:"0 8px 10px",fontWeight:400}}>Titre</th>
                  {metrics.map(m=>(
                    <th key={m.k} title={m.tip}
                      style={{fontSize:10,color:C.muted,padding:"0 4px 10px",
                        fontWeight:400,textAlign:"center",cursor:"help"}}>
                      {m.k} ℹ️
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(BASE).map(k=>(
                  <tr key={k} onClick={()=>{setActive(k);setView("detail");setTab("chart");}}
                    style={{cursor:"pointer"}}>
                    <td style={{padding:"4px 8px"}}>
                      <div style={{fontWeight:700,fontSize:12,color:BASE[k].color}}>{k}</div>
                      <div style={{fontSize:9,color:C.muted}}>{BASE[k].name}</div>
                    </td>
                    {metrics.map(m=>{
                      const v=getVal(k,m.k);
                      const c=colorFor(m.k,v);
                      return(
                        <td key={m.k} style={{padding:"4px"}}>
                          <div style={{background:`${c}18`,border:`1px solid ${c}44`,
                            borderRadius:6,padding:"10px 6px",textAlign:"center",minWidth:65}}>
                            <div style={{fontSize:12,fontWeight:700,color:c}}>
                              {displayVal(k,m.k)}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{marginTop:12,fontSize:10,color:C.dim,textAlign:"center"}}>
            💡 Clique sur une ligne pour voir le détail du titre — survole les colonnes ℹ️ pour voir leur définition
          </div>
        </div>
      </div>
    );
  };

  // ── COMPARE ─────────────────────────────────────────────────────────────────
  const CompareView=()=>{
    const COLORS=["#76b900","#ed1c24","#f80000","#cc0000"];
    const barData=Object.keys(BASE).map(k=>({
      name:k,
      "Croiss. CA%":BASE[k].revGrowth,
      "Marge%":BASE[k].grossMargin,
      "Upside T3%":Math.round((BASE[k].t3-prices[k])/prices[k]*100),
    }));
    const radarData=[
      {m:"Croissance"},{m:"Marge"},{m:"Valorisation"},{m:"Momentum"},{m:"Conviction"},
    ].map(({m})=>{
      const row={m};
      Object.keys(BASE).forEach(k=>{
        const st=BASE[k];
        row[k]=m==="Croissance"?Math.min(Math.max(st.revGrowth,0),100):
               m==="Marge"?st.grossMargin:
               m==="Valorisation"?Math.max(0,100-Math.min(st.pe,100)):
               m==="Momentum"?Math.round((prices[k]-st.low52)/(st.high52-st.low52)*100):
               st.conviction*20;
      });
      return row;
    });
    const signalScore={ACHETER:3,SURVEILLER:2,ATTENDRE:1};
    return(
      <div style={{display:"grid",gap:16}}>
        {/* Barres */}
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:20}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>
            📊 Croissance / Marge / Upside — Comparaison
          </div>
          <div style={{height:220}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{top:5,right:5,left:-25,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="name" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.muted,fontSize:9}} axisLine={false} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="Croiss. CA%" radius={[3,3,0,0]}>
                  {barData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
                </Bar>
                <Bar dataKey="Marge%" radius={[3,3,0,0]} opacity={0.65}>
                  {barData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
                </Bar>
                <Bar dataKey="Upside T3%" fill={C.yellow} radius={[3,3,0,0]} opacity={0.7}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:8,flexWrap:"wrap"}}>
            {[["Croiss. CA% (couleur pleine)","#8b949e"],["Marge% (couleur pâle)","#8b949e"],["Upside T3% (jaune)","#f5a623"]].map(([l,c])=>(
              <div key={l} style={{fontSize:10,color:c}}>{l}</div>
            ))}
          </div>
        </div>

        {/* Radar */}
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase"}}>
              🕸️ Radar — Profil multi-dimensionnel
            </div>
            <HelpBtn onClick={()=>setGuide(GUIDES.radar)}/>
          </div>
          <div style={{height:280}}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{top:10,right:30,bottom:10,left:30}}>
                <PolarGrid stroke={C.border}/>
                <PolarAngleAxis dataKey="m" tick={{fill:C.muted,fontSize:10}}/>
                {Object.keys(BASE).map((k,i)=>(
                  <Radar key={k} name={k} dataKey={k} stroke={COLORS[i]}
                    fill={COLORS[i]} fillOpacity={0.1} strokeWidth={2}/>
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {/* Légende radar */}
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
            {Object.keys(BASE).map((k,i)=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:5,fontSize:10}}>
                <div style={{width:12,height:3,borderRadius:2,background:COLORS[i]}}/>
                <span style={{color:COLORS[i],fontWeight:700}}>{k}</span>
                <span style={{color:C.muted}}>— {BASE[k].name}</span>
              </div>
            ))}
          </div>
          {/* Guide axes inline */}
          <div style={{background:C.deep,borderRadius:8,padding:12,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
              Guide des 5 axes
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:6}}>
              {GUIDES.radar.items.map(item=>(
                <div key={item.name} style={{display:"flex",gap:6,alignItems:"flex-start"}}>
                  <span style={{fontSize:12,flexShrink:0}}>{item.icon}</span>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:item.color}}>{item.name}</div>
                    <div style={{fontSize:9,color:C.muted,lineHeight:1.5}}>{item.explain.slice(0,80)}…</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tableau complet */}
        <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase"}}>
              📋 Tableau récapitulatif complet
            </div>
            <HelpBtn onClick={()=>setGuide(GUIDES.signal)}/>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.border}`}}>
                  {["Titre","Prix","Chg","Signal","P/E","Rev.%","Marge","Entrée","T1","T2","T3","SL","⭐","Pilier"].map(h=>(
                    <th key={h} style={{padding:"6px 10px",color:C.muted,fontWeight:400,fontSize:9,
                      textAlign:h==="Titre"||h==="Signal"||h==="Pilier"?"left":"right"}}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(BASE).map(k=>{
                  const st=BASE[k]; const lv=prices[k];
                  const cv=+((lv-st.base)/st.base*100).toFixed(2);
                  return(
                    <tr key={k} onClick={()=>{setActive(k);setView("detail");setTab("chart");}}
                      style={{borderBottom:`1px solid ${C.border}`,cursor:"pointer",
                        background:active===k?"#1c2128":"transparent",
                        transition:"background 0.15s"}}>
                      <td style={{padding:"8px 10px"}}>
                        <span style={{fontWeight:700,color:st.color}}>{k}</span>
                      </td>
                      <td style={{padding:"8px 10px",textAlign:"right",fontWeight:700}}>
                        ${lv.toFixed(2)}
                      </td>
                      <td style={{padding:"8px 10px",textAlign:"right",
                        color:cv>=0?C.green:C.red,fontWeight:700}}>
                        {cv>=0?"+":""}{cv}%
                      </td>
                      <td style={{padding:"8px 10px"}}>
                        <Badge signal={st.signal}/>
                      </td>
                      <td style={{padding:"8px 10px",textAlign:"right",
                        color:st.pe>100?C.red:st.pe>50?C.yellow:C.green}}>
                        {st.pe>300?"300+":st.pe}
                      </td>
                      <td style={{padding:"8px 10px",textAlign:"right",
                        color:st.revGrowth>0?C.green:C.red}}>
                        {st.revGrowth>0?"+":""}{st.revGrowth}%
                      </td>
                      <td style={{padding:"8px 10px",textAlign:"right"}}>{st.grossMargin}%</td>
                      <td style={{padding:"8px 10px",textAlign:"right",color:C.green}}>
                        ${st.entryLow}
                      </td>
                      <td style={{padding:"8px 10px",textAlign:"right",color:C.yellow}}>${st.t1}</td>
                      <td style={{padding:"8px 10px",textAlign:"right",color:C.blue}}>${st.t2}</td>
                      <td style={{padding:"8px 10px",textAlign:"right",color:C.blue,fontWeight:700}}>
                        ${st.t3}
                      </td>
                      <td style={{padding:"8px 10px",textAlign:"right",color:C.red}}>${st.stop}</td>
                      <td style={{padding:"8px 10px",textAlign:"center"}}>
                        <Stars n={st.conviction} size={11}/>
                      </td>
                      <td style={{padding:"8px 10px",color:C.muted,fontSize:9}}>{st.pilier}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,
      fontFamily:"'IBM Plex Mono','Courier New',monospace",
      padding:"16px",boxSizing:"border-box"}}>

      {guide && <GuidePanel guide={guide} onClose={()=>setGuide(null)}/>}

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
        marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:8,color:C.muted,letterSpacing:4,marginBottom:2}}>EMPIRE CAPITAL</div>
          <div style={{fontSize:18,fontWeight:700,color:C.blue,letterSpacing:1}}>⚡ NEXUS TERMINAL v4</div>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={()=>setGuide(GUIDES.signal)}
            style={{background:"transparent",border:`1px solid ${C.yellow}`,
              borderRadius:6,padding:"4px 12px",cursor:"pointer",
              color:C.yellow,fontSize:9,fontWeight:700}}>
            ❓ Guide Signal Convergent
          </button>
          <div style={{fontSize:9,color:C.green}}>🟢 LIVE · Prix simulés toutes 3s</div>
          <div style={{fontSize:9,color:C.muted}}>Phase 1 · 15 000$ CAD</div>
        </div>
      </div>

      {/* Market bar */}
      <div style={{background:C.card,borderRadius:8,padding:"10px 14px",
        display:"flex",gap:18,overflowX:"auto",marginBottom:14,
        border:`1px solid ${C.border}`,flexWrap:"nowrap"}}>
        {MARKET.map(m=>(
          <div key={m.l} style={{whiteSpace:"nowrap"}}>
            <div style={{fontSize:8,color:C.muted,marginBottom:1}}>{m.l}</div>
            <div style={{fontSize:11,fontWeight:700}}>{m.v}</div>
            <div style={{fontSize:9,color:m.up?C.green:C.red}}>{m.chg}</div>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {[
          {k:"overview",l:"🏠 Vue globale"},
          {k:"detail",l:`📊 ${active} — Détail`},
          {k:"heatmap",l:"🌡️ Heatmap"},
          {k:"compare",l:"⚖️ Comparatif + Radar"},
        ].map(n=>(
          <button key={n.k} onClick={()=>setView(n.k)} style={{
            background:view===n.k?"#21262d":"transparent",
            border:view===n.k?`1px solid ${C.blue}`:`1px solid ${C.border}`,
            borderRadius:6,padding:"6px 14px",cursor:"pointer",
            color:view===n.k?C.blue:C.muted,fontSize:10,fontWeight:700,
          }}>{n.l}</button>
        ))}
      </div>

      {/* Views */}
      {view==="overview" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",
            gap:12,marginBottom:14}}>
            {Object.keys(BASE).map(k=><OverviewCard key={k} ticker={k}/>)}
          </div>
          <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:16}}>
            <div style={{fontSize:9,color:C.muted,letterSpacing:2,marginBottom:12,textTransform:"uppercase"}}>
              📅 Agenda — Événements critiques
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:8}}>
              {[
                {d:"Auj.",e:"CPI Mars US",imp:"🔴",n:"3.3% attendu"},
                {d:"22 avr.",e:"Résultats TSLA Q1",imp:"🟡",n:"BPA $0.39 estimé"},
                {d:"Vendr.",e:"Pourparlers Islamabad",imp:"🔴",n:"USA–Iran"},
                {d:"5 mai",e:"Résultats AMD Q1",imp:"🟡",n:"BPA $1.27 estimé"},
                {d:"20 mai",e:"Résultats NVDA Q1",imp:"🔴",n:"BPA $1.76 estimé"},
              ].map(ev=>(
                <div key={ev.e} style={{background:C.deep,borderRadius:8,
                  padding:"10px 12px",border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:9,color:C.muted,marginBottom:4}}>{ev.imp} {ev.d}</div>
                  <div style={{fontSize:11,fontWeight:700,marginBottom:2}}>{ev.e}</div>
                  <div style={{fontSize:10,color:C.muted}}>{ev.n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {view==="detail" && <DetailView/>}
      {view==="heatmap" && <HeatmapView/>}
      {view==="compare" && <CompareView/>}

      <div style={{textAlign:"center",marginTop:20,fontSize:8,color:C.dim,letterSpacing:2}}>
        EMPIRE CAPITAL · NEXUS TERMINAL v4 · 10 AVRIL 2026 · PHASE 1 — FONDATION
        · Données simulées — éducatif uniquement · Clique ❓ pour les guides
      </div>
    </div>
  );
}
