/* Viberobo console.js — bilingual hero "vibe generation" animation */
(function () {
  const consoleEl = document.getElementById('console');
  if (!consoleEl) return;

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const $ = s => document.getElementById(s);

  const typeEl = $('typeTarget'), caretEl = $('caret'), aiRow = $('aiRow'),
        aiHint = $('aiHint'), fileList = $('fileList'), statusWrap = $('statusWrap');

  const SCRIPTS = [
    {
      en: 'Make a bipedal robot that waves when it sees my face.',
      zh: '做一个看到我就挥手的双足机器人。',
      files: [
        ['t-project', 'PROJECT', 'project/wave_bot/'],
        ['t-urdf',    'URDF',    'model/wave_bot.urdf'],
        ['t-sim',     'SIM',     'scenes/arena.scene'],
        ['t-code',    'CODE',    'control/balance_controller.py'],
        ['t-web',     'WEB',     'dashboard/index.html'],
        ['t-bridge',  'BRIDGE',  'bridge/ws_bridge.py'],
        ['t-fw',      'FW',      'esp32/main.cpp'],
      ],
      stEn: 'Simulation ready — deploy to your robot →',
      stZh: '仿真通过 — 一键部署到实体机器人 →',
    },
    {
      en: 'Build a rover that follows the black line and dodges obstacles.',
      zh: '造一辆沿黑线行驶、自动避障的小车。',
      files: [
        ['t-project', 'PROJECT', 'project/line_rover/'],
        ['t-urdf',    'URDF',    'model/rover_4w.urdf'],
        ['t-sim',     'SIM',     'scenes/track_world.sdf'],
        ['t-code',    'CODE',    'control/line_follower.py'],
        ['t-web',     'WEB',     'dashboard/telemetry.html'],
        ['t-bridge',  'BRIDGE',  'bridge/mqtt_bridge.py'],
        ['t-fw',      'FW',      'esp32/motor_driver.cpp'],
      ],
      stEn: 'Track run complete — 3 laps, zero collisions →',
      stZh: '循迹完成 — 3 圈零碰撞，可部署 →',
    },
    {
      en: 'Design a desk buddy that breathes and looks at me when I talk.',
      zh: '设计一个会呼吸、我说话时会看着我的桌面伙伴。',
      files: [
        ['t-project', 'PROJECT', 'project/desk_buddy/'],
        ['t-urdf',    'URDF',    'model/buddy_head.urdf'],
        ['t-sim',     'SIM',     'scenes/desk.scene'],
        ['t-code',    'CODE',    'control/attention_loop.py'],
        ['t-web',     'WEB',     'dashboard/mood.html'],
        ['t-bridge',  'BRIDGE',  'bridge/audio_stream.py'],
        ['t-fw',      'FW',      'esp32/servo_breath.cpp'],
      ],
      stEn: 'Personality loaded — buddy is alive →',
      stZh: '人格已注入 — 桌面伙伴已上线 →',
    },
  ];

  const HINT = {
    en: 'Generating full robot project…',
    zh: '正在生成完整机器人工程…',
  };

  let visible = false, runId = 0;
  new IntersectionObserver(es => es.forEach(e => visible = e.isIntersecting), { threshold: .2 })
    .observe(consoleEl);

  const lang = () => (window.vbLang ? window.vbLang.current() : 'en');

  function waitVisible(id) {
    return new Promise(res => (function chk() {
      if (id !== runId) return res(false);
      if (visible && !document.hidden) res(true);
      else setTimeout(chk, 400);
    })());
  }
  async function sleepV(ms, id) {
    const ok = await waitVisible(id);
    if (ok) await sleep(ms);
    return ok;
  }

  function renderStatic() {
    const L = lang(), s = SCRIPTS[0];
    typeEl.textContent = s[L]; caretEl.style.display = 'none';
    aiRow.style.display = 'flex'; aiHint.textContent = HINT[L];
    fileList.innerHTML = s.files.map(f =>
      `<div class="f-row" style="animation:none;opacity:1;transform:none"><span class="f-ok">✓</span><span class="f-tag ${f[0]}">${f[1]}</span><span class="f-path">${f[2]}</span></div>`).join('');
    statusWrap.innerHTML = `<div class="c-status" style="animation:none;opacity:1;transform:none"><span class="st-dot"></span>${L === 'zh' ? s.stZh : s.stEn}</div>`;
  }

  async function play() {
    const id = ++runId;
    if (REDUCED) { renderStatic(); return; }
    if (!(await waitVisible(id))) return;
    await sleep(700);
    while (id === runId) {
      for (const sc of SCRIPTS) {
        if (id !== runId) return;
        const L = lang();
        consoleEl.classList.remove('swap');
        typeEl.textContent = ''; fileList.innerHTML = ''; statusWrap.innerHTML = '';
        aiRow.style.display = 'none'; caretEl.style.display = 'inline-block';
        if (!(await sleepV(500, id))) return;
        for (const ch of sc[L]) {
          typeEl.textContent += ch;
          if (!(await sleepV(26 + Math.random() * 30, id))) return;
        }
        if (!(await sleepV(420, id))) return;
        caretEl.style.display = 'none';
        aiHint.textContent = HINT[L]; aiRow.style.display = 'flex';
        if (!(await sleepV(650, id))) return;
        for (const f of sc.files) {
          const row = document.createElement('div');
          row.className = 'f-row';
          row.innerHTML = `<span class="f-ok">✓</span><span class="f-tag ${f[0]}">${f[1]}</span><span class="f-path">${f[2]}</span>`;
          fileList.appendChild(row);
          if (!(await sleepV(230, id))) return;
        }
        if (!(await sleepV(300, id))) return;
        statusWrap.innerHTML = `<div class="c-status"><span class="st-dot"></span>${L === 'zh' ? sc.stZh : sc.stEn}</div>`;
        if (!(await sleepV(2900, id))) return;
        consoleEl.classList.add('swap');
        if (!(await sleepV(480, id))) return;
      }
    }
  }

  play();
  /* restart animation in the newly selected language */
  document.addEventListener('vb:lang', () => { runId++; play(); });
})();
