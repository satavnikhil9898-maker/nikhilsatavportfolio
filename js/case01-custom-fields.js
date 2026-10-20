/**
 * Case study 01: Custom Fields for Units & Users page component.
 *
 * Supplies state and template bindings for case01-custom-fields.html: theme toggle,
 * reading progress, sticky contents and the page's interactive demos.
 *
 * Depends on js/runtime.js (DCLogic, mountDC).
 */
(function () {
  class CaseStudy01 extends DCLogic {
    constructor(props) { super(props); this.state = { light: true, cur: 0, pct: 0 }; }
    renderVals() {
      const s = this.state; const IDS = ["overview", "problem", "pains", "goals", "stories", "research", "users", "context", "challenges", "process", "solution", "edges", "impact"]; const NAMES = ["Overview", "Problem", "Pain points", "Goals", "User stories", "Research", "Users", "Context", "Challenges", "Process", "Solution", "Edge cases", "Impact"];
      return { themeClass: this.state.light ? 'theme-light' : 'theme-dark', toggleTheme: () => this.setState({ light: !this.state.light }), themeText: this.state.light ? '◐ Dark' : '◑ Light', themeLabel: this.state.light ? 'Switch to dark theme' : 'Switch to light theme',
  onScroll: (e) => { const el = e.currentTarget; this.el = el; const y = el.scrollTop + 160; let cur = 0; IDS.forEach((id, k) => { const n = document.getElementById(id); if (n && n.offsetTop <= y) cur = k; }); const pct = Math.round(el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight) * 100); if (cur !== s.cur || pct !== s.pct) this.setState({ cur: cur, pct: pct }); },
  toTop: () => { if (this.el) this.el.scrollTo({ top: 0, behavior: 'smooth' }); },
  pct: s.pct, showTop: s.pct > 8, curName: NAMES[s.cur], curNum: ('0' + (s.cur + 1)).slice(-2), minsLeft: Math.max(1, Math.round(8 * (1 - s.pct / 100))),
  toc: IDS.map((id, k) => ({ id: id, n: ('0' + (k + 1)).slice(-2), label: NAMES[k], on: k === s.cur, done: k < s.cur, color: k === s.cur ? 'var(--ink)' : (k < s.cur ? 'var(--muted)' : 'var(--ink-2)'), weight: k === s.cur ? '700' : '400', bar: k === s.cur ? 'var(--accent)' : 'transparent', mark: k < s.cur ? '✓' : ('0' + (k + 1)).slice(-2), go: () => { const n = document.getElementById(id); if (n && this.el) this.el.scrollTo({ top: n.offsetTop - 24, behavior: 'smooth' }); } })),
      };
    }
  }

  mountDC(
    document.getElementById('dc-template'),
    CaseStudy01,
    {},
    document.getElementById('app')
  );
})();
