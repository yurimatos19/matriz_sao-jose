// "São José" — director's timeline. Every shot is repainted from knife strokes each frame.
import { Impasto, Strokes, hex, shade } from './engine/impasto.js';
import { T, DUR, CUES, LINES, BEAT } from './timeline.js';
import * as S from './scenes/sets.js';
import { clamp, lerp, ss, seg, eo, eio, hash } from './scenes/common.js';

const W = 1920, H = 1080, NEVER = 1e6;
const mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
const TR = (x, y) => [1, 0, 0, 1, x, y], RO = a => [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0];
const about = (px, py, a) => mul(TR(px, py), mul(RO(a), TR(-px, -py)));

let E, P = {}, dyn, sub, card;
export async function setup(canvas) {
  await document.fonts.load('600 100px "Cormorant Garamond"'); await document.fonts.load('italic 600 40px "Cormorant Garamond"');
  E = new Impasto(canvas); dyn = new Strokes(8192);
  const up = (built, w, h) => ({ b: E.batch(built.strokes.data()), tex: E.texture(built.ref.ctx.canvas), w, h });
  const { WW, WH } = S;
  P.shop = up(S.paint(S.drawWorkshop, WW, WH, { seed: 3 }), WW, WH);
  P.jose = up(S.paint(S.drawJoseBody, WW, WH, { seed: 4, R: [20, 10, 5, 2.6] }), WW, WH);
  P.arm = up(S.paint(S.drawJoseArm, WW, WH, { seed: 5, R: [14, 7, 3.5, 2] }), WW, WH);
  P.family = up(S.paint(S.drawFamilyBench, WW, WH, { seed: 6, R: [20, 10, 5, 2.6] }), WW, WH);
  P.dream = up(S.paint(S.drawDream, WW, WH, { seed: 7, rev: (x, y) => Math.hypot(x - S.DREAM_LIGHT[0], (y - S.DREAM_LIGHT[1]) * 1.3) / 1100 + hash(x * .1 + y) * .15 }), WW, WH);
  P.beth = up(S.paint(S.drawBethlehem, S.BW, S.BH, { seed: 8, app: (x, y, lv) => y / S.BH * .3 + x / S.BW * .5 + lv * .03 }), S.BW, S.BH);
  P.desert = up(S.paint(S.drawDesert, S.DW, S.DH, { seed: 9, app: (x, y, lv) => (x / S.DW) * 1.4 + lv * .03 }), S.DW, S.DH);
  P.flight = up(S.paint(S.drawFlight, S.FLIGHT.w, S.FLIGHT.h, { seed: 10, R: [16, 8, 4, 2.2] }), S.FLIGHT.w, S.FLIGHT.h);
  P.matriz = up(S.paint(S.drawMatriz, S.MW, S.MH, { seed: 11 }), S.MW, S.MH);
  P.card = up(S.paint(S.drawTitleCard, W, H, { seed: 12, R: [40, 20, 7, 3.5, 2], T: 10, app: (x, y) => x / W * .8 }), W, H);

  const shade_ = document.createElement('div'); shade_.style.cssText = 'position:fixed;left:0;right:0;bottom:0;height:260px;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(10,6,4,.55));pointer-events:none'; document.body.appendChild(shade_); window.__shade = shade_;
  sub = document.createElement('div');
  sub.style.cssText = 'position:fixed;left:0;right:0;bottom:70px;text-align:center;font:600 46px/1.22 "Cormorant Garamond",serif;color:#fbf2df;text-shadow:0 2px 3px rgba(0,0,0,.9),0 0 26px rgba(0,0,0,.75);white-space:pre-line;padding:0 180px;opacity:0';
  document.body.appendChild(sub);
  card = document.createElement('div');
  card.style.cssText = 'position:fixed;left:0;right:0;top:640px;text-align:center;font-family:"Cormorant Garamond",serif;color:#efe2c4;opacity:0;text-shadow:0 2px 6px rgba(0,0,0,.5)';
  card.innerHTML = '<div style="font:600 44px/1 \'Cormorant Garamond\';letter-spacing:.32em;color:#e8c47a">RECIFE · DESDE 1844</div><div style="font:italic 600 40px/1 \'Cormorant Garamond\';margin-top:34px">São José, rogai por nós.</div>';
  document.body.appendChild(card);

  window.DUR = DUR;
  window.EV = events();
  window.TEXTS = t => t > T.card + 1.6 ? [{ id: 'card', text: 'Matriz de São José Recife · desde 1844 São José, rogai por nós.', x0: 400, y0: 380, x1: 1520, y1: 760 }] : [];
  return frame;
}

function plate(pl, o) {
  const M = o.M || [1, 0, 0, 1, 0, 0];
  const inTrans = o.appear !== undefined && o.t < o.appear + (o.appDur ?? .5);
  const ua = o.appear === undefined ? 1 : seg(o.t, o.appear + (o.appDur ?? .5) * .55, o.appear + (o.appDur ?? .5));
  if (!o.noUnder && ua > 0) E.under(pl.tex, pl.w, pl.h, { ...o, M, alpha: (o.alpha ?? 1) * ua });
  E.draw(pl.b, { ...o, M, appear: inTrans ? o.appear : -1e6, appDur: .14 });
}
const flush = o => { if (dyn.n) E.drawNow(dyn.data(), o); dyn.clear(); };
const keyf = (t, ks) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) { const [t0, v0] = ks[i], [t1, v1] = ks[i + 1]; if (t < t1) return lerp(v0, v1, eio((t - t0) / (t1 - t0))); } return ks[ks.length - 1][1]; };

// ---- planing rhythm: one push per bar half (2 beats), with lift between
const planeAng = t => { const ph = (t / (BEAT * 2)) % 1; return ph < .62 ? lerp(-.07, .09, eio(ph / .62)) : lerp(.09, -.07, eio((ph - .62) / .38)); };

// 1 · Nazaré: macro on the shavings, pull back to José at the bench, slow truck
function shotShop(t, tr) {
  const k = eio(seg(t, .3, 7.0));
  const zoom = lerp(3.1, 1.0, k), x0 = lerp(S.SHAV[0], 1040, k), y0 = lerp(S.SHAV[1], 600, k);
  const cam = { x: x0 + ss(seg(t, 6, 13.5)) * 70, y: y0, zoom: zoom * (1 + ss(seg(t, 6, 13.5)) * .03) };
  const o = { t, cam, grey: 0, ...tr };
  plate(P.shop, o); plate(P.jose, o);
  plate(P.arm, { ...o, M: about(S.JOSE_A.shoulder[0], S.JOSE_A.shoulder[1], planeAng(t)) });
  // a new shaving curls off the plane on every push
  const ph = (t / (BEAT * 2)) % 1, hx = S.JOSE_A.shoulder[0] + Math.cos(.5 + planeAng(t)) * 270;
  if (ph > .2 && ph < .62) for (let i = 0; i < 6; i++) { const a = i * .9 + ph * 4; dyn.push({ x: hx + 120 + Math.cos(a) * (14 - i), y: 640 + Math.sin(a) * (10 - i), ang: a + 1.6, len: 12, wid: 6, c: hex('#f6dcaa'), c2: hex('#d8a868'), type: 0, seed: 400 + i, hgt: 1 }); }
  flush({ ...o, appear: undefined, run: 0 });
}

// 2 · the dream: a grey night, then the angel's light re-lays the room in gold
function shotDream(t, tr) {
  const cam = { x: 1040 + ss(seg(t, T.dream, T.beth)) * 40, y: 640, zoom: lerp(1.0, 1.1, ss(seg(t, T.dream, T.beth))) };
  plate(P.dream, { t, cam, grey: 1, reveal: T.reveal, revDur: .3, revC: [S.DREAM_LIGHT[0], S.DREAM_LIGHT[1], 1100], ...tr });
  // the angel: no face, only light — rays and two wings laid feather by feather
  const a = ss(seg(t, T.reveal - .6, T.reveal + 1.2));
  if (a > 0) {
    const [lx, ly] = S.DREAM_LIGHT;
    for (let i = 0; i < 28; i++) { const an = Math.PI * .55 + (i / 27) * Math.PI * .9 + Math.sin(t * .8 + i) * .02, r = 120 + hash(i) * 380 * a; dyn.push({ x: lx + Math.cos(an) * r * .6, y: ly + Math.sin(an) * r * .6, ang: an, len: r * .9, wid: 10 + hash(i * 3) * 10, c: hex('#ffe9a8'), c2: hex('#f2b850'), type: 0, alpha: .55 * a, seed: 500 + i, hgt: .6 }); }
    for (const side of [-1, 1]) for (let i = 0; i < 14; i++) {
      const u = i / 13, k = clamp(a * 1.6 - u * .6);
      if (k <= 0) continue;
      const an = -Math.PI / 2 + side * (.35 + u * 1.1), r = 70 + u * 230;
      dyn.push({ x: lx + Math.cos(an) * r, y: ly + 40 + Math.sin(an) * r * .55 + u * u * 120, ang: an + side * .9, len: 120 - u * 50, wid: 26 - u * 10, c: hex('#fff3cc'), c2: hex('#f0c060'), type: 0, alpha: k, seed: 600 + i + (side > 0 ? 50 : 0), hgt: 1 });
    }
    dyn.push({ x: lx, y: ly + 30, ang: 0, len: 90 * a, wid: 120 * a, c: hex('#fffbe8'), type: 2, alpha: a, seed: 700, hgt: .5 });
    flush({ t, cam, grey: 0, run: .2 });
  }
}

// 3 · Belém: from the star down to the manger
function shotBeth(t, tr) {
  const k = ss(seg(t, T.beth + .3, T.jesus - .2));
  const cam = { x: lerp(1056, 1080, k), y: lerp(560, 1590, k), zoom: lerp(1.0, 1.04, k) };
  const o = { t, cam, grey: 0, ...tr };
  plate(P.beth, o);
  // the star breathes; its long ray points down to the stable
  const [sx, sy] = S.STAR, tw = 1 + Math.sin(t * 3.1) * .08;
  for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2, L = (i % 3 === 0 ? 150 : 70) * tw * (an > 1.2 && an < 1.9 ? 1.7 : 1); dyn.push({ x: sx + Math.cos(an) * L * .5, y: sy + Math.sin(an) * L * .5, ang: an, len: L, wid: i % 3 === 0 ? 14 : 8, c: hex('#fff6d6'), c2: hex('#f2c766'), type: 0, alpha: .95, seed: 800 + i, hgt: .8 }); }
  dyn.push({ x: sx, y: sy, ang: 0, len: 46, wid: 46, c: hex('#fffdf0'), type: 2, seed: 820, hgt: 1 });
  // "Jesus": the Child's halo flares
  const g = Math.exp(-Math.max(0, t - T.jesus) * 1.6) * ss(seg(t, T.jesus - .3, T.jesus));
  if (g > .01) { const [mx, my] = S.MANGER; for (let i = 0; i < 16; i++) { const an = i / 16 * Math.PI * 2; dyn.push({ x: mx - 40 + Math.cos(an) * 70, y: my - 4 + Math.sin(an) * 70, ang: an, len: 60 * g + 10, wid: 10, c: hex('#fff0b8'), type: 0, alpha: .8 * g, seed: 840 + i, hgt: .6 }); } }
  flush({ ...o, appear: undefined, run: 0 });
}

// 4 · the flight into Egypt: the camera trucks with them; their steps paint a trail in the sand
function shotFlight(t, tr) {
  const u = seg(t, T.flight - .3, T.home + .3), gx = lerp(250, 1900, u);
  const half = W / 2 / .96, camx = clamp(gx + 600, half, S.DW - half);
  const cam = { x: camx, y: 650, zoom: .96 };
  const o = { t, cam, grey: 0, ...tr };
  plate(P.desert, o);
  // trail of footprints and hoof prints behind them
  const groundY = 958;
  for (let x = 260; x < gx + 480; x += 34) { const i = Math.round(x / 34); dyn.push({ x: x + 330 + (i % 2) * 14, y: groundY + 6 + (i % 2) * 10, ang: 0, len: 22, wid: 9, c: hex('#7a4a2c'), c2: hex('#5a3420'), type: 2, alpha: .55 * clamp(1 - (gx + 480 - x) / 2200), seed: 900 + i, hgt: .5 }); }
  flush({ ...o, appear: undefined });
  // walking cycle
  const step = (t - T.flight) * 2.1 * Math.PI, bob = Math.abs(Math.sin(step)) * -6;
  const M = TR(gx, groundY - S.FLIGHT.groundY + bob);
  const leg = (x, y0, y1, ph, col, wid) => { const sw = Math.sin(step + ph) * .32, L = y1 - y0; dyn.push({ x: x + Math.sin(sw) * L * .5, y: y0 + L * .5, ang: Math.PI / 2 - sw, len: L, wid, c: hex(col), c2: shade(hex(col), .8), type: 0, seed: 950 + ph * 10, hgt: 1 }); };
  [[300, 0], [340, Math.PI], [500, Math.PI], [540, 0]].forEach(([x, ph]) => leg(x, 600, 770, ph, '#6a5e58', 22));
  leg(870, 630, 770, 0, '#4a3020', 26); leg(905, 630, 770, Math.PI, '#4a3020', 26);
  flush({ t, cam, grey: 0, M, run: 0 });
  plate(P.flight, { ...o, M });
}

// 5 · Nazaré again: the same bench, now father and son
function shotHome(t, tr) {
  const k = ss(seg(t, T.home, T.matriz + .5));
  const cam = { x: lerp(1060, 1080, k), y: lerp(600, 620, k), zoom: lerp(1.0, 1.16, k) };
  const o = { t, cam, grey: 0, ...tr };
  plate(P.shop, o); plate(P.family, o);
  const ph = (t / (BEAT * 2)) % 1;
  if (ph > .25 && ph < .6) for (let i = 0; i < 5; i++) { const a = i * .9 + ph * 4; dyn.push({ x: 1140 + Math.cos(a) * (12 - i), y: 668 + Math.sin(a) * (9 - i), ang: a + 1.6, len: 11, wid: 5, c: hex('#f6dcaa'), type: 0, seed: 1000 + i, hgt: 1 }); }
  flush({ ...o, appear: undefined, run: 0 });
}

// 6 · Recife: crane up the façade of the Matriz at sunset
function shotMatriz(t, tr) {
  const k = ss(seg(t, T.matriz, T.card - .2));
  const zoom = lerp(1.2, .93, k), cam = { x: 1056, y: lerp(1240, 600, k), zoom };
  plate(P.matriz, { t, cam, grey: 0, ...tr });
  // the bells ring: two warm flashes in the towers on the downbeats of the last line
  for (const [bx, t0] of [[630, 56.55], [1482, 57.4]]) { const g = Math.exp(-Math.max(0, t - t0) * 1.2) * (t > t0 ? 1 : 0); if (g > .02) { for (let i = 0; i < 10; i++) { const an = i / 10 * Math.PI * 2; dyn.push({ x: bx + Math.cos(an) * 60, y: 460 + Math.sin(an) * 40, ang: an, len: 40 * g + 8, wid: 7, c: hex('#ffe2a0'), type: 0, alpha: .7 * g, seed: 1100 + i + bx, hgt: .5 }); } } }
  flush({ t, cam, grey: 0 });
}

// 7 · end card
function shotCard(t, tr) { plate(P.card, { t, cam: { x: W / 2, y: H / 2, zoom: 1 }, grey: 0, ...tr }); }

const POST = {
  warm: { expo: 1.03, sat: 1.06, contrast: 1.04, vig: .3, spec: .22, shin: 24, light: [-.6, -.55, .7], lightCol: [1, .93, .82] },
  night: { expo: .78, sat: 1, contrast: 1.06, vig: .45, spec: .26, shin: 24, lift: [.0, .01, .04], light: [.5, -.6, .7] },
  card: { expo: 1.0, sat: 1.04, contrast: 1.05, vig: .35, spec: .3, shin: 26, light: [-.7, -.5, .6] },
};
const EDIT = [
  [T.shop, shotShop, 0, 'warm'], [T.dream, shotDream, .6, 'night'], [T.beth, shotBeth, .55, 'warm'], [T.flight, shotFlight, .55, 'warm'],
  [T.home, shotHome, .55, 'warm'], [T.matriz, shotMatriz, .7, 'warm'], [T.card, shotCard, 1.1, 'card'],
];
function frame(t) {
  let i = 0; while (i < EDIT.length - 1 && t >= EDIT[i + 1][0]) i++;
  E.begin();
  const [t0, fn, d, look] = EDIT[i];
  const post = { ...POST[look] };
  if (d > 0 && t < t0 + d && i > 0) { EDIT[i - 1][1](t, {}); fn(t, { appear: t0, appDur: d }); }
  else fn(t, {});
  if (fn === shotDream) { const k = ss(seg(t, T.reveal - .2, T.reveal + 1.4)); post.expo = lerp(.78, 1.04, k); post.lift = [0, lerp(.01, 0, k), lerp(.04, 0, k)]; post.light = [lerp(.5, .6, k), -.6, .7]; post.norm = lerp(3.2, 5.5, Math.sin(Math.PI * k)); }
  if (fn === shotCard) { const k = seg(t, T.card + .4, T.card + 2.6); post.light = [lerp(-.95, -.6, ss(k)), lerp(-.15, -.5, ss(k)), lerp(.22, .6, ss(k))]; post.norm = lerp(7, 3.4, ss(k)); }
  E.finish(post);
  // subtitles
  const c = CUES.find(c => t >= c.t0 && t < c.t1);
  if (c) { sub.textContent = c.text; sub.style.opacity = String(Math.min(ss(seg(t, c.t0 - .05, c.t0 + .2)), 1 - ss(seg(t, c.t1 - .25, c.t1)))); } else sub.style.opacity = '0';
  window.__shade.style.opacity = t > T.card ? '0' : '1';
  card.style.opacity = String(ss(seg(t, T.card + 1.4, T.card + 2.2)));
}

// sound events for the mixer
function events() {
  const ev = [];
  LINES.forEach(([id, t, d]) => ev.push({ t, type: 'voice', id, d }));
  EDIT.slice(1).forEach(([t, , d]) => ev.push({ t, type: 'scrape', d }));
  for (let t = 0; t < T.dream; t += BEAT * 2) ev.push({ t, type: 'plane' });
  for (let t = T.home + .5; t < T.matriz; t += BEAT * 2) ev.push({ t, type: 'plane', soft: 1 });
  ev.push({ t: T.reveal, type: 'light' }, { t: T.jesus, type: 'chime' });
  for (let t = T.flight; t < T.home; t += 1 / 2.1 / 2) ev.push({ t, type: 'hoof' });
  ev.push({ t: 56.55, type: 'bell', p: 0 }, { t: 57.4, type: 'bell', p: 1 }, { t: T.card + .1, type: 'bell', p: 2 });
  return ev.sort((a, b) => a.t - b.t);
}
