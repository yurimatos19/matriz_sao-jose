// Single source of truth: cuts, voice lines, hits. The page, the mixer (via events.json) and the .srt read it.
export const BPM = 72, BEAT = 60 / BPM, BAR = BEAT * 4;
export const T = {
  shop: 0, dream: 13.0, reveal: 19.15, beth: 24.5, jesus: 29.3, flight: 32.6, home: 41.6, matriz: 51.2, card: 60.8,
};
export const DUR = 67.0;
// voice: id, start, measured duration (voice/dur.json), subtitle text
export const LINES = [
  ['l1', 0.8, 3.81, 'Nos Evangelhos, José não diz uma única palavra.'],
  ['l2', 6.6, 4.696, 'Era carpinteiro em Nazaré,\nda casa do rei Davi, e noivo de Maria.'],
  ['l3', 13.8, 4.088, 'Quando soube que Maria esperava um filho,\num anjo lhe disse em sonho:'],
  ['l4', 19.6, 3.626, '“Não tenhas medo.”\nE José fez o que o anjo mandou.'],
  ['l5', 25.4, 3.911, 'Em Belém, foi ele quem deu ao Menino o nome: Jesus.'],
  ['l6', 33.4, 4.625, 'Quando Herodes quis matar a criança,\nJosé partiu de noite para o Egito.'],
  ['l7', 42.4, 5.372, 'Depois, voltou a Nazaré, e ensinou ao Filho de Deus\no ofício da madeira.'],
  ['l8', 51.8, 4.544, 'Guardião do Redentor,\npadroeiro da Igreja e dos trabalhadores.'],
  ['l9', 56.55, 3.68, 'Aqui no Recife, ele continua cuidando da sua família.'],
];
export const CUES = LINES.map(([id, t, d, text], i) => ({ id, t0: t, t1: Math.min(t + Math.max(1.8, d + .6), i + 1 < LINES.length ? LINES[i + 1][1] - .05 : T.card - .05), text }));
