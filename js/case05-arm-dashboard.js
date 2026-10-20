/**
 * Case study 05: ARM Dashboard Revamp page component.
 *
 * Supplies state and template bindings for case05-arm-dashboard.html: theme toggle,
 * reading progress, sticky contents and the page's interactive demos.
 *
 * Depends on js/runtime.js (DCLogic, mountDC).
 */
(function () {
  class CaseStudy05 extends DCLogic {
    constructor(props) { super(props); this.state = { light: true, cur: 0, pct: 0, sel: 2 }; }
    renderVals() {
      const s = this.state; const IDS = ["overview", "problem", "pains", "goals", "stories", "users", "research", "context", "challenges", "process", "solution", "edges", "impact"]; const NAMES = ["Overview", "Problem", "Pain points", "Goals", "User stories", "Users", "Research", "Context", "Challenges", "Process", "Solution", "Edge cases", "Impact"]; const HOT = [{"t": "Buildings · Tenants · Contracts", "q": "How big is what I manage?", "d": "Total buildings, active tenants, and active plus future contracts.", "p": "Setup › Building · Approved users · Contracts master data"}, {"t": "Quick Actions", "q": "What do I do most often?", "d": "Post announcement, create helpdesk request, reserve amenity.", "p": "Announcement Mgr · Helpdesk Tracker · Amenity & Event"}, {"t": "Units", "q": "How many units are vacant right now?", "d": "Occupied = units with tenants; vacant = without; vacant with contracts = future contracts.", "p": "Unit’s Master Report (moderators) or the first unit"}, {"t": "Occupancy Rate", "q": "Is occupancy improving?", "d": "Units with tenants ÷ total units × 100, with a year-on-year trend pill.", "p": "Contracts › Reports › Unit occupancy report"}, {"t": "Overdue & Expiring", "q": "Which contracts need renewing?", "d": "Expired contracts, plus those expiring in 30, 60 and 90 days (today included).", "p": "Expired contracts · Contracts master data"}, {"t": "Avg. Unit Profitability", "q": "Are my units making money?", "d": "Average of (income − expense) ÷ income across units.", "p": "Expense Tracker › Unit-wise Profit & Loss Summary"}, {"t": "Collections", "q": "How much rent is still pending?", "d": "Collected vs balance for this month and the two before.", "p": "Income Tracker › Member Income · Invoices & Payment Summary"}, {"t": "Cheques", "q": "Which cheques need action?", "d": "In hand, due for deposit and bounced, with amounts.", "p": "Income Tracker › Member Income › Cheque Management"}, {"t": "My Tasks", "q": "What needs my approval today?", "d": "Helpdesk, community forms, POs, PRs and move-ins awaiting me.", "p": "Each module’s approval queue"}, {"t": "Move In Tracker", "q": "Who is moving in this week?", "d": "Expected move-ins this week, next week and today.", "p": "Move In / Move out tracker › Approved Move Ins"}, {"t": "Happiness Meter", "q": "Are residents satisfied?", "d": "Average helpdesk rating and total ratings.", "p": "Helpdesk Tracker › Happiness Meter Report (phase 2)"}, {"t": "App Usage", "q": "How many residents use the app?", "d": "Users logged in ÷ unique users × 100, coloured by band.", "p": "Send Invite works like Bulk Invite on ACM"}, {"t": "Helpdesk", "q": "What are residents complaining about?", "d": "Total open requests and the top five categories with escalations.", "p": "Helpdesk Tracker › Open requests, filtered by category"}, {"t": "Visitors", "q": "Is visitor activity normal?", "d": "Daily visitors this week vs last week.", "p": "ADDA Gatekeeper › Incident Investigator"}];
      return { themeClass: this.state.light ? 'theme-light' : 'theme-dark', toggleTheme: () => this.setState({ light: !this.state.light }), themeText: this.state.light ? '◐ Dark' : '◑ Light', themeLabel: this.state.light ? 'Switch to dark theme' : 'Switch to light theme',
  onScroll: (e) => { const el = e.currentTarget; this.el = el; const y = el.scrollTop + 160; let cur = 0; IDS.forEach((id, k) => { const n = document.getElementById(id); if (n && n.offsetTop <= y) cur = k; }); const pct = Math.round(el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight) * 100); if (cur !== s.cur || pct !== s.pct) this.setState({ cur: cur, pct: pct }); },
  toTop: () => { if (this.el) this.el.scrollTo({ top: 0, behavior: 'smooth' }); },
  pct: s.pct, showTop: s.pct > 8, minsLeft: Math.max(1, Math.round(8 * (1 - s.pct / 100))),
  toc: IDS.map((id, k) => ({ id: id, label: NAMES[k], on: k === s.cur, color: k === s.cur ? 'var(--ink)' : (k < s.cur ? 'var(--muted)' : 'var(--ink-2)'), weight: k === s.cur ? '700' : '400', bar: k === s.cur ? 'var(--accent)' : 'transparent', mark: k < s.cur ? '✓' : ('0' + (k + 1)).slice(-2), go: () => { const n = document.getElementById(id); if (n && this.el) this.el.scrollTo({ top: n.offsetTop - 24, behavior: 'smooth' }); } })),
  cur: HOT[s.sel], sel: s.sel, selNum: s.sel + 1, nextHot: () => this.setState({ sel: (s.sel + 1) % HOT.length }),
  ...Object.fromEntries(HOT.map((h, k) => ['h' + k, { on: s.sel === k ? 'true' : 'false', bg: s.sel === k ? 'rgba(43,60,255,0.14)' : 'rgba(43,60,255,0.0)', bd: s.sel === k ? '#2B3CFF' : 'rgba(43,60,255,0.35)', pick: () => this.setState({ sel: k }) }])),
      };
    }
  }

  mountDC(
    document.getElementById('dc-template'),
    CaseStudy05,
    {},
    document.getElementById('app')
  );
})();
