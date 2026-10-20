/**
 * Case study 04: TTD Helpdesk, Nandakam App page component.
 *
 * Supplies state and template bindings for case04-ttd-helpdesk.html: theme toggle,
 * reading progress, sticky contents and the page's interactive demos.
 *
 * Depends on js/runtime.js (DCLogic, mountDC).
 */
(function () {
  class CaseStudy04 extends DCLogic {
    constructor(props) { super(props); this.state = { launch: true, light: true, cur: 0, pct: 0, role: 0 }; }
    componentDidMount() {
      this.launchT = setTimeout(() => this.endLaunch(), 4500);
      this.launchKey = (e) => { if (e.key === 'Escape') this.endLaunch(); };
      window.addEventListener('keydown', this.launchKey);
    }
    componentWillUnmount() { clearTimeout(this.launchT); if (this.launchKey) window.removeEventListener('keydown', this.launchKey); }
    endLaunch() {
      clearTimeout(this.launchT);
      if (this.launchKey) { window.removeEventListener('keydown', this.launchKey); this.launchKey = null; }
      if (this.state.launch) this.setState({ launch: false });
    }
    renderVals() {
      const s = this.state; const IDS = ["overview", "problem", "pains", "goals", "stories", "users", "research", "context", "challenges", "process", "solution", "edges", "impact"]; const NAMES = ["Overview", "Problem", "Pain points", "Goals", "User stories", "Users & roles", "Research", "Context", "Challenges", "Process", "Solution", "Edge cases", "Impact"]; const ROLES = [{"name": "Technician", "ini": "RK", "q": "What’s mine to fix?", "esc": "escalated requests assigned to me", "tap": "My Open Requests (or Escalated), pre-filtered", "n": 4, "e": 1, "p": 3}, {"name": "Supervisor", "ini": "AR", "q": "What’s escalated to my level?", "esc": "requests whose escalation level matches mine", "tap": "My Open Requests (or Escalated), pre-filtered", "n": 18, "e": 5, "p": 12}, {"name": "TTD Official", "ini": "PV", "q": "Where is it worst?", "esc": "any open request at level L2 or above", "tap": "All Open Requests (or Escalated), pre-filtered", "n": 125, "e": 42, "p": 96}];
      return { launchOpen: !!s.launch, skipLaunch: () => this.endLaunch(), themeClass: this.state.light ? 'theme-light' : 'theme-dark', toggleTheme: () => this.setState({ light: !this.state.light }), themeText: this.state.light ? '◐ Dark' : '◑ Light', themeLabel: this.state.light ? 'Switch to dark theme' : 'Switch to light theme',
  onScroll: (e) => { const el = e.currentTarget; this.el = el; const y = el.scrollTop + 160; let cur = 0; IDS.forEach((id, k) => { const n = document.getElementById(id); if (n && n.offsetTop <= y) cur = k; }); const pct = Math.round(el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight) * 100); if (cur !== s.cur || pct !== s.pct) this.setState({ cur: cur, pct: pct }); },
  toTop: () => { if (this.el) this.el.scrollTo({ top: 0, behavior: 'smooth' }); },
  pct: s.pct, showTop: s.pct > 8, minsLeft: Math.max(1, Math.round(8 * (1 - s.pct / 100))),
  toc: IDS.map((id, k) => ({ id: id, label: NAMES[k], on: k === s.cur, color: k === s.cur ? 'var(--ink)' : (k < s.cur ? 'var(--muted)' : 'var(--ink-2)'), weight: k === s.cur ? '700' : '400', bar: k === s.cur ? 'var(--accent)' : 'transparent', mark: k < s.cur ? '✓' : ('0' + (k + 1)).slice(-2), go: () => { const n = document.getElementById(id); if (n && this.el) this.el.scrollTo({ top: n.offsetTop - 24, behavior: 'smooth' }); } })),
  roles: ROLES.map((r, k) => ({ label: r.name, on: s.role === k ? 'true' : 'false', bg: s.role === k ? 'var(--ink)' : 'var(--surface)', fg: s.role === k ? 'var(--bg)' : 'var(--ink)', pick: () => this.setState({ role: k }) })),
  role: ROLES[s.role], roleKey: 'r' + s.role,
      };
    }
  }

  mountDC(
    document.getElementById('dc-template'),
    CaseStudy04,
    {},
    document.getElementById('app')
  );
})();
