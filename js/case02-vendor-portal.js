/**
 * Case study 02: ADDA Vendor Portal page component.
 *
 * Supplies state and template bindings for case02-vendor-portal.html: theme toggle,
 * reading progress, sticky contents and the page's interactive demos.
 *
 * Depends on js/runtime.js (DCLogic, mountDC).
 */
(function () {
  class CaseStudy02 extends DCLogic {
    constructor(props) { super(props); this.state = { light: true, cur: 0, pct: 0, q: [4, 6], done: false }; }
    renderVals() {
      const s = this.state; const IDS = ["overview", "problem", "pains", "goals", "stories", "users", "research", "context", "challenges", "process", "solution", "edges", "impact"]; const NAMES = ["Overview", "Problem", "Pain points", "Goals", "User stories", "Users", "Research", "Context", "Challenges", "Process", "Solution", "Edge cases", "Impact"]; const LINES = [{ name: "Floor cleaner 5L", cost: 250, avail: 4 }, { name: "Mop heads (pack of 10)", cost: 95, avail: 10 }]; const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); const grand = LINES.reduce((t, L, k) => t + s.q[k] * L.cost * 1.05, 0); const anyErr = LINES.some((L, k) => s.q[k] > L.avail); const blocked = anyErr || grand > 2000 || grand === 0 || s.done;
      return { themeClass: this.state.light ? 'theme-light' : 'theme-dark', toggleTheme: () => this.setState({ light: !this.state.light }), themeText: this.state.light ? '◐ Dark' : '◑ Light', themeLabel: this.state.light ? 'Switch to dark theme' : 'Switch to light theme',
  onScroll: (e) => { const el = e.currentTarget; this.el = el; const y = el.scrollTop + 160; let cur = 0; IDS.forEach((id, k) => { const n = document.getElementById(id); if (n && n.offsetTop <= y) cur = k; }); const pct = Math.round(el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight) * 100); if (cur !== s.cur || pct !== s.pct) this.setState({ cur: cur, pct: pct }); },
  toTop: () => { if (this.el) this.el.scrollTo({ top: 0, behavior: 'smooth' }); },
  pct: s.pct, showTop: s.pct > 8, minsLeft: Math.max(1, Math.round(8 * (1 - s.pct / 100))),
  toc: IDS.map((id, k) => ({ id: id, label: NAMES[k], on: k === s.cur, color: k === s.cur ? 'var(--ink)' : (k < s.cur ? 'var(--muted)' : 'var(--ink-2)'), weight: k === s.cur ? '700' : '400', bar: k === s.cur ? 'var(--accent)' : 'transparent', mark: k < s.cur ? '✓' : ('0' + (k + 1)).slice(-2), go: () => { const n = document.getElementById(id); if (n && this.el) this.el.scrollTo({ top: n.offsetTop - 24, behavior: 'smooth' }); } })),
  lines: LINES.map((L, k) => { const q = s.q[k]; const err = q > L.avail; return { name: L.name, cost: L.cost.toFixed(2), avail: L.avail, q: q, err: err, border: err ? '#D93A3A' : '#E6E8EC', total: fmt(q * L.cost * 1.05), inc: () => { const a = s.q.slice(); a[k] = Math.min(L.avail + 2, a[k] + 1); this.setState({ q: a, done: false }); }, dec: () => { const a = s.q.slice(); a[k] = Math.max(0, a[k] - 1); this.setState({ q: a, done: false }); } }; }),
  grand: fmt(grand), overBal: grand > 2000, done: s.done, blocked: blocked ? 'true' : 'false', subBg: blocked ? '#9DB5A8' : '#106848', subLabel: s.done ? 'Submitted ✓' : 'Create GR/SR',
  submit: () => { if (!blocked) this.setState({ done: true }); },
      };
    }
  }

  mountDC(
    document.getElementById('dc-template'),
    CaseStudy02,
    {},
    document.getElementById('app')
  );
})();
