/**
 * Tiny template runtime.
 *
 * Renders a <template> element using {{ expression }} bindings plus two
 * structural tags:
 *   <sc-if value="{{cond}}">…</sc-if>            conditional block
 *   <sc-for list="{{items}}" as="item">…</sc-for>  repeated block
 *
 * Event attributes such as onClick="{{handler}}" are bound to the functions
 * returned by the component's renderVals(). State changes re-render on the
 * next animation frame and patch the existing DOM in place.
 *
 * Exposes: window.DCLogic (component base class) and window.mountDC().
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Expression evaluation
     ------------------------------------------------------------------------ */
  const fnCache = new Map();

  function evaluate(expr, scope) {
    let fn = fnCache.get(expr);
    if (!fn) {
      try {
        fn = new Function('__s', 'with (__s) { return (' + expr + '); }');
      } catch (e) {
        fn = () => undefined;
      }
      fnCache.set(expr, fn);
    }
    try {
      return fn(scope);
    } catch (e) {
      return undefined;
    }
  }

  const WHOLE = /^\s*\{\{((?:(?!\}\})[\s\S])+)\}\}\s*$/;
  const HOLE = /\{\{([\s\S]+?)\}\}/g;

  /** Returns the raw value for "{{expr}}", or an interpolated string otherwise. */
  function interpolate(str, scope) {
    const match = str.match(WHOLE);
    if (match) return evaluate(match[1], scope);
    if (str.indexOf('{{') === -1) return str;
    return str.replace(HOLE, (_, expr) => {
      const value = evaluate(expr, scope);
      return value == null ? '' : String(value);
    });
  }

  const EVENTS = {
    onclick: 'click',
    oninput: 'input',
    onblur: 'blur',
    onfocus: 'focus',
    onkeydown: 'keydown',
    onmouseenter: 'mouseenter',
    onpointermove: 'pointermove',
    onchange: 'change',
    onmousemove: 'mousemove',
    onscroll: 'scroll',
    onmouseleave: 'mouseleave',
    onsubmit: 'submit'
  };

  /* ------------------------------------------------------------------------
     Build a virtual tree from the template
     ------------------------------------------------------------------------ */
  function build(tplParent, scope, out) {
    for (const node of tplParent.childNodes) {
      if (node.nodeType === 3) {
        const text = interpolate(node.nodeValue, scope);
        out.push({ text: text == null ? '' : String(text), tpl: node });
        continue;
      }
      if (node.nodeType !== 1) continue;

      const tag = node.localName;

      if (tag === 'sc-if') {
        if (interpolate(node.getAttribute('value') || '', scope)) build(node, scope, out);
        continue;
      }

      if (tag === 'sc-for') {
        const list = interpolate(node.getAttribute('list') || '', scope) || [];
        const as = node.getAttribute('as') || 'item';
        list.forEach((item, i) => {
          const childScope = Object.create(scope);
          childScope[as] = item;
          childScope.$index = i;
          build(node, childScope, out);
        });
        continue;
      }

      const attrs = {};
      const events = {};
      let key = null;

      for (const attr of node.attributes) {
        const name = attr.name;
        if (name.indexOf('hint-') === 0) continue;
        const value = interpolate(attr.value, scope);
        if (name === 'key') {
          key = value == null ? null : String(value);
          continue;
        }
        if (EVENTS[name]) {
          if (typeof value === 'function') events[EVENTS[name]] = value;
          continue;
        }
        attrs[name] = value;
      }

      const children = [];
      build(node, scope, children);
      out.push({ tpl: node, ns: node.namespaceURI, tag, attrs, events, key, children });
    }
    return out;
  }

  /* ------------------------------------------------------------------------
     DOM creation and patching
     ------------------------------------------------------------------------ */
  function create(vnode) {
    if (vnode.text !== undefined) {
      const textNode = document.createTextNode(vnode.text);
      textNode.__tpl = vnode.tpl;
      return textNode;
    }
    const el = document.createElementNS(vnode.ns, vnode.tag);
    el.__tpl = vnode.tpl;
    el.__key = vnode.key;
    el.__h = {};
    el.__a = {};
    update(el, vnode, true);
    return el;
  }

  function setAttr(el, name, value) {
    const isField = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT';
    if (name === 'value' && isField) {
      const str = value == null ? '' : String(value);
      if (el.value !== str) el.value = str;
      if (el.tagName === 'INPUT') el.setAttribute('value', str);
      return;
    }
    if (value === false || value == null) {
      el.removeAttribute(name);
      return;
    }
    el.setAttribute(name, value === true ? '' : String(value));
  }

  function update(el, vnode, fresh) {
    const prev = el.__a;
    for (const name in prev) {
      if (!(name in vnode.attrs)) el.removeAttribute(name);
    }
    for (const name in vnode.attrs) {
      const value = vnode.attrs[name];
      if (fresh || prev[name] !== value || name === 'value') setAttr(el, name, value);
    }
    el.__a = vnode.attrs;

    for (const type in vnode.events) {
      if (!el.__h[type]) {
        el.addEventListener(type, (e) => {
          const handler = el.__h[type];
          if (handler) handler(e);
        });
      }
      el.__h[type] = vnode.events[type];
    }
    for (const type in el.__h) {
      if (!vnode.events[type]) el.__h[type] = null;
    }

    patchChildren(el, vnode.children);
  }

  function patchChildren(parent, vnodes) {
    const kids = Array.from(parent.childNodes);
    vnodes.forEach((vnode, i) => {
      const current = kids[i];
      const reusable =
        current &&
        current.__tpl === vnode.tpl &&
        (vnode.text !== undefined || current.__key === vnode.key);

      if (reusable) {
        if (vnode.text !== undefined) {
          if (current.nodeValue !== vnode.text) current.nodeValue = vnode.text;
        } else {
          update(current, vnode, false);
        }
      } else {
        const fresh = create(vnode);
        if (current) parent.replaceChild(fresh, current);
        else parent.appendChild(fresh);
        kids[i] = fresh;
      }
    });
    for (let i = kids.length - 1; i >= vnodes.length; i--) {
      if (kids[i]) parent.removeChild(kids[i]);
    }
  }

  /* ------------------------------------------------------------------------
     Component base class
     ------------------------------------------------------------------------ */
  class DCLogic {
    constructor(props) {
      this.props = props || {};
      this.state = {};
    }

    setState(patch) {
      const next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
      if (next) this.state = Object.assign({}, this.state, next);
      if (this.__render && !this.__queued) {
        this.__queued = true;
        requestAnimationFrame(() => {
          this.__queued = false;
          this.__render();
        });
      }
    }

    renderVals() {
      return {};
    }
  }

  /* ------------------------------------------------------------------------
     Mount
     ------------------------------------------------------------------------ */
  /**
   * @param {HTMLTemplateElement} tplEl   Template to render.
   * @param {typeof DCLogic} Component    Component class (extends DCLogic).
   * @param {Object} propsSpec            { propName: { default: value } }.
   * @param {Element} mountEl             Element to render into.
   */
  function mountDC(tplEl, Component, propsSpec, mountEl) {
    const props = {};
    for (const name in propsSpec) {
      if (name[0] !== '$' && propsSpec[name] && 'default' in propsSpec[name]) {
        props[name] = propsSpec[name].default;
      }
    }

    const instance = new Component(props);
    instance.__render = () => {
      const vals = instance.renderVals() || {};
      patchChildren(mountEl, build(tplEl.content, vals, []));
    };
    instance.__render();

    if (instance.componentDidMount) instance.componentDidMount();
    window.addEventListener('pagehide', () => {
      if (instance.componentWillUnmount) instance.componentWillUnmount();
    });
  }

  window.DCLogic = DCLogic;
  window.mountDC = mountDC;
})();
