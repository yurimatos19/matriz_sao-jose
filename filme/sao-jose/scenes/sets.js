// "São José" — painted sets. Each set is a flat, value-planned reference illustration
// (Ref.fill / Ref.line) turned into palette-knife strokes by paintRef().
import { Ref, paintRef, rnd } from '../engine/plate.js';
import { KNIFE, BRUSH, DAB } from '../engine/impasto.js';
import { P, E, RR, lin, rad, hash } from './common.js';

export const WW = 2112, WH = 1188;
const SKIN = '#b97a52', SKIN_L = '#d39a6c', HAIR = '#3a2418', BEARD = '#4a2e1e';
const TUNIC = '#5f7a52', TUNIC_D = '#46603e', MANTLE = '#9a6232', MANTLE_D = '#73461f';
const MARY_BLUE = '#2f5aa8', MARY_BLUE_D = '#22427e', VEIL = '#efe6d2', ROSE = '#b0545a';
const GOLD = '#f2c766';

// a soft gold halo disc behind a head
function halo(R, x, y, r, g) {
  R.fill(E(x, y, r, r), rad(x, y, r * .2, r, [[0, '#fbe3a0'], [.75, '#f0c460'], [1, '#d9a23e']]), { dir: { radial: [x, y], off: 90 }, maxR: 7, group: g });
}
// head in profile facing +f (f = 1 right, -1 left). beard optional.
function headProfile(R, x, y, s, f, o = {}) {
  const g = o.g || 'h';
  if (o.halo) halo(R, x - f * 6 * s, y - 4 * s, 62 * s, g + 'halo');
  R.fill(c => { c.ellipse(x, y, 40 * s, 50 * s, 0, 0, 7); }, o.skin || SKIN, { maxR: 5, group: g + 'face', dir: 90 });
  // nose
  R.fill(P([[x + f * 34 * s, y - 14 * s], [x + f * 50 * s, y + 6 * s], [x + f * 34 * s, y + 10 * s]]), o.skin || SKIN, { maxR: 3, group: g + 'face' });
  // lit cheek
  R.tint(E(x + f * 12 * s, y - 6 * s, 18 * s, 24 * s), SKIN_L);
  // hair: covers back and top of the head
  R.fill(c => { c.moveTo(x + f * 30 * s, y - 34 * s); c.quadraticCurveTo(x, y - 66 * s, x - f * 38 * s, y - 30 * s); c.quadraticCurveTo(x - f * 52 * s, y + 10 * s, x - f * 30 * s, y + 46 * s); c.lineTo(x - f * 8 * s, y + 20 * s); c.quadraticCurveTo(x - f * 4 * s, y - 20 * s, x + f * 30 * s, y - 34 * s); }, o.hair || HAIR, { maxR: 5, group: g + 'hair', dir: 80 });
  if (o.beard) R.fill(c => { c.moveTo(x - f * 10 * s, y + 8 * s); c.quadraticCurveTo(x + f * 10 * s, y + 18 * s, x + f * 38 * s, y + 18 * s); c.quadraticCurveTo(x + f * 30 * s, y + 66 * s, x - f * 2 * s, y + 70 * s); c.quadraticCurveTo(x - f * 24 * s, y + 48 * s, x - f * 10 * s, y + 8 * s); }, BEARD, { maxR: 4, group: g + 'beard', dir: 90 });
  if (o.veil) R.fill(c => { c.moveTo(x + f * 26 * s, y - 44 * s); c.quadraticCurveTo(x - f * 10 * s, y - 72 * s, x - f * 46 * s, y - 24 * s); c.quadraticCurveTo(x - f * 70 * s, y + 60 * s, x - f * 60 * s, y + 140 * s); c.lineTo(x - f * 14 * s, y + 120 * s); c.quadraticCurveTo(x - f * 4 * s, y + 10 * s, x + f * 26 * s, y - 44 * s); }, o.veil, { maxR: 6, group: g + 'veil', dir: 90 });
  // eye
  R.fill(E(x + f * 20 * s, y - 8 * s, 4 * s, 3 * s), '#2a1810', { maxR: 2, group: g + 'eye' });
  R.fill(c => { c.moveTo(x + f * 10 * s, y - 18 * s); c.lineTo(x + f * 30 * s, y - 20 * s); c.lineTo(x + f * 30 * s, y - 16 * s); c.lineTo(x + f * 10 * s, y - 14 * s); c.closePath(); }, '#3a2418', { maxR: 2, group: g + 'brow' });
}

// ===================== NAZARÉ · OFICINA =====================
// profile view; José (or José + the boy) at the bench. Light from the window on the left.
export const BENCH = { x0: 760, x1: 1720, y: 700 };
export const SHAV = [980, 668];                 // where the opening macro starts (shavings on the plank)
export function drawWorkshop(R) {
  // back wall: warm plaster, light near the window
  R.fill(P([[0, 0], [WW, 0], [WW, 860], [0, 860]]), lin(0, 0, WW, 0, [[0, '#d8ac72'], [.35, '#c4925c'], [.75, '#93623e'], [1, '#6a4430']]), { dir: 82, fallback: 82, group: 'wall', maxR: 40, detail: 1.8, jit: .08 });
  // stone footing of the wall
  R.fill(P([[0, 790], [WW, 790], [WW, 870], [0, 870]]), lin(0, 0, WW, 0, [[0, '#9a7a5e'], [1, '#5a4030']]), { dir: 0, group: 'foot', maxR: 16 });
  // window: bright late-afternoon sky in a deep wooden frame
  R.fill(P([[150, 170], [540, 170], [540, 580], [150, 580]]), '#4a2c18', { dir: 90, group: 'wframe', maxR: 10 });
  R.fill(P([[180, 200], [510, 200], [510, 550], [180, 550]]), lin(0, 200, 0, 550, [[0, '#f8e2a8'], [.6, '#f3c47c'], [1, '#e8a05a']]), { dir: -10, group: 'sky', maxR: 22 });
  R.fill(P([[180, 470], [260, 420], [360, 450], [450, 400], [510, 430], [510, 550], [180, 550]]), '#8a7a5a', { dir: 0, group: 'hills', maxR: 10 });
  R.fill(P([[338, 200], [352, 200], [352, 550], [338, 550]]), '#4a2c18', { dir: 90, group: 'wframe', maxR: 4 });
  R.fill(P([[180, 368], [510, 368], [510, 382], [180, 382]]), '#4a2c18', { dir: 0, group: 'wframe', maxR: 4 });
  // shaft of light falling across the wall and the bench
  R.tint(P([[510, 200], [540, 580], [1500, 980], [1180, 980], [520, 560]]), 'rgba(255,214,150,.28)');
  // shelf with jars, hanging tools
  R.fill(P([[1460, 300], [1980, 300], [1980, 322], [1460, 322]]), '#5a3620', { dir: 0, group: 'shelf', maxR: 6 });
  [[1510, 230, 36, 70, '#a8603a'], [1590, 250, 30, 50, '#c88a50'], [1680, 220, 42, 80, '#8a4a2c'], [1780, 245, 32, 55, '#b8783e'], [1880, 235, 38, 65, '#9a5a34']].forEach(([x, y, w, h, c], i) => {
    R.fill(c2 => { c2.moveTo(x - w * .5, y + h); c2.quadraticCurveTo(x - w, y + h * .45, x - w * .35, y + 6); c2.lineTo(x + w * .35, y + 6); c2.quadraticCurveTo(x + w, y + h * .45, x + w * .5, y + h); c2.closePath(); }, lin(x - w, 0, x + w, 0, [[0, c], [1, '#4a2a18']]), { dir: 90, group: 'jar' + i, maxR: 7 });
  });
  // saw
  R.fill(P([[1180, 360], [1420, 330], [1420, 372], [1180, 392]]), lin(0, 330, 0, 392, [[0, '#cfc6b4'], [1, '#8a8478']]), { dir: -7, group: 'saw', maxR: 6 });
  R.fill(RR(1120, 340, 70, 64, 18), '#6a3e20', { dir: 90, group: 'sawh', maxR: 6 });
  // hammer + square
  R.fill(P([[1490, 420], [1504, 420], [1504, 560], [1490, 560]]), '#7a4a26', { dir: 90, group: 'ham', maxR: 4 });
  R.fill(RR(1458, 404, 78, 30, 6), '#5c5650', { dir: 0, group: 'hamh', maxR: 5 });
  R.fill(P([[1600, 420], [1618, 420], [1618, 590], [1700, 590], [1700, 606], [1600, 606]]), '#b8a070', { dir: 90, group: 'sq', maxR: 4 });
  // floor: beaten earth
  R.fill(P([[0, 860], [WW, 860], [WW, WH], [0, WH]]), lin(0, 860, 0, WH, [[0, '#6e4a30'], [1, '#3c281a']]), { dir: 0, fallback: 0, group: 'floor', maxR: 30, jit: .1 });
  R.tint(P([[700, 860], [1300, 860], [1700, WH], [900, WH]]), 'rgba(255,200,140,.18)');
  // workbench: thick top, front apron, two legs
  const { x0, x1, y } = BENCH;
  R.fill(P([[x0 + 60, y + 60], [x0 + 110, y + 60], [x0 + 100, 980], [x0 + 70, 980]]), '#4a2c18', { dir: 90, group: 'leg1', maxR: 8 });
  R.fill(P([[x1 - 110, y + 60], [x1 - 60, y + 60], [x1 - 70, 980], [x1 - 100, 980]]), '#4a2c18', { dir: 90, group: 'leg2', maxR: 8 });
  R.fill(P([[x0, y], [x1, y], [x1, y + 70], [x0, y + 70]]), lin(0, y, 0, y + 70, [[0, '#a8683a'], [1, '#6a3e22']]), { dir: 0, group: 'apron', maxR: 10 });
  R.fill(P([[x0 - 10, y - 18], [x1 + 10, y - 18], [x1 + 10, y + 4], [x0 - 10, y + 4]]), '#c4874c', { dir: 0, group: 'top', maxR: 6 });
  // the plank being worked: pale fresh wood with grain
  R.fill(P([[x0 + 120, y - 46], [x1 - 140, y - 46], [x1 - 140, y - 18], [x0 + 120, y - 18]]), lin(x0, 0, x1, 0, [[0, '#f0cf98'], [.6, '#e2b47a'], [1, '#c8955e']]), { dir: 0, group: 'plank', maxR: 5, aj: .15 });
  // shavings: pale curls on the plank and on the floor
  const curl = (x, y, r, k, g) => R.line(c => { for (let a = 0; a <= Math.PI * 1.7; a += .2) { const rr = r * (1 - a / 7); const px = x + Math.cos(a + k) * rr, py = y + Math.sin(a + k) * rr * .8; a ? c.lineTo(px, py) : c.moveTo(px, py); } }, lin(x - r, y - r, x + r, y + r, [[0, '#fbe6bc'], [1, '#d8a868']]), Math.max(4, r * .35), { dir: 'edge', group: g, maxR: 4 });
  [[960, 664, 16, 0], [1000, 670, 12, 2], [1030, 662, 18, 4], [940, 676, 10, 1]].forEach((p, i) => curl(p[0], p[1], p[2], p[3], 'cur' + i));
  // a low pile of shavings under the bench (soft dabs, not curls: curls on the floor read as letters)
  for (let i = 0; i < 18; i++) R.fill(E(980 + hash(i) * 520, 975 + hash(i * 3.1) * 40, 26 + hash(i * 7) * 30, 8 + hash(i * 5) * 6, (hash(i) - .5) * .4), hash(i * 2) > .5 ? '#e8c890' : '#c89a62', { dir: 0, group: 'pile' + i, maxR: 5 });
}

// José at the bench, alone, planing. Body and the working arm are separate so the arm can move.
export const JOSE_A = { x: 700, y: 900, shoulder: [742, 452] };
export function drawJoseBody(R) {
  const x = JOSE_A.x, y = JOSE_A.y;
  // feet
  R.fill(E(x - 30, y, 46, 14), '#3a2414', { group: 'jfeet', maxR: 4 });
  R.fill(E(x + 50, y + 4, 46, 14), '#3a2414', { group: 'jfeet', maxR: 4 });
  // tunic (leaning slightly forward)
  R.fill(c => { c.moveTo(x - 20, 430); c.lineTo(x + 80, 440); c.quadraticCurveTo(x + 120, 640, x + 108, y - 10); c.lineTo(x - 76, y - 10); c.quadraticCurveTo(x - 70, 640, x - 20, 430); c.closePath(); }, lin(x - 80, 0, x + 120, 0, [[0, TUNIC_D], [.6, TUNIC], [1, '#7a9468']]), { dir: 90, group: 'jtunic', maxR: 10 });
  // mantle over the back
  R.fill(c => { c.moveTo(x + 30, 420); c.quadraticCurveTo(x - 60, 420, x - 76, 520); c.quadraticCurveTo(x - 100, 700, x - 90, 840); c.lineTo(x - 10, 820); c.quadraticCurveTo(x - 4, 620, x + 50, 470); c.closePath(); }, lin(x - 100, 0, x + 50, 0, [[0, MANTLE_D], [1, MANTLE]]), { dir: 95, group: 'jmantle', maxR: 10 });
  // belt
  R.fill(P([[x - 70, 610], [x + 104, 604], [x + 108, 628], [x - 72, 634]]), '#5a3418', { dir: 0, group: 'jbelt', maxR: 4 });
  headProfile(R, x + 50, 368, 1.12, 1, { beard: true, halo: true, g: 'jA' });
}
export function drawJoseArm(R) {
  const [sx, sy] = JOSE_A.shoulder, hx = 935, hy = 640;
  // sleeve from shoulder to wrist
  R.fill(c => { c.moveTo(sx - 26, sy - 10); c.lineTo(sx + 30, sy - 22); c.quadraticCurveTo(hx - 60, hy - 120, hx - 6, hy - 22); c.lineTo(hx - 34, hy + 18); c.quadraticCurveTo(sx + 40, sy + 120, sx - 26, sy - 10); c.closePath(); }, lin(sx, sy, hx, hy, [[0, TUNIC], [1, '#86a070']]), { dir: { fn: () => Math.atan2(hy - sy, hx - sx) }, group: 'jsleeve', maxR: 8 });
  R.fill(E(hx + 6, hy + 2, 26, 20, -.3), SKIN, { group: 'jhand', maxR: 4 });
  // the plane: a wooden block with a handle
  R.fill(RR(hx - 10, hy + 6, 120, 34, 6), lin(0, hy, 0, hy + 40, [[0, '#a86a38'], [1, '#6a3e1e']]), { dir: 0, group: 'plane', maxR: 5 });
  R.fill(E(hx + 20, hy + 2, 18, 16), '#7a4824', { group: 'pknob', maxR: 3 });
}

// José and the boy Jesus at the same bench: the boy planes, José guides from behind.
export function drawFamilyBench(R) {
  // boy (smaller), at the bench, profile facing right, arms forward to the plane
  const bx = 900, by = 900;
  R.fill(E(bx - 16, by, 30, 10), '#3a2414', { group: 'bfeet', maxR: 3 });
  R.fill(E(bx + 34, by + 3, 30, 10), '#3a2414', { group: 'bfeet', maxR: 3 });
  R.fill(c => { c.moveTo(bx - 10, 590); c.lineTo(bx + 60, 596); c.quadraticCurveTo(bx + 86, 740, bx + 78, by - 8); c.lineTo(bx - 52, by - 8); c.quadraticCurveTo(bx - 50, 740, bx - 10, 590); c.closePath(); }, lin(bx - 50, 0, bx + 86, 0, [[0, '#d8ccb4'], [1, '#f4ecdc']]), { dir: 90, group: 'btunic', maxR: 8 });
  R.fill(P([[bx - 50, 720], [bx + 80, 716], [bx + 82, 734], [bx - 52, 738]]), ROSE, { dir: 0, group: 'bbelt', maxR: 3 });
  // boy's arm to the plane
  R.fill(c => { c.moveTo(bx + 20, 604); c.lineTo(bx + 58, 600); c.quadraticCurveTo(bx + 100, 640, bx + 132, 660); c.lineTo(bx + 116, 684); c.quadraticCurveTo(bx + 60, 664, bx + 20, 604); c.closePath(); }, '#ece2cc', { dir: 30, group: 'barm', maxR: 5 });
  R.fill(E(bx + 132, 670, 17, 14), SKIN_L, { group: 'bhand', maxR: 3 });
  R.fill(RR(bx + 116, 676, 110, 30, 6), lin(0, 676, 0, 706, [[0, '#a86a38'], [1, '#6a3e1e']]), { dir: 0, group: 'bplane', maxR: 4 });
  headProfile(R, bx + 34, 535, .82, 1, { halo: true, g: 'bJ', skin: SKIN_L, hair: '#5a3420' });
  // José behind the boy, leaning in, one hand on the boy's shoulder, the other pointing at the plank
  const x = 1250, y = 905;
  R.fill(E(x - 40, y, 46, 14), '#3a2414', { group: 'j2feet', maxR: 4 });
  R.fill(E(x + 40, y + 4, 46, 14), '#3a2414', { group: 'j2feet', maxR: 4 });
  R.fill(c => { c.moveTo(x - 60, 440); c.lineTo(x + 40, 430); c.quadraticCurveTo(x + 90, 640, x + 84, y - 10); c.lineTo(x - 104, y - 10); c.quadraticCurveTo(x - 120, 640, x - 60, 440); c.closePath(); }, lin(x - 110, 0, x + 90, 0, [[0, '#7a9468'], [.5, TUNIC], [1, TUNIC_D]]), { dir: 90, group: 'j2tunic', maxR: 10 });
  R.fill(c => { c.moveTo(x - 20, 420); c.quadraticCurveTo(x + 70, 420, x + 86, 520); c.quadraticCurveTo(x + 110, 700, x + 100, 850); c.lineTo(x + 20, 830); c.quadraticCurveTo(x + 14, 620, x - 40, 470); c.closePath(); }, lin(x - 40, 0, x + 110, 0, [[0, MANTLE], [1, MANTLE_D]]), { dir: 85, group: 'j2mantle', maxR: 10 });
  R.fill(P([[x - 104, 612], [x + 84, 606], [x + 86, 630], [x - 106, 636]]), '#5a3418', { dir: 0, group: 'j2belt', maxR: 4 });
  // arm reaching to the boy's shoulder
  R.fill(c => { c.moveTo(x - 50, 470); c.lineTo(x - 10, 456); c.quadraticCurveTo(x - 150, 520, x - 290, 580); c.lineTo(x - 300, 612); c.quadraticCurveTo(x - 170, 560, x - 50, 470); c.closePath(); }, '#6e8a5c', { dir: -20, group: 'j2arm', maxR: 7 });
  R.fill(E(bx + 62, 596, 22, 18), SKIN, { group: 'j2hand', maxR: 3 });
  headProfile(R, x - 60, 372, 1.12, -1, { beard: true, halo: true, g: 'jB' });
}

// ===================== O SONHO =====================
// Night. José asleep on a mat; the colour plate is the room lit by the angel's gold light.
export const DREAM_LIGHT = [1700, 260];
export function drawDream(R) {
  R.fill(P([[0, 0], [WW, 0], [WW, 800], [0, 800]]), rad(DREAM_LIGHT[0], DREAM_LIGHT[1], 60, 1700, [[0, '#f4d48a'], [.25, '#c89458'], [.6, '#6a4a5a'], [1, '#2a2440']]), { dir: 84, fallback: 84, group: 'wall', maxR: 40, detail: 1.7 });
  // small window with the night sky
  R.fill(P([[300, 180], [560, 180], [560, 420], [300, 420]]), '#2a1c14', { dir: 90, group: 'wf', maxR: 8 });
  R.fill(P([[322, 202], [538, 202], [538, 398], [322, 398]]), lin(0, 202, 0, 398, [[0, '#14204a'], [1, '#2c3a6e']]), { dir: 0, group: 'nsky', maxR: 12 });
  R.fill(E(470, 260, 26, 26), '#f2ecd2', { group: 'moon', maxR: 4 });
  [[360, 240], [400, 330], [510, 350], [430, 230]].forEach(([x, y], i) => R.fill(E(x, y, 4, 4), '#fff6d8', { group: 'st' + i, maxR: 2 }));
  // floor
  R.fill(P([[0, 800], [WW, 800], [WW, WH], [0, WH]]), lin(0, 800, 0, WH, [[0, '#6a4a3a'], [1, '#2c2026']]), { dir: 0, fallback: 0, group: 'floor', maxR: 30 });
  R.tint(E(1500, 900, 700, 160), 'rgba(255,214,140,.35)');
  // the mat
  R.fill(P([[420, 900], [1660, 880], [1700, 960], [380, 990]]), lin(0, 880, 0, 990, [[0, '#c8a070'], [1, '#8a6440']]), { dir: -2, group: 'mat', maxR: 10 });
  // pillow (rolled cloth)
  R.fill(E(560, 880, 110, 40, -.05), '#e6d6b4', { dir: 0, group: 'pillow', maxR: 6 });
  // the sleeper: mantle over the body, head on the pillow, face up toward the light
  R.fill(c => { c.moveTo(640, 870); c.quadraticCurveTo(820, 760, 1100, 800); c.quadraticCurveTo(1400, 800, 1600, 860); c.quadraticCurveTo(1640, 900, 1600, 930); c.lineTo(660, 940); c.closePath(); }, lin(640, 760, 1600, 940, [[0, '#b07a42'], [.5, MANTLE], [1, MANTLE_D]]), { dir: -4, group: 'cover', maxR: 10 });
  R.fill(c => { c.moveTo(980, 790); c.quadraticCurveTo(1060, 770, 1140, 800); c.lineTo(1120, 830); c.quadraticCurveTo(1060, 806, 990, 820); c.closePath(); }, '#5f7a52', { dir: 0, group: 'arm', maxR: 5 });
  R.fill(E(1150, 812, 22, 16), SKIN, { group: 'hand', maxR: 3 });
  // head lying: face up, beard toward the light (profile, rotated)
  R.fill(E(600, 836, 50, 40, -.15), SKIN, { group: 'dface', maxR: 4, dir: 0 });
  R.tint(E(616, 822, 26, 16), SKIN_L);
  R.fill(c => { c.moveTo(560, 808); c.quadraticCurveTo(520, 840, 548, 876); c.lineTo(600, 872); c.quadraticCurveTo(570, 840, 600, 800); c.closePath(); }, HAIR, { group: 'dhair', maxR: 4 });
  R.fill(c => { c.moveTo(624, 862); c.quadraticCurveTo(680, 880, 700, 846); c.quadraticCurveTo(690, 812, 660, 826); c.quadraticCurveTo(640, 846, 624, 862); c.closePath(); }, BEARD, { group: 'dbeard', maxR: 3 });
  R.fill(c => { c.moveTo(608, 822); c.lineTo(632, 818); c.lineTo(632, 822); c.lineTo(608, 826); c.closePath(); }, '#2a1810', { group: 'deye', maxR: 2 });
  // an unlit oil lamp
  R.fill(E(260, 940, 46, 16), '#8a5a34', { group: 'lamp', maxR: 4 });
  R.fill(P([[300, 934], [340, 920], [330, 940]]), '#8a5a34', { group: 'lamp', maxR: 3 });
}

// ===================== BELÉM =====================
// a tall plate: the star at the top, the manger at the bottom (the camera tilts down).
export const BW = 2112, BH = 2100;
export const MANGER = [1060, 1700];
export function drawBethlehem(R) {
  R.fill(P([[0, 0], [BW, 0], [BW, 1200], [0, 1200]]), lin(0, 0, 0, 1200, [[0, '#0c1230'], [.5, '#1a2656'], [1, '#2c3a6a']]), { dir: -4, fallback: -4, group: 'sky', maxR: 44, detail: 2.2 });
  for (let i = 0; i < 40; i++) { const x = hash(i * 1.7) * BW, y = hash(i * 3.3) * 1000; R.fill(E(x, y, 3 + hash(i) * 3, 3 + hash(i) * 3), '#fff4d0', { group: 'st' + i, maxR: 2 }); }
  // hills of Bethlehem with small houses
  R.fill(P([[0, 1050], [300, 960], [620, 1010], [900, 940], [1250, 1000], [1600, 930], [1900, 990], [BW, 960], [BW, 1250], [0, 1250]]), '#24305a', { dir: 0, group: 'hill', maxR: 20 });
  [[220, 980], [330, 970], [1500, 950], [1640, 945], [1780, 970]].forEach(([x, y], i) => { R.fill(P([[x, y], [x + 70, y], [x + 70, y + 50], [x, y + 50]]), '#3a3e66', { group: 'hs' + i, maxR: 5 }); R.fill(P([[x + 26, y + 18], [x + 40, y + 18], [x + 40, y + 34], [x + 26, y + 34]]), '#f2c870', { group: 'hw' + i, maxR: 2 }); });
  // the stable: rough beams and a thatched roof, warm lantern light inside
  R.fill(P([[260, 1180], [1860, 1180], [1860, BH], [260, BH]]), rad(1200, 1650, 60, 1100, [[0, '#d89a58'], [.45, '#8a5432'], [1, '#2e1e1c']]), { dir: 90, fallback: 90, group: 'inside', maxR: 34, detail: 1.6 });
  R.fill(P([[160, 1240], [1060, 1060], [1960, 1240], [1960, 1290], [1060, 1110], [160, 1290]]), lin(0, 1060, 0, 1290, [[0, '#b08a50'], [1, '#6a4a2a']]), { dir: 10, group: 'roof', maxR: 12 });
  R.fill(P([[250, 1270], [300, 1270], [300, BH], [250, BH]]), '#4a2c18', { dir: 90, group: 'post1', maxR: 8 });
  R.fill(P([[1820, 1270], [1870, 1270], [1870, BH], [1820, BH]]), '#4a2c18', { dir: 90, group: 'post2', maxR: 8 });
  // straw floor
  R.fill(P([[260, 1880], [1860, 1880], [1860, BH], [260, BH]]), lin(0, 1880, 0, BH, [[0, '#d8a858'], [1, '#8a6030']]), { dir: 0, group: 'straw', maxR: 12, aj: .9 });
  // manger with the Child
  const [mx, my] = MANGER;
  R.fill(P([[mx - 190, my + 30], [mx + 190, my + 30], [mx + 150, my + 170], [mx - 150, my + 170]]), lin(0, my, 0, my + 170, [[0, '#9a6236'], [1, '#5a3418']]), { dir: 0, group: 'manger', maxR: 8 });
  R.fill(P([[mx - 150, my + 160], [mx - 120, my + 160], [mx - 150, my + 240], [mx - 180, my + 240]]), '#4a2c18', { group: 'mlegs', maxR: 4 });
  R.fill(P([[mx + 120, my + 160], [mx + 150, my + 160], [mx + 180, my + 240], [mx + 150, my + 240]]), '#4a2c18', { group: 'mlegs', maxR: 4 });
  R.fill(c => { c.moveTo(mx - 200, my + 40); for (let k = 0; k <= 16; k++) c.lineTo(mx - 200 + k * 25, my + 20 - (k % 2) * 26); c.lineTo(mx + 200, my + 50); c.closePath(); }, '#e8c070', { dir: -60, group: 'hay', maxR: 4, aj: 1.2 });
  halo(R, mx - 40, my - 4, 54, 'chalo');
  R.fill(E(mx + 10, my + 6, 92, 34), lin(0, my - 30, 0, my + 40, [[0, '#fbf6ea'], [1, '#d8ccb4']]), { dir: 0, group: 'swaddle', maxR: 5 });
  R.fill(E(mx - 64, my - 6, 30, 28), SKIN_L, { group: 'cface', maxR: 3 });
  // Mary kneeling on the left, blue mantle, white veil, facing right
  const qx = 640, qy = 1880;
  R.fill(c => { c.moveTo(qx - 90, qy); c.quadraticCurveTo(qx - 140, qy - 200, qx - 40, qy - 330); c.lineTo(qx + 60, qy - 330); c.quadraticCurveTo(qx + 170, qy - 120, qx + 190, qy); c.closePath(); }, lin(qx - 140, 0, qx + 190, 0, [[0, MARY_BLUE_D], [.6, MARY_BLUE], [1, '#4a78c4']]), { dir: 90, group: 'mmantle', maxR: 10 });
  R.fill(c => { c.moveTo(qx + 40, qy - 300); c.quadraticCurveTo(qx + 150, qy - 250, qx + 200, qy - 220); c.lineTo(qx + 186, qy - 196); c.quadraticCurveTo(qx + 120, qy - 220, qx + 40, qy - 250); c.closePath(); }, ROSE, { dir: 20, group: 'marm', maxR: 5 });
  R.fill(E(qx + 204, qy - 206, 18, 14), SKIN_L, { group: 'mhand', maxR: 3 });
  headProfile(R, qx + 30, qy - 380, 1.05, 1, { halo: true, veil: VEIL, g: 'mary', skin: SKIN_L });
  // José standing on the right, staff in one hand, lantern raised in the other, facing left
  const jx = 1480, jy = 1900;
  R.fill(P([[jx + 120, 1300], [jx + 136, 1300], [jx + 140, jy + 10], [jx + 124, jy + 10]]), '#6a4424', { dir: 90, group: 'staff', maxR: 4 });
  R.fill(c => { c.moveTo(jx - 50, 1530); c.lineTo(jx + 60, 1520); c.quadraticCurveTo(jx + 110, 1720, jx + 100, jy); c.lineTo(jx - 100, jy); c.quadraticCurveTo(jx - 110, 1720, jx - 50, 1530); c.closePath(); }, lin(jx - 110, 0, jx + 110, 0, [[0, '#86a070'], [.5, TUNIC], [1, TUNIC_D]]), { dir: 90, group: 'jtun', maxR: 10 });
  R.fill(c => { c.moveTo(jx - 10, 1510); c.quadraticCurveTo(jx + 90, 1520, jx + 110, 1620); c.quadraticCurveTo(jx + 130, 1780, jx + 116, jy - 20); c.lineTo(jx + 30, jy - 30); c.quadraticCurveTo(jx + 20, 1700, jx - 20, 1560); c.closePath(); }, lin(jx, 0, jx + 130, 0, [[0, MANTLE], [1, MANTLE_D]]), { dir: 88, group: 'jman', maxR: 10 });
  R.fill(c => { c.moveTo(jx + 30, 1540); c.lineTo(jx + 70, 1540); c.quadraticCurveTo(jx + 110, 1500, jx + 120, 1440); c.lineTo(jx + 140, 1446); c.quadraticCurveTo(jx + 130, 1530, jx + 30, 1580); c.closePath(); }, TUNIC_D, { dir: -60, group: 'jarm', maxR: 5 });
  R.fill(E(jx + 128, 1430, 18, 16), SKIN, { group: 'jhand', maxR: 3 });
  // lantern hanging from the other hand, toward the manger
  R.fill(c => { c.moveTo(jx - 30, 1550); c.quadraticCurveTo(jx - 120, 1600, jx - 160, 1640); c.lineTo(jx - 146, 1662); c.quadraticCurveTo(jx - 90, 1630, jx - 20, 1590); c.closePath(); }, '#86a070', { dir: 30, group: 'jarm2', maxR: 5 });
  R.fill(E(jx - 160, 1660, 16, 14), SKIN, { group: 'jhand2', maxR: 3 });
  R.fill(RR(jx - 186, 1682, 52, 70, 10), rad(jx - 160, 1716, 4, 50, [[0, '#fff2c0'], [.6, '#f7c260'], [1, '#b06a28']]), { group: 'lantern', maxR: 4 });
  R.tint(E(jx - 160, 1716, 260, 220), rad(jx - 160, 1716, 10, 260, [[0, 'rgba(255,214,140,.45)'], [1, 'rgba(255,214,140,0)']]));
  headProfile(R, jx, 1460, 1.1, -1, { beard: true, halo: true, g: 'jBt' });
  // the ox and the donkey in the shadow, very simple
}
export const STAR = [1060, 330];

// ===================== A FUGA · DESERTO =====================
export const DW = 3400, DH = 1188, DHZ = 690;
export function drawDesert(R) {
  R.fill(P([[0, 0], [DW, 0], [DW, DHZ + 20], [0, DHZ + 20]]), lin(0, 0, 0, DHZ, [[0, '#2a2a5e'], [.38, '#6a4a7a'], [.7, '#d4785a'], [.9, '#f2a860'], [1, '#f8d090']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44, detail: 2.2, aj: .25 });
  for (let i = 0; i < 22; i++) { const x = hash(i * 2.3) * DW, y = hash(i * 5.1) * 260; R.fill(E(x, y, 3, 3), '#fff0d0', { group: 'st' + i, maxR: 2 }); }
  R.fill(E(2600, 640, 70, 70), '#fff0c0', { group: 'sun', maxR: 6 });
  // far pyramids in haze
  R.fill(P([[1900, DHZ], [2050, 560], [2200, DHZ]]), '#b07a76', { dir: 0, group: 'pyr1', maxR: 6 });
  R.fill(P([[2150, DHZ], [2250, 600], [2350, DHZ]]), '#a8707a', { dir: 0, group: 'pyr2', maxR: 5 });
  // dune bands: far violet → near sienna
  const dune = (pts, col, g, r) => R.fill(P(pts), col, { dir: 0, fallback: 0, group: g, maxR: r, aj: .25 });
  dune([[0, DHZ], [600, 660], [1300, 700], [2000, 670], [2800, 700], [DW, 670], [DW, 800], [0, 800]], '#9a6470', 'd1', 18);
  dune([[0, 780], [500, 740], [1200, 790], [1900, 730], [2600, 790], [DW, 750], [DW, 900], [0, 900]], '#c07a54', 'd2', 24);
  dune([[0, 900], [700, 850], [1500, 910], [2300, 860], [DW, 900], [DW, DH], [0, DH]], lin(0, 850, 0, DH, [[0, '#d89a5e'], [1, '#8a5232']]), 'd3', 34);
  // palms
  const palm = (x, y, h, g) => {
    R.fill(c => { c.moveTo(x - 10, y); c.quadraticCurveTo(x + 20, y - h * .5, x + 6, y - h); c.lineTo(x + 18, y - h); c.quadraticCurveTo(x + 34, y - h * .5, x + 8, y); c.closePath(); }, '#3a2420', { dir: 90, group: g, maxR: 5 });
    for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .5; R.line(c => { c.moveTo(x + 12, y - h); c.quadraticCurveTo(x + 12 + Math.cos(a) * 90, y - h + Math.sin(a) * 90 - 30, x + 12 + Math.cos(a) * 170, y - h + Math.sin(a) * 120 + 40); }, '#2a2a2a', 18, { dir: 'edge', group: g + 'f', maxR: 5 }); }
  };
  palm(2950, 860, 330, 'p1'); palm(3120, 900, 280, 'p2'); palm(300, 820, 240, 'p3');
}
// the travelling group, drawn facing right; legs are animated separately
export function drawFlight(R) {
  // donkey body
  const dx = 420, dy = 560;
  R.fill(E(dx, dy, 170, 80), lin(0, dy - 80, 0, dy + 80, [[0, '#9a8a7e'], [1, '#5e524c']]), { dir: 0, group: 'dbody', maxR: 10 });
  R.fill(c => { c.moveTo(dx + 140, dy - 30); c.quadraticCurveTo(dx + 210, dy - 130, dx + 250, dy - 150); c.lineTo(dx + 290, dy - 110); c.quadraticCurveTo(dx + 230, dy - 60, dx + 170, dy + 10); c.closePath(); }, '#8a7a70', { dir: -45, group: 'dneck', maxR: 7 });
  R.fill(E(dx + 290, dy - 120, 56, 30, .5), '#8a7a70', { group: 'dhead', maxR: 5 });
  R.fill(P([[dx + 250, dy - 160], [dx + 236, dy - 240], [dx + 266, dy - 162]]), '#6a5e58', { group: 'dear', maxR: 3 });
  R.fill(E(dx + 320, dy - 100, 14, 12), '#3a3230', { group: 'dnose', maxR: 2 });
  // saddle cloth
  R.fill(P([[dx - 90, dy - 70], [dx + 70, dy - 76], [dx + 80, dy + 30], [dx - 100, dy + 30]]), '#b0453e', { dir: 90, group: 'cloth', maxR: 6 });
  // Mary seated, holding the Child, blue mantle
  const mx = dx - 10, my = dy - 80;
  R.fill(c => { c.moveTo(mx - 80, my + 40); c.quadraticCurveTo(mx - 90, my - 120, mx - 20, my - 190); c.lineTo(mx + 50, my - 190); c.quadraticCurveTo(mx + 110, my - 80, mx + 110, my + 60); c.closePath(); }, lin(mx - 90, 0, mx + 110, 0, [[0, MARY_BLUE_D], [1, MARY_BLUE]]), { dir: 90, group: 'mm', maxR: 8 });
  R.fill(E(mx + 60, my - 110, 46, 30, -.3), '#f4ecdc', { group: 'baby', maxR: 4 });
  R.fill(E(mx + 84, my - 128, 18, 16), SKIN_L, { group: 'bface', maxR: 3 });
  headProfile(R, mx + 20, my - 230, .85, 1, { halo: true, veil: VEIL, g: 'fm', skin: SKIN_L });
  // José walking ahead, holding the rope and a staff
  const jx = dx + 470, jy = 760;
  R.fill(c => { c.moveTo(jx - 50, 380); c.lineTo(jx + 50, 384); c.quadraticCurveTo(jx + 84, 560, jx + 70, jy - 120); c.lineTo(jx - 80, jy - 120); c.quadraticCurveTo(jx - 84, 560, jx - 50, 380); c.closePath(); }, lin(jx - 80, 0, jx + 84, 0, [[0, TUNIC_D], [1, TUNIC]]), { dir: 90, group: 'jt', maxR: 8 });
  R.fill(c => { c.moveTo(jx + 10, 370); c.quadraticCurveTo(jx - 80, 380, jx - 96, 470); c.quadraticCurveTo(jx - 120, 560, jx - 110, 640); c.lineTo(jx - 40, 620); c.quadraticCurveTo(jx - 30, 500, jx + 30, 420); c.closePath(); }, lin(jx - 120, 0, jx + 30, 0, [[0, MANTLE_D], [1, MANTLE]]), { dir: 95, group: 'jm', maxR: 8 });
  // arm back holding the rope to the donkey's head
  R.fill(c => { c.moveTo(jx - 30, 410); c.lineTo(jx, 404); c.quadraticCurveTo(jx - 60, 480, jx - 120, 500); c.lineTo(jx - 126, 476); c.quadraticCurveTo(jx - 70, 460, jx - 30, 410); c.closePath(); }, TUNIC_D, { dir: 20, group: 'ja', maxR: 5 });
  R.fill(E(jx - 130, 492, 14, 12), SKIN, { group: 'jh', maxR: 3 });
  R.line(c => { c.moveTo(jx - 134, 494); c.quadraticCurveTo(jx - 200, 470, dx + 300, dy - 96); }, '#d8c49a', 5, { group: 'rope', maxR: 2 });
  // staff in the front hand
  R.fill(P([[jx + 80, 330], [jx + 94, 330], [jx + 120, jy], [jx + 106, jy]]), '#5a3a20', { dir: 90, group: 'staff', maxR: 3 });
  R.fill(E(jx + 86, 450, 14, 12), SKIN, { group: 'jh2', maxR: 3 });
  headProfile(R, jx + 6, 310, 1.0, 1, { beard: true, halo: true, g: 'fj' });
}
export const FLIGHT = { w: 1100, h: 820, hipJ: [890, 640], legsD: [[300, 600], [360, 600], [500, 600], [560, 600]], groundY: 770 };

// ===================== A MATRIZ · RECIFE =====================
// the parish church at sunset (two towers, rose window, three red doors), from the parish's own photographs.
export const MW = 2112, MH = 1700;
export function drawMatriz(R) {
  R.fill(P([[0, 0], [MW, 0], [MW, 1300], [0, 1300]]), lin(0, 0, 0, 1300, [[0, '#1e2448'], [.35, '#4a3a5e'], [.65, '#c2685a'], [.85, '#f0a060'], [1, '#f8cc84']]), { dir: -5, fallback: -5, group: 'sky', maxR: 44, detail: 2.2, aj: .3 });
  // clouds lit from below
  [[380, 380, 260, 40], [1700, 300, 300, 46], [1500, 620, 200, 30]].forEach(([x, y, w, h], i) => R.fill(E(x, y, w, h), lin(0, y - h, 0, y + h, [[0, '#6a4a6a'], [1, '#f0a070']]), { dir: -4, group: 'cl' + i, maxR: 18 }));
  const cream = (x0, x1) => lin(x0, 0, x1, 0, [[0, '#fbe2b0'], [.5, '#f2cf96'], [1, '#c89a6e']]);
  // towers
  const tower = (x0, x1, g) => {
    R.fill(P([[x0, 380], [x1, 380], [x1, 1420], [x0, 1420]]), cream(x0, x1), { dir: 90, group: g, maxR: 16, detail: 1.4 });
    // cornices
    [520, 760, 1000].forEach(y => R.fill(P([[x0 - 16, y], [x1 + 16, y], [x1 + 16, y + 22], [x0 - 16, y + 22]]), '#fff0cc', { dir: 0, group: g + 'c' + y, maxR: 5 }));
    // bell opening + bell
    const cx = (x0 + x1) / 2;
    R.fill(c => { c.moveTo(cx - 44, 500); c.lineTo(cx - 44, 420); c.arc(cx, 420, 44, Math.PI, 0); c.lineTo(cx + 44, 500); c.closePath(); }, '#3a2a30', { group: g + 'bo', maxR: 5 });
    R.fill(c => { c.moveTo(cx - 24, 486); c.quadraticCurveTo(cx - 20, 430, cx, 428); c.quadraticCurveTo(cx + 20, 430, cx + 24, 486); c.closePath(); }, '#c8963c', { group: g + 'bell', maxR: 3 });
    // oculus
    R.fill(E(cx, 640, 30, 30), '#3a3040', { group: g + 'oc', maxR: 3 });
    // tall windows
    [[860, 940], [1100, 1180]].forEach(([y0, y1], k) => R.fill(c => { c.moveTo(cx - 36, y1); c.lineTo(cx - 36, y0); c.arc(cx, y0, 36, Math.PI, 0); c.lineTo(cx + 36, y1); c.closePath(); }, '#5a2a24', { group: g + 'w' + k, maxR: 4 }));
    // spire
    R.fill(P([[x0 + 10, 380], [cx, 170], [x1 - 10, 380]]), lin(x0, 0, x1, 0, [[0, '#fbe2b0'], [1, '#c09068']]), { dir: { radial: [cx, 170], off: 90 }, group: g + 'sp', maxR: 8 });
    R.fill(E(cx, 160, 14, 18), '#fff0cc', { group: g + 'fin', maxR: 3 });
  };
  tower(500, 760, 'tL'); tower(1352, 1612, 'tR');
  // central body + pediment + cross
  R.fill(P([[760, 600], [1352, 600], [1352, 1420], [760, 1420]]), cream(760, 1352), { dir: 90, group: 'body', maxR: 18, detail: 1.4 });
  R.fill(P([[740, 610], [1056, 420], [1372, 610]]), '#f6d8a4', { dir: 0, group: 'ped', maxR: 10 });
  R.line(c => { c.moveTo(740, 612); c.lineTo(1056, 420); c.lineTo(1372, 612); }, '#fff2d0', 18, { group: 'pedl', maxR: 4 });
  R.fill(P([[1050, 330], [1062, 330], [1062, 420], [1050, 420]]), '#fff2d0', { group: 'cross', maxR: 3 });
  R.fill(P([[1028, 352], [1084, 352], [1084, 364], [1028, 364]]), '#fff2d0', { group: 'cross', maxR: 3 });
  // rose window: half-round, blue and white
  R.fill(c => { c.moveTo(916, 830); c.arc(1056, 830, 140, Math.PI, 0); c.closePath(); }, '#f2e6c8', { group: 'roseF', maxR: 5 });
  R.fill(c => { c.moveTo(936, 826); c.arc(1056, 826, 120, Math.PI, 0); c.closePath(); }, rad(1056, 826, 10, 120, [[0, '#f4f0e6'], [.35, '#4a72c4'], [1, '#22427e']]), { dir: { radial: [1056, 826] }, group: 'rose', maxR: 4 });
  // three arched windows
  [966, 1056, 1146].forEach((x, k) => R.fill(c => { c.moveTo(x - 30, 1000); c.lineTo(x - 30, 900); c.arc(x, 900, 30, Math.PI, 0); c.lineTo(x + 30, 1000); c.closePath(); }, '#6a2c26', { group: 'mw' + k, maxR: 4 }));
  R.fill(P([[760, 1040], [1352, 1040], [1352, 1060], [760, 1060]]), '#fff0cc', { dir: 0, group: 'cornice', maxR: 5 });
  // three red doors
  [[916, 52], [1056, 62], [1196, 52]].forEach(([x, w], k) => R.fill(c => { c.moveTo(x - w, 1420); c.lineTo(x - w, 1200); c.arc(x, 1200, w, Math.PI, 0); c.lineTo(x + w, 1420); c.closePath(); }, lin(0, 1150, 0, 1420, [[0, '#9a2a24'], [1, '#5a1414']]), { group: 'door' + k, maxR: 5, dir: 90 }));
  // the plaza and steps
  R.fill(P([[0, 1420], [MW, 1420], [MW, MH], [0, MH]]), lin(0, 1420, 0, MH, [[0, '#a8806a'], [1, '#4a3634']]), { dir: 0, fallback: 0, group: 'plaza', maxR: 26 });
  R.fill(P([[820, 1420], [1292, 1420], [1340, 1470], [772, 1470]]), '#e6c49a', { dir: 0, group: 'steps', maxR: 6 });
  // palms in front
  const palm = (x, y, h, g) => {
    R.fill(c => { c.moveTo(x - 14, y); c.quadraticCurveTo(x + 24, y - h * .5, x + 4, y - h); c.lineTo(x + 22, y - h); c.quadraticCurveTo(x + 40, y - h * .5, x + 12, y); c.closePath(); }, '#4a3428', { dir: 90, group: g, maxR: 6 });
    for (let k = 0; k < 9; k++) { const a = -Math.PI / 2 + (k - 4) * .42; R.line(c => { c.moveTo(x + 12, y - h); c.quadraticCurveTo(x + 12 + Math.cos(a) * 120, y - h + Math.sin(a) * 120 - 40, x + 12 + Math.cos(a) * 230, y - h + Math.sin(a) * 150 + 70); }, k % 2 ? '#2e4a2a' : '#3e5e30', 26, { dir: 'edge', group: g + 'f', maxR: 6 }); }
  };
  palm(330, 1500, 620, 'pa'); palm(1800, 1520, 560, 'pb');
  // warm sunset light raking from the left
  R.tint(P([[0, 0], [1100, 0], [1100, MH], [0, MH]]), 'rgba(255,190,110,.12)');
}

// ===================== cards =====================
export function drawTitleCard(R) {
  R.fill(P([[0, 0], [1920, 0], [1920, 1080], [0, 1080]]), rad(960, 470, 60, 1200, [[0, '#3a2a1e'], [.6, '#22180f'], [1, '#100b07']]), { dir: -8, fallback: -8, group: 'bg', maxR: 40, detail: 1.8 });
  R.text('Matriz de São José', 960, 520, '600 150px "Cormorant Garamond"', lin(0, 400, 0, 530, [[0, '#ffe6a8'], [1, '#d8a048']]), { dir: 'edge', fallback: 15, maxR: 6, group: 't' });
  R.fill(P([[760, 590], [1160, 590], [1160, 596], [760, 596]]), '#d8a048', { dir: 0, maxR: 3, group: 'rule' });
}

export function paint(draw, w, h, opt = {}) {
  const R = new Ref(w, h, 1); draw(R);
  return { strokes: paintRef(R, { R: opt.R || [40, 20, 10, 5, 2.6], T: opt.T ?? 12, seed: opt.seed ?? 3, rev: opt.rev, app: opt.app || ((x, y, lv) => x / w * .8 + lv * .03) }), ref: R };
}
