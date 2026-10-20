/**
 * Portfolio page component.
 *
 * Supplies state and template bindings for index.html:
 *   - heroVals()     Hero "chaos → clarity" spotlight
 *   - videoVals()    Design-process video player
 *   - contactVals()  Interactive enquiry booth
 *   - renderVals()   Theme toggle, hero identity variant, copy-email
 *
 * Depends on js/runtime.js (DCLogic, mountDC).
 */
(function () {
  class Portfolio extends DCLogic {
    constructor(props) {
      super(props);
      this.state = {
        // Theme + hero spotlight
        light: true, mx: 360, my: 260, moved: false, all: false,
        // Process video
        t: 0, playing: false, started: false, speed: 1, hintOff: false,
        // Contact booth
        f: { name: '', company: '', email: '', message: '' },
        type: 'role', typing: false, phase: 'idle', tried: false,
        flights: [], inbox: {}, flown: {}, step: 0, stepTried: false
      };
      this.timers = [];
      this.n = 0;
    }
    heroVals() {
      const words = [
        { bad: '14-step checkout', good: '3-step checkout', x: '5%', y: '16%', r: -4, s: 18 },
        { bad: 'where is the save button?', good: 'Autosave', x: '62%', y: '12%', r: 3, s: 16 },
        { bad: 'dashboard with 60+ charts', good: 'One metric that matters', x: '70%', y: '30%', r: -2, s: 17 },
        { bad: 'users drop at step 3', good: 'Guided onboarding', x: '4%', y: '40%', r: 2, s: 19 },
        { bad: '27 button styles', good: 'One design system', x: '7%', y: '66%', r: -3, s: 18 },
        { bad: 'support ticket backlog', good: 'Self-serve help', x: '72%', y: '58%', r: 4, s: 16 },
        { bad: 'jargon everywhere', good: 'Plain language', x: '24%', y: '86%', r: -2, s: 17 },
        { bad: 'nobody reads the spec', good: 'Living prototypes', x: '60%', y: '84%', r: 2, s: 18 },
        { bad: 'dark patterns', good: 'Earned trust', x: '38%', y: '8%', r: 1, s: 15 },
        { bad: 'fails on mobile', good: 'Mobile-first', x: '82%', y: '44%', r: -5, s: 15 },
        { bad: 'low contrast text', good: 'WCAG AA', x: '14%', y: '28%', r: 5, s: 14 },
        { bad: 'opinions in meetings', good: 'Decisions from research', x: '40%', y: '76%', r: -1, s: 15 }
      ].map((w) => Object.assign({}, w, { s2: w.s + 4 }));
      const s = this.state;
      const mask = s.all
        ? 'linear-gradient(#000, #000)'
        : 'radial-gradient(circle 160px at ' + s.mx + 'px ' + s.my + 'px, #000 55%, transparent 100%)';
      return {
        words: words,
        mask: mask,
        mx: s.mx, my: s.my,
        ringDisplay: s.moved && !s.all ? 'block' : 'none',
        allLabel: s.all ? 'Back to spotlight' : 'Reveal everything',
        allPressed: s.all ? 'true' : 'false',
        allBg: s.all ? 'rgba(143,155,255,0.18)' : 'transparent',
        toggleAll: () => this.setState({ all: !s.all }),
        onMove: (e) => {
          const el = e.currentTarget;
          const r = el.getBoundingClientRect();
          const k = r.width ? el.offsetWidth / r.width : 1;
          this.setState({ mx: Math.round((e.clientX - r.left) * k), my: Math.round((e.clientY - r.top) * k), moved: true });
        }
      };
    }
    chapters() {
      return [
        { title: 'Understand the problem', tools: 'User research', say: 'First, I talk to users and the business. Here, finance teams told me they can’t see which invoices are overdue.' },
        { title: 'Feed the context to Claude', tools: 'Claude · Connectors · MCP servers', say: 'Then I give Claude the PRD, scope doc and requirements through connectors and MCP servers. It pulls out pain points, requirements and edge cases.' },
        { title: 'Apply the design system', tools: 'Figma MCP · Design system', say: 'Next, our design system. If it’s already in Claude, I use it. If not, I connect it with Figma MCP, so we work with real components.' },
        { title: 'Ideate & prototype in Claude', tools: 'Claude · Skills', say: 'I prototype in Claude: several variations on our system, with my Skills applying my UX checklist.' },
        { title: 'Validate & refine', tools: 'Claude · Skills', say: 'I compare them, catch usability issues and edge cases, and refine until one direction clearly solves the pain.' },
        { title: 'Move to Figma', tools: 'Figma Connector', say: 'Once it’s final, the Figma Connector brings it into Figma as real, layered UI built from our components.' },
        { title: 'Final tweaks & handoff', tools: 'Figma · Dev handoff', say: 'Finally, I polish, fix inconsistencies and hand off to development. AI sped it up. Every decision was mine.' }
      ];
    }
    componentDidMount() {
      this.timer = setInterval(() => {
        if (!this.state.playing) return;
        const total = this.chapters().length * 15;
        const nt = Math.round((this.state.t + 0.1 * this.state.speed) * 100) / 100;
        if (nt >= total) this.setState({ t: total, playing: false });
        else this.setState({ t: nt });
      }, 100);
    }
    componentWillUnmount() { clearInterval(this.timer); this.timers.forEach(clearTimeout); clearTimeout(this.tt); }
    videoVals() {
      const C = this.chapters();
      const LEN = 15;
      const total = C.length * LEN;
      const t = this.state.t;
      const i = Math.min(C.length - 1, Math.floor(t / LEN));
      const local = t - i * LEN;
      const fmt = (s) => { const m = Math.floor(s / 60); const r = Math.floor(s % 60); return m + ':' + (r < 10 ? '0' : '') + r; };
      const say = C[i].say;
      const typing = local > 3.3 && local < 6.5;
      const s = this.state;
      const ended = t >= total;
      const playing = this.state.playing && !ended;
      const go = (s) => this.setState(this.state.started ? { t: s } : { t: s, started: true, playing: true });
      const flags = {};
      for (let k = 0; k < 7; k++) flags['v' + (k + 1)] = k === i;
      return Object.assign(flags, {
        t: t, total: total,
        pct: (t / total) * 100,
        now: fmt(t), dur: fmt(total),
        chapter: C[i], num: '0' + (i + 1), key: 'c' + i,
        say: say,
        ctrlOpacity: 1, ctrlPE: 'auto',
        started: s.started, notStarted: !s.started,
        runKey: s.started ? 'r' : 'p',
        start: () => this.setState({ started: true, playing: true, t: 0 }),
        showVis: local >= 7.0, reading: local < 7.0,
        readPct: Math.max(0, Math.min(100, ((local - 3.0) / 4.0) * 100)),
        speedLabel: s.speed === 1 ? '1×' : '1.5×',
        speedPressed: s.speed === 1 ? 'false' : 'true',
        speedBg: s.speed === 1 ? 'transparent' : '#F2C14E',
        speedFg: s.speed === 1 ? '#F2F1EC' : '#0B0B0C',
        speedRing: s.speed === 1 && s.started && !s.hintOff && t < 30 ? '0 0 0 4px rgba(242,193,78,0.45)' : 'none',
        toggleSpeed: () => this.setState({ speed: s.speed === 1 ? 1.5 : 1, hintOff: true }),
        goFast: () => this.setState({ speed: 1.5, hintOff: true }),
        dismissHint: () => this.setState({ hintOff: true }),
        showHint: s.started && s.speed === 1 && !s.hintOff && t >= 3.5 && t < 30,
        showCaret: !ended,
        mA: typing && playing ? 'talk-a' : 'idle-a',
        mB: typing && playing ? 'talk-b' : 'idle-b',
        playing: playing, paused: !playing && !ended, ended: ended,
        playLabel: playing ? 'Pause' : (ended ? 'Replay' : 'Play'),
        toggle: () => {
          if (!this.state.started) {
            this.setState({ started: true, playing: true, t: 0 });
            return;
          }
          if (ended) this.setState({ t: 0, playing: true });
          else this.setState({ playing: !this.state.playing });
        },
        prev: () => go(Math.max(0, (local < 1.5 ? i - 1 : i)) * LEN),
        next: () => go(Math.min(C.length - 1, i + 1) * LEN),
        seek: (e) => { const v = Number(e.target.value); this.setState(this.state.started ? { t: v } : { t: v, started: true, playing: true }); },
        marks: C.map((c, k) => ({ n: k + 1, title: c.title, time: fmt(k * LEN), left: (k * LEN / total) * 100, c: k <= i ? '#F2F1EC' : '#8A8983', go: () => go(k * LEN) }))
      });
    }
    ctLater(fn, ms) { this.timers.push(setTimeout(fn, ms)); }
    ctSet(k, v) {
      this.setState({ f: Object.assign({}, this.state.f, { [k]: v }), typing: true });
      clearTimeout(this.tt);
      this.tt = setTimeout(() => this.setState({ typing: false }), 900);
    }
    ctLabels() { return { name: 'NAME', company: 'COMPANY', email: 'EMAIL', type: 'ENQUIRY', message: 'MESSAGE' }; }
    ctTypeLabel(id) { return { role: 'Full-time role', contract: 'Contract', freelance: 'Freelance project', hi: 'Just saying hi' }[id]; }
    ctLaunch(k, forced) {
      const s = this.state;
      const text = k === 'type' ? this.ctTypeLabel(forced || s.type) : (s.f[k] || '').trim();
      if (!text || s.flown[k] === text || s.phase !== 'idle') return;
      const id = 'fl' + (++this.n);
      const fl = { id: id, label: this.ctLabels()[k], text: text, pad: '8px 12px', bg: '#1C1D24', fg: '#F2F1EC' };
      this.setState({ flights: s.flights.concat([fl]), flown: Object.assign({}, s.flown, { [k]: text }) });
      this.ctLater(() => {
        const ib = Object.assign({}, this.state.inbox, { [k]: { key: k + id, label: this.ctLabels()[k], text: text } });
        this.setState({ flights: this.state.flights.filter((x) => x.id !== id), inbox: ib });
      }, 1500);
    }
    ctSubmit() {
      clearTimeout(this.tt);
      const id = 'card' + (++this.n);
      const fl = { id: id, label: 'ENQUIRY', text: (this.state.f.name || '') + ' · ' + this.ctTypeLabel(this.state.type), pad: '14px 18px', bg: '#F2F1EC', fg: '#0B0B0C' };
      this.setState({ phase: 'sending', typing: false, tried: false, flights: this.state.flights.concat([fl]) });
      this.ctLater(() => this.setState({ phase: 'received', flights: this.state.flights.filter((x) => x.id !== id) }), 1500);
    }

    contactVals() {
      const s = this.state;
      const f = s.f;
      const T = [{ id: 'role', label: 'Full-time role' }, { id: 'contract', label: 'Contract' }, { id: 'freelance', label: 'Freelance project' }, { id: 'hi', label: 'Just saying hi' }];
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
      const missing = [];
      if (!f.name.trim()) missing.push('your name');
      if (!emailOk) missing.push('a valid email');
      if (!f.message.trim()) missing.push('a message');
      const bad = (ok) => s.tried && !ok ? '#E4572E' : 'rgba(var(--ink-rgb),0.16)';
      const any = !!(f.name || f.company || f.email || f.message);
      const on = {}, blur = {};
      ['name', 'company', 'email', 'message'].forEach((k) => { on[k] = (e) => this.ctSet(k, e.target.value); blur[k] = () => this.ctLaunch(k); });
      const inboxList = ['name', 'company', 'email', 'type', 'message'].filter((k) => s.inbox[k]).map((k) => s.inbox[k]);
      const sent = s.phase !== 'idle';
      const received = s.phase === 'received';
      return {
        f: f, on: on, blur: blur,
        err: { name: bad(!!f.name.trim()), company: 'rgba(var(--ink-rgb),0.16)', email: bad(emailOk), message: bad(!!f.message.trim()) },
        types: T.map((x) => {
          const sel = x.id === s.type;
          return { label: x.label, pressed: sel ? 'true' : 'false', bg: sel ? 'var(--accent)' : 'transparent', fg: sel ? 'var(--bg)' : 'var(--ink)', border: sel ? 'var(--accent)' : 'rgba(var(--ink-rgb),0.2)', pick: () => { this.setState({ type: x.id }); this.ctLaunch('type', x.id); } };
        }),
        typeLabel: this.ctTypeLabel(s.type),
        companyText: f.company.trim() || 'Independent',
        flights: s.flights,
        inbox: inboxList, inboxEmpty: inboxList.length === 0 && !received,
        hasInbox: inboxList.length > 0 && !received,
        waitLine: any ? 'Finish a field and watch it fly over…' : 'Waiting for your first detail…',
        sent: sent, notSent: !sent, received: received, notReceived: !received,
        sending: s.phase === 'sending',
        showError: s.tried && missing.length > 0 && !sent,
        errorText: 'Please add ' + missing.join(', ') + '.',
        hrHands: s.typing && !sent ? 'cttype' : '',
        meHappy: received ? 1 : 0, meNeutral: received ? 0 : 1, waveClass: received ? "ctwave" : "",
        hrOp: (s.typing || any) && !sent ? 1 : 0.5, hrOpF: (s.typing || any) && !sent ? "none" : "saturate(0.3)",
        meOp: inboxList.length || sent ? 1 : 0.5, meOpF: inboxList.length || sent ? "none" : "saturate(0.3)",
        browY: received ? -2 : (s.typing ? -1 : 0),
        hrStatus: received ? 'Delivered ✓' : (s.phase === 'sending' ? 'Sending…' : (any ? 'Typing…' : 'At desk')),
        meStatus: received ? 'Received ✓' : (s.phase === 'sending' ? 'Incoming…' : (inboxList.length ? 'Reading along' : 'Waiting for enquiries')),
        meChipBg: received ? '#1F2A22' : 'var(--accent-soft)', meChipFg: received ? '#A6E3BF' : 'var(--accent)',
        recvDots: ['name', 'company', 'email', 'type', 'message'].map((k) => ({ c: (s.inbox[k] || received) ? 'var(--accent)' : 'var(--line-strong)', w: (s.inbox[k] || received) ? '28px' : '14px' })),
        thanksName: f.name.trim() ? ', ' + f.name.trim().split(' ')[0] : '',
        sentTitle: received ? 'Delivered to Nikhil.' : 'Sending…',
        sentLine: received ? 'He’s got your enquiry. You’ll hear back soon.' : 'Your enquiry card is on its way.',
        send: () => { if (missing.length) { this.setState({ tried: true }); return; } this.ctSubmit(); },
        reset: () => {
          this.timers.forEach(clearTimeout);
          this.timers = [];
          this.setState({
            f: { name: '', company: '', email: '', message: '' },
            type: 'role', phase: 'idle', tried: false, typing: false,
            flights: [], inbox: {}, flown: {}, step: 0, stepTried: false
          });
        },
      };
    }
    renderVals() {
      const light = this.state.light;
      return Object.assign({}, this.heroVals(), this.videoVals(), this.contactVals(), {
        idTag: (this.props.identity ?? 'Name tag') === 'Name tag',
        idCursor: this.props.identity === 'Cursor label',
        idBig: this.props.identity === 'Big name',
        idCard: this.props.identity === 'Avatar card',
        idHello: this.props.identity === 'Hello line',
        themeClass: light ? 'theme-light' : 'theme-dark',
        isLight: light, isDark: !light,
        themeText: light ? 'Dark' : 'Light',
        themeLabel: light ? 'Switch to dark theme' : 'Switch to light theme',
        toggleTheme: () => this.setState({ light: !this.state.light }),
        copyLabel: this.state.copied ? 'Copied ✓' : 'Copy address',
        copyEmail: () => {
          const done = () => {
            this.setState({ copied: true });
            clearTimeout(this.copyT);
            this.copyT = setTimeout(() => this.setState({ copied: false }), 1800);
          };
          try {
            navigator.clipboard.writeText('satavnikhil9898@gmail.com').then(done, done);
          } catch (e) {
            done();
          }
        }
      });
    }
  }

  /**
   * Hero identity style. One of:
   * 'Name tag' | 'Cursor label' | 'Big name' | 'Avatar card' | 'Hello line'
   */
  const PROPS = {
    identity: { default: 'Name tag' }
  };

  mountDC(
    document.getElementById('dc-template'),
    Portfolio,
    PROPS,
    document.getElementById('app')
  );
})();
