// State
let currentTab = 'shadow';
let gradientType = 'linear';
let radiusMode = 'uniform';
let shadowLayers = [];

// ── Presets ──────────────────────────────────────────────────────────────────

const PRESETS = {
  shadow: [
    { name: 'Soft',   x:0,  y:4,  blur:24, spread:0,  opacity:10, color:'#000000', inset:false },
    { name: 'Lifted', x:0,  y:8,  blur:32, spread:-4, opacity:15, color:'#000000', inset:false },
    { name: 'Sharp',  x:4,  y:4,  blur:0,  spread:0,  opacity:80, color:'#000000', inset:false },
    { name: 'Dreamy', x:0,  y:20, blur:60, spread:-8, opacity:20, color:'#6366f1', inset:false },
    { name: 'Glow',   x:0,  y:0,  blur:24, spread:4,  opacity:60, color:'#6366f1', inset:false },
    { name: 'Inner',  x:0,  y:4,  blur:12, spread:0,  opacity:15, color:'#000000', inset:true  },
  ],
  gradient: [
    { name: 'Sunset', stops:[{c:'#f97316',p:0},{c:'#ec4899',p:100}], type:'linear', angle:135 },
    { name: 'Ocean',  stops:[{c:'#06b6d4',p:0},{c:'#6366f1',p:100}], type:'linear', angle:135 },
    { name: 'Forest', stops:[{c:'#10b981',p:0},{c:'#3b82f6',p:100}], type:'linear', angle:135 },
    { name: 'Aurora', stops:[{c:'#8b5cf6',p:0},{c:'#06b6d4',p:50},{c:'#10b981',p:100}], type:'linear', angle:135 },
    { name: 'Gold',   stops:[{c:'#fbbf24',p:0},{c:'#f97316',p:100}], type:'linear', angle:135 },
    { name: 'Candy',  stops:[{c:'#f472b6',p:0},{c:'#a78bfa',p:100}], type:'linear', angle:135 },
  ],
  glass: [
    { name: 'Frost',   blur:16, opacity:15, border:20, sat:180, color:'#ffffff' },
    { name: 'Smoke',   blur:12, opacity:8,  border:15, sat:150, color:'#888888' },
    { name: 'Tinted',  blur:20, opacity:25, border:30, sat:200, color:'#6366f1' },
    { name: 'Crystal', blur:8,  opacity:6,  border:40, sat:220, color:'#ffffff' },
    { name: 'Gold',    blur:16, opacity:20, border:25, sat:180, color:'#f59e0b' },
  ],
  'text-shadow': [
    { name: 'Soft',  x:1, y:2,  blur:4,  opacity:30,  color:'#000000' },
    { name: 'Deep',  x:3, y:6,  blur:8,  opacity:40,  color:'#000000' },
    { name: 'Neon',  x:0, y:0,  blur:16, opacity:100, color:'#6366f1' },
    { name: 'Retro', x:3, y:3,  blur:0,  opacity:100, color:'#f97316' },
    { name: 'Glow',  x:0, y:0,  blur:20, opacity:80,  color:'#ec4899' },
  ],
  radius: [
    { name: 'Sharp',    mode:'uniform',    all:0,  color:'#6366f1' },
    { name: 'Soft',     mode:'uniform',    all:8,  color:'#6366f1' },
    { name: 'Rounded',  mode:'uniform',    all:16, color:'#6366f1' },
    { name: 'Pill',     mode:'uniform',    all:50, color:'#6366f1' },
    { name: 'Squircle', mode:'individual', tl:30,  tr:70, bl:70, br:30, color:'#6366f1' },
    { name: 'Blob',     mode:'individual', tl:60,  tr:30, bl:40, br:70, color:'#8b5cf6' },
  ],
};

function buildPresetThumb(tab, preset) {
  const thumb = document.createElement('div');
  thumb.className = 'preset-thumb';

  if (tab === 'shadow') {
    const rgba = hexToRgba(preset.color, preset.opacity);
    thumb.style.boxShadow = `${preset.inset ? 'inset ' : ''}${preset.x}px ${preset.y}px ${preset.blur}px ${preset.spread}px ${rgba}`;
  } else if (tab === 'gradient') {
    const s = preset.stops.map(p => `${p.c} ${p.p}%`).join(', ');
    thumb.style.background = `linear-gradient(${preset.angle}deg, ${s})`;
    thumb.style.border = 'none';
  } else if (tab === 'glass') {
    thumb.style.background = 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)';
    thumb.style.border = 'none';
    const inner = document.createElement('div');
    inner.style.cssText = `position:absolute;inset:0;background:${hexToRgba(preset.color, preset.opacity)};border:1px solid ${hexToRgba(preset.color, preset.border)};backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);`;
    thumb.appendChild(inner);
  } else if (tab === 'text-shadow') {
    thumb.style.cssText = 'display:flex;align-items:center;justify-content:center;border:none;background:transparent;';
    const t = document.createElement('span');
    t.textContent = 'Ag';
    t.style.cssText = `font-size:17px;font-weight:700;color:var(--text);text-shadow:${preset.x}px ${preset.y}px ${preset.blur}px ${hexToRgba(preset.color, preset.opacity)};`;
    thumb.appendChild(t);
  } else if (tab === 'radius') {
    thumb.style.background = preset.color;
    thumb.style.border = 'none';
    if (preset.mode === 'uniform') {
      thumb.style.borderRadius = Math.min(preset.all * 0.4, 17) + 'px';
    } else {
      const s = 0.38;
      thumb.style.borderRadius = `${preset.tl*s}px ${preset.tr*s}px ${preset.br*s}px ${preset.bl*s}px`;
    }
  }
  return thumb;
}

function renderPresets() {
  Object.entries(PRESETS).forEach(([tab, presets]) => {
    const container = document.getElementById('tab-' + tab);
    if (!container) return;
    const strip = document.createElement('div');
    strip.className = 'preset-strip';
    strip.id = 'preset-strip-' + tab;
    presets.forEach((preset, i) => {
      const chip = document.createElement('button');
      chip.className = 'preset-chip';
      chip.onclick = () => applyPreset(tab, i);
      chip.appendChild(buildPresetThumb(tab, preset));
      const label = document.createElement('span');
      label.textContent = preset.name;
      chip.appendChild(label);
      strip.appendChild(chip);
    });
    container.insertBefore(strip, container.firstChild);
  });
}

function applyPreset(tab, idx) {
  const preset = PRESETS[tab]?.[idx];
  if (!preset) return;

  const strip = document.getElementById('preset-strip-' + tab);
  if (strip) strip.querySelectorAll('.preset-chip').forEach((c, i) => c.classList.toggle('active', i === idx));

  if (tab === 'shadow') {
    document.getElementById('shadow-x').value = preset.x;
    document.getElementById('shadow-y').value = preset.y;
    document.getElementById('shadow-blur').value = preset.blur;
    document.getElementById('shadow-spread').value = preset.spread;
    document.getElementById('shadow-opacity').value = preset.opacity;
    document.getElementById('shadow-color').value = preset.color;
    document.getElementById('shadow-inset').checked = preset.inset;
    shadowLayers = [];
    renderShadowLayers();
  } else if (tab === 'gradient') {
    setGradientType(preset.type);
    document.getElementById('gradient-angle').value = preset.angle;
    const stopsEl = document.getElementById('gradient-stops');
    stopsEl.innerHTML = '';
    preset.stops.forEach(s => {
      const row = document.createElement('div');
      row.className = 'stop-row';
      row.innerHTML = `<input type="color" value="${s.c}" oninput="update()"/><input type="range" min="0" max="100" value="${s.p}" oninput="update()"/><span class="stop-pct">${s.p}%</span>`;
      stopsEl.appendChild(row);
    });
  } else if (tab === 'glass') {
    document.getElementById('glass-blur').value = preset.blur;
    document.getElementById('glass-opacity').value = preset.opacity;
    document.getElementById('glass-border').value = preset.border;
    document.getElementById('glass-sat').value = preset.sat;
    document.getElementById('glass-color').value = preset.color;
  } else if (tab === 'text-shadow') {
    document.getElementById('ts-x').value = preset.x;
    document.getElementById('ts-y').value = preset.y;
    document.getElementById('ts-blur').value = preset.blur;
    document.getElementById('ts-opacity').value = preset.opacity;
    document.getElementById('ts-color').value = preset.color;
  } else if (tab === 'radius') {
    setRadiusMode(preset.mode);
    if (preset.mode === 'uniform') {
      document.getElementById('radius-all').value = preset.all;
    } else {
      document.getElementById('radius-tl').value = preset.tl;
      document.getElementById('radius-tr').value = preset.tr;
      document.getElementById('radius-bl').value = preset.bl;
      document.getElementById('radius-br').value = preset.br;
    }
    document.getElementById('radius-color').value = preset.color;
  }
  update();
}

// ── Theme ─────────────────────────────────────────────────────────────────────

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.classList.add('transitioning');
  setTimeout(() => html.classList.remove('transitioning'), 300);
  const next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.getElementById('theme-toggle').textContent = next === 'dark' ? '◐' : '◑';
  localStorage.setItem('cssgen-theme', next);
}

// ── Syntax highlighting ───────────────────────────────────────────────────────

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function highlightCSS(raw) {
  if (!raw) return '';
  return raw.split('\n').map(line => {
    const ci = line.indexOf(':');
    if (ci < 0) return escHtml(line);
    const prop = line.slice(0, ci);
    let val = line.slice(ci + 1);
    const marks = [];
    const mark = (text, cls) => {
      marks.push(`<span class="${cls}">${escHtml(text)}</span>`);
      return `\x00${marks.length - 1}\x00`;
    };
    val = val.replace(/#[0-9a-fA-F]{8}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g, m => mark(m, 'tok-hex'));
    val = val.replace(/\b(rgba?|hsla?|linear-gradient|radial-gradient|conic-gradient|blur|saturate|drop-shadow)\b/g, m => mark(m, 'tok-func'));
    val = val.replace(/-?\d+(?:\.\d+)?(px|%|deg|em|rem)/g, m => mark(m, 'tok-num'));
    val = val.replace(/\b(inset|circle|from)\b/g, m => mark(m, 'tok-kw'));
    val = val.replace(/;/g, m => mark(m, 'tok-punc'));
    const parts = val.split(/\x00(\d+)\x00/);
    const result = parts.map((p, i) => i % 2 === 0 ? escHtml(p) : marks[parseInt(p)]).join('');
    return `<span class="tok-prop">${escHtml(prop)}</span><span class="tok-punc">:</span>${result}`;
  }).join('\n');
}

// ── Tab switching ─────────────────────────────────────────────────────────────

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  update();
}

// ── Gradient type ─────────────────────────────────────────────────────────────

function setGradientType(type) {
  gradientType = type;
  document.querySelectorAll('#gradient-type .seg').forEach(s => s.classList.toggle('active', s.dataset.val === type));
  document.getElementById('angle-group').style.display = type === 'radial' ? 'none' : 'block';
  update();
}

// ── Radius mode ───────────────────────────────────────────────────────────────

function setRadiusMode(mode) {
  radiusMode = mode;
  document.querySelectorAll('#tab-radius .seg').forEach((s, i) => s.classList.toggle('active', (i === 0) === (mode === 'uniform')));
  document.getElementById('radius-uniform').style.display = mode === 'uniform' ? 'block' : 'none';
  document.getElementById('radius-individual').style.display = mode === 'individual' ? 'block' : 'none';
  update();
}

// ── Shadow layers ─────────────────────────────────────────────────────────────

function addShadowLayer() {
  const css = buildShadowCSS();
  if (!css) return;
  shadowLayers.push(css);
  renderShadowLayers();
  update();
}

function removeShadowLayer(i) {
  shadowLayers.splice(i, 1);
  renderShadowLayers();
  update();
}

function renderShadowLayers() {
  const wrap = document.getElementById('shadow-layers');
  wrap.innerHTML = shadowLayers.map((l, i) => `
    <div class="layer-tag">
      <span>${l}</span>
      <button onclick="removeShadowLayer(${i})">×</button>
    </div>
  `).join('');
}

// ── Gradient stops ────────────────────────────────────────────────────────────

function addGradientStop() {
  const stops = document.getElementById('gradient-stops');
  const row = document.createElement('div');
  row.className = 'stop-row';
  row.innerHTML = `
    <input type="color" value="#a855f7" oninput="update()"/>
    <input type="range" min="0" max="100" value="50" oninput="update()"/>
    <span class="stop-pct">50%</span>
  `;
  stops.appendChild(row);
  update();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity/100).toFixed(2)})`;
}

function v(id) { return document.getElementById(id)?.value; }
function vn(id) { return parseFloat(v(id)); }
function setVal(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

// ── Build CSS ─────────────────────────────────────────────────────────────────

function buildShadowCSS() {
  const x = vn('shadow-x'), y = vn('shadow-y'), blur = vn('shadow-blur'),
        spread = vn('shadow-spread'), opacity = vn('shadow-opacity'),
        color = v('shadow-color'), inset = document.getElementById('shadow-inset')?.checked;
  return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;
}

function buildGradientCSS() {
  const stops = [...document.querySelectorAll('#gradient-stops .stop-row')].map(row => {
    const color = row.querySelector('input[type="color"]').value;
    const pct = row.querySelector('input[type="range"]').value;
    return `${color} ${pct}%`;
  });
  const angle = vn('gradient-angle');
  if (gradientType === 'linear') return `linear-gradient(${angle}deg, ${stops.join(', ')})`;
  if (gradientType === 'radial') return `radial-gradient(circle, ${stops.join(', ')})`;
  return `conic-gradient(from ${angle}deg, ${stops.join(', ')})`;
}

function buildGlassCSS() {
  return {
    bg: hexToRgba(v('glass-color'), vn('glass-opacity')),
    blur: vn('glass-blur'),
    sat: vn('glass-sat'),
    bc: hexToRgba(v('glass-color'), vn('glass-border')),
  };
}

function buildTextShadowCSS() {
  return `${vn('ts-x')}px ${vn('ts-y')}px ${vn('ts-blur')}px ${hexToRgba(v('ts-color'), vn('ts-opacity'))}`;
}

function buildRadiusCSS() {
  if (radiusMode === 'uniform') return `${vn('radius-all')}px`;
  return `${vn('radius-tl')}px ${vn('radius-tr')}px ${vn('radius-br')}px ${vn('radius-bl')}px`;
}

// ── Preview scale ─────────────────────────────────────────────────────────────

function updatePreviewScale() {
  const scale = vn('preview-scale');
  document.getElementById('preview-box').style.transform = `scale(${scale / 100})`;
  setVal('preview-scale-val', (scale / 100).toFixed(1) + '×');
}

// ── Main update ───────────────────────────────────────────────────────────────

function update() {
  const box = document.getElementById('preview-box');
  const output = document.getElementById('css-output');

  setVal('shadow-x-val',      v('shadow-x') + 'px');
  setVal('shadow-y-val',      v('shadow-y') + 'px');
  setVal('shadow-blur-val',   v('shadow-blur') + 'px');
  setVal('shadow-spread-val', v('shadow-spread') + 'px');
  setVal('shadow-opacity-val',v('shadow-opacity') + '%');
  setVal('gradient-angle-val',v('gradient-angle') + '°');
  setVal('glass-blur-val',    v('glass-blur') + 'px');
  setVal('glass-opacity-val', v('glass-opacity') + '%');
  setVal('glass-border-val',  v('glass-border') + '%');
  setVal('glass-sat-val',     v('glass-sat') + '%');
  setVal('ts-x-val',          v('ts-x') + 'px');
  setVal('ts-y-val',          v('ts-y') + 'px');
  setVal('ts-blur-val',       v('ts-blur') + 'px');
  setVal('ts-opacity-val',    v('ts-opacity') + '%');
  setVal('radius-all-val',    v('radius-all') + 'px');
  setVal('radius-tl-val',     v('radius-tl') + 'px');
  setVal('radius-tr-val',     v('radius-tr') + 'px');
  setVal('radius-bl-val',     v('radius-bl') + 'px');
  setVal('radius-br-val',     v('radius-br') + 'px');

  document.querySelectorAll('#gradient-stops .stop-row').forEach(row => {
    const pct = row.querySelector('input[type="range"]').value;
    row.querySelector('.stop-pct').textContent = pct + '%';
  });

  // Reset box to base state, preserving scale transform
  const scale = vn('preview-scale') || 100;
  box.removeAttribute('style');
  box.style.width = '160px';
  box.style.height = '100px';
  box.style.display = 'flex';
  box.style.alignItems = 'center';
  box.style.justifyContent = 'center';
  box.style.fontSize = '13px';
  box.style.fontWeight = '500';
  box.style.transform = `scale(${scale / 100})`;

  let cssLines = [];

  if (currentTab === 'shadow') {
    const current = buildShadowCSS();
    const all = [...shadowLayers, current];
    box.style.boxShadow = all.join(', ');
    box.style.background = 'var(--surface)';
    box.style.border = '1px solid var(--border)';
    box.style.borderRadius = '12px';
    box.style.color = 'var(--muted)';
    cssLines = [`box-shadow: ${all.join(',\n         ')};`];

  } else if (currentTab === 'gradient') {
    const grad = buildGradientCSS();
    box.style.background = grad;
    box.style.borderRadius = '12px';
    box.style.border = 'none';
    box.style.color = 'rgba(255,255,255,0.9)';
    cssLines = [`background: ${grad};`];

  } else if (currentTab === 'glass') {
    const { bg, blur, sat, bc } = buildGlassCSS();
    box.style.background = bg;
    box.style.backdropFilter = `blur(${blur}px) saturate(${sat}%)`;
    box.style.webkitBackdropFilter = `blur(${blur}px) saturate(${sat}%)`;
    box.style.border = `1px solid ${bc}`;
    box.style.borderRadius = '12px';
    box.style.color = 'var(--text)';
    box.style.transform = `scale(${scale / 100})`;
    document.querySelector('.preview-stage').style.background = 'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)';
    cssLines = [
      `background: ${bg};`,
      `-webkit-backdrop-filter: blur(${blur}px) saturate(${sat}%);`,
      `backdrop-filter: blur(${blur}px) saturate(${sat}%);`,
      `border: 1px solid ${bc};`,
    ];

  } else if (currentTab === 'text-shadow') {
    const ts = buildTextShadowCSS();
    const text = v('ts-text') || 'CSS is fun';
    box.style.background = 'var(--surface)';
    box.style.border = '1px solid var(--border)';
    box.style.borderRadius = '12px';
    box.style.width = '200px';
    box.style.height = '80px';
    box.style.fontSize = '18px';
    box.style.fontWeight = '600';
    box.style.color = 'var(--text)';
    box.style.textShadow = ts;
    box.style.transform = `scale(${scale / 100})`;
    box.querySelector('span').textContent = text;
    cssLines = [`text-shadow: ${ts};`];

  } else if (currentTab === 'radius') {
    const r = buildRadiusCSS();
    box.style.borderRadius = r;
    box.style.background = v('radius-color');
    box.style.border = 'none';
    box.style.color = 'rgba(255,255,255,0.9)';
    cssLines = [`border-radius: ${r};`];
  }

  if (currentTab !== 'glass') {
    document.querySelector('.preview-stage').style.background = '';
  }

  if (currentTab !== 'text-shadow') {
    box.querySelector('span').textContent = 'Preview';
  }

  output.innerHTML = highlightCSS(cssLines.join('\n'));
}

// ── Copy CSS ──────────────────────────────────────────────────────────────────

function copyCSS() {
  const text = document.getElementById('css-output').textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

renderPresets();

// Sync theme toggle icon to loaded theme
(function() {
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = '◐';
  }
})();

update();
