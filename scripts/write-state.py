#!/usr/bin/env python3
"""Write 40-agent swarm state to fonger-ai static files."""
import json, os

BASE = os.path.expanduser("~/hermes-desktop/fonger-ai")

ROSTER = [
    ("Director","orchestrator","director","pro"),("Dashboard","state server","director","pro"),("Gateway","Discord bridge","director","pro"),
    ("Scout","niche discovery","research","flash"),("Trend","trend research","research","flash"),("Intel","SERP & competition","research","flash"),("Ledger","market sizing","research","flash"),("Circuit","AI research","research","flash"),
    ("Pixel","vector art","design","flash"),("Mockup","product visualization","design","flash"),("Pattern","print-ready patterns","design","flash"),("Type","typography","design","flash"),("Brand","brand identity","design","flash"),
    ("Claude","Claude Code CLI","production","pro"),("Printify","Printify uploads","production","flash"),("OpenCode","provider-agnostic coding","production","flash"),("Renderer","Playwright renders","production","flash"),("Canvas","order processing","production","flash"),
    ("Scribe","long-form content","marketing","flash"),("Signal","social media","marketing","flash"),("Reel","video content","marketing","flash"),("Inbox","email campaigns","marketing","flash"),("Magnet","lead magnets","marketing","flash"),
    ("Cron","scheduler","operations","flash"),("Monitor","order monitoring","operations","flash"),("Refresh","asset sync","operations","flash"),("Pricer","price auditing","operations","flash"),("DescBot","descriptions","operations","flash"),("Cleanup","stale product purge","operations","flash"),
    ("QA-Design","design review","quality","flash"),("QA-Price","pricing verify","quality","flash"),("QA-Desc","listing audit","quality","flash"),
    ("Analyst-Sales","sales analytics","analytics","flash"),("Analyst-Traffic","traffic reports","analytics","flash"),("Analyst-Margin","margin calc","analytics","flash"),("Report","daily summaries","analytics","flash"),
    ("Strategist","niche selection","strategy","flash"),("Collector","competitive intel","strategy","flash"),("Planner","product roadmap","strategy","flash"),("Scope","opportunity scoring","strategy","flash"),
]

agents = [{"name":n,"role":r,"dept":d,"status":"idle","last":"—","tokens":0,"task":"","model":m} for n,r,d,m in ROSTER]
state = {"agents":agents,"active_agents":0,"total_tokens":0,"events":[],"updated":""}

for subdir in ["public/api","docs/api"]:
    d = os.path.join(BASE, subdir)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d,"state.json"),"w") as f:
        json.dump(state, f)

print(f"Wrote {len(agents)} agents to state.json")
