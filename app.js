// State
let currentTab = 'shadow';
let gradientType = 'linear';
let radiusMode = 'uniform';
let shadowLayers = [];

// Tab switching
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  update();
}

// Gradient type
function setGradientType(type) {
  gradientType = type;
  document.querySelectorAll('#gradient-type .seg').forEach(s => s.classList.toggle('active', s.dataset.val === type));
  document.getElementById('angle-group').style.display = type === 'radial' ? 'none' : 'block';
  update();
}

// Radius mode
function setRadiusMode(mode) {
  radiusMode = mode;
  document.querySelectorAll('#tab-radius .seg').forEach((s, i) => s.classList.toggle('active', (i === 0) === (mode === 'uniform')));
  document.getElementById('radius-uniform').style.display = mode === 'uniform' ? 'block' : 'none';
  document.getElementById('radius-individual').style.display = mode === 'individual' ? 'block' : 'none';
  update();
}

// Add shadow layer
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

// Add gradient stop
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

// Helper: hex + opacity to rgba
function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity/100).toFixed(2)})`;
}

// Helper: get val
function v(id) { return document.getElementById(id)?.value; }
function vn(id) { return parseFloat(v(id)); }
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// Build CSS for each tab
function buildShadowCSS() {
  const x = vn('shadow-x');
  const y = vn('shadow-y');
  const blur = vn('shadow-blur');
  const spread = vn('shadow-spread');
  const opacity = vn('shadow-opacity');
  const color = v('shadow-color');
  const inset = document.getElementById('shadow-inset')?.checked;
  const rgba = hexToRgba(color, opacity);
  return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
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
  const blur = vn('glass-blur');
  const opacity = vn('glass-opacity');
  const border = vn('glass-border');
  const sat = vn('glass-sat');
  const color = v('glass-color');
  const bg = hexToRgba(color, opacity);
  const bc = hexToRgba(color, border);
  return { bg, blur, sat, bc };
}

function buildTextShadowCSS() {
  const x = vn('ts-x');
  const y = vn('ts-y');
  const blur = vn('ts-blur');
  const opacity = vn('ts-opacity');
  const color = v('ts-color');
  const rgba = hexToRgba(color, opacity);
  return `${x}px ${y}px ${blur}px ${rgba}`;
}

function buildRadiusCSS() {
  if (radiusMode === 'uniform') {
    return `${vn('radius-all')}px`;
  }
  const tl = vn('radius-tl');
  const tr = vn('radius-tr');
  const bl = vn('radius-bl');
  const br = vn('radius-br');
  return `${tl}px ${tr}px ${br}px ${bl}px`;
}

// Main update function
function update() {
  const box = document.getElementById('preview-box');
  const output = document.getElementById('css-output');

  // Update slider value displays
  setVal('shadow-x-val', v('shadow-x') + 'px');
  setVal('shadow-y-val', v('shadow-y') + 'px');
  setVal('shadow-blur-val', v('shadow-blur') + 'px');
  setVal('shadow-spread-val', v('shadow-spread') + 'px');
  setVal('shadow-opacity-val', v('shadow-opacity') + '%');
  setVal('gradient-angle-val', v('gradient-angle') + '°');
  setVal('glass-blur-val', v('glass-blur') + 'px');
  setVal('glass-opacity-val', v('glass-opacity') + '%');
  setVal('glass-border-val', v('glass-border') + '%');
  setVal('glass-sat-val', v('glass-sat') + '%');
  setVal('ts-x-val', v('ts-x') + 'px');
  setVal('ts-y-val', v('ts-y') + 'px');
  setVal('ts-blur-val', v('ts-blur') + 'px');
  setVal('ts-opacity-val', v('ts-opacity') + '%');
  setVal('radius-all-val', v('radius-all') + 'px');
  setVal('radius-tl-val', v('radius-tl') + 'px');
  setVal('radius-tr-val', v('radius-tr') + 'px');
  setVal('radius-bl-val', v('radius-bl') + 'px');
  setVal('radius-br-val', v('radius-br') + 'px');

  // Update gradient stop pct labels
  document.querySelectorAll('#gradient-stops .stop-row').forEach(row => {
    const pct = row.querySelector('input[type="range"]').value;
    row.querySelector('.stop-pct').textContent = pct + '%';
  });

  // Reset box styles
  box.style.cssText = '';
  box.style.width = '160px';
  box.style.height = '100px';
  box.style.display = 'flex';
  box.style.alignItems = 'center';
  box.style.justifyContent = 'center';
  box.style.fontSize = '13px';
  box.style.fontWeight = '500';
  box.style.transition = 'all 0.15s ease';

  let cssLines = [];

  if (currentTab === 'shadow') {
    const current = buildShadowCSS();
    const all = [...shadowLayers, current].join(',\n  ');
    box.style.boxShadow = all;
    box.style.background = '#ffffff';
    box.style.border = '1px solid #e4e2dd';
    box.style.borderRadius = '12px';
    box.style.color = '#78766f';
    const allFormatted = [...shadowLayers, current].join(',\n         ');
    cssLines = [`box-shadow: ${allFormatted};`];

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
    box.style.color = '#1a1917';
    // Add colorful background behind glass preview
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
    box.style.background = '#ffffff';
    box.style.border = '1px solid #e4e2dd';
    box.style.borderRadius = '12px';
    box.style.width = '200px';
    box.style.height = '80px';
    box.style.fontSize = '18px';
    box.style.fontWeight = '600';
    box.style.color = '#1a1917';
    box.style.textShadow = ts;
    box.querySelector('span').textContent = text;
    cssLines = [`text-shadow: ${ts};`];

  } else if (currentTab === 'radius') {
    const r = buildRadiusCSS();
    const color = v('radius-color');
    box.style.borderRadius = r;
    box.style.background = color;
    box.style.border = 'none';
    box.style.color = 'rgba(255,255,255,0.9)';
    cssLines = [`border-radius: ${r};`];
  }

  // Reset stage background if not glass
  if (currentTab !== 'glass') {
    document.querySelector('.preview-stage').style.background = '';
  }

  // Reset preview text if not text shadow
  if (currentTab !== 'text-shadow') {
    box.querySelector('span').textContent = 'Preview';
  }

  output.textContent = cssLines.join('\n');
}

// Copy CSS
function copyCSS() {
  const text = document.getElementById('css-output').textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}

// Init
update();