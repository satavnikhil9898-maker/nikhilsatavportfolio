/**
 * Case study 03: TTD CCC Inspection Management page component.
 *
 * Supplies state and template bindings for case03-ttd-ccc.html: theme toggle,
 * reading progress, sticky contents and the page's interactive demos.
 *
 * Depends on js/runtime.js (DCLogic, mountDC).
 */
(function () {
  class CaseStudy03 extends DCLogic {
    constructor(props) { super(props); this.state = { launch: true, light: true, cur: 0, pct: 0, drill: 0 }; }
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
      const s = this.state; const IDS = ["overview", "problem", "pains", "goals", "stories", "users", "research", "context", "challenges", "process", "solution", "edges", "impact"]; const NAMES = ["Overview", "Problem", "Pain points", "Goals", "User stories", "Users", "Research", "Context", "Challenges", "Process", "Solution", "Edge cases", "Impact"]; const STEPL = ["1 \u00b7 Summary", "2 \u00b7 Ranked report", "3 \u00b7 Person", "4 \u00b7 Inspection"];
      return { launchOpen: !!s.launch, skipLaunch: () => this.endLaunch(), themeClass: this.state.light ? 'theme-light' : 'theme-dark', toggleTheme: () => this.setState({ light: !this.state.light }), themeText: this.state.light ? '◐ Dark' : '◑ Light', themeLabel: this.state.light ? 'Switch to dark theme' : 'Switch to light theme',
  onScroll: (e) => { const el = e.currentTarget; this.el = el; const y = el.scrollTop + 160; let cur = 0; IDS.forEach((id, k) => { const n = document.getElementById(id); if (n && n.offsetTop <= y) cur = k; }); const pct = Math.round(el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight) * 100); if (cur !== s.cur || pct !== s.pct) this.setState({ cur: cur, pct: pct }); },
  toTop: () => { if (this.el) this.el.scrollTo({ top: 0, behavior: 'smooth' }); },
  pct: s.pct, showTop: s.pct > 8, minsLeft: Math.max(1, Math.round(8 * (1 - s.pct / 100))),
  toc: IDS.map((id, k) => ({ id: id, label: NAMES[k], on: k === s.cur, color: k === s.cur ? 'var(--ink)' : (k < s.cur ? 'var(--muted)' : 'var(--ink-2)'), weight: k === s.cur ? '700' : '400', bar: k === s.cur ? 'var(--accent)' : 'transparent', mark: k < s.cur ? '✓' : ('0' + (k + 1)).slice(-2), go: () => { const n = document.getElementById(id); if (n && this.el) this.el.scrollTo({ top: n.offsetTop - 24, behavior: 'smooth' }); } })),
  steps: STEPL.map((l, k) => ({ label: l, on: s.drill === k ? 'true' : 'false', bg: s.drill === k ? 'var(--ink)' : 'var(--surface)', fg: s.drill === k ? 'var(--bg)' : 'var(--ink)', pick: () => this.setState({ drill: k }) })),
  d0: s.drill === 0, d1: s.drill === 1, d2: s.drill === 2, d3: s.drill === 3,
  nextStep: () => this.setState({ drill: (s.drill + 1) % 4 }), nextLabel: s.drill === 3 ? '↺ Back to summary' : 'Drill down →',
      };
    }
  }

  mountDC(
    document.getElementById('dc-template'),
    CaseStudy03,
    {},
    document.getElementById('app')
  );
})();
