# "São José" — score. D Dorian, 72 bpm. Nylon guitar (the workshop), organ drone (the night),
# harp + glockenspiel (the light, the star), pizzicato + frame drum (the flight), strings + organ + bells (Recife).
import sys, os, json
LIB = os.environ['LIB']; sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, limit
HERE = os.path.dirname(os.path.abspath(__file__))
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EVJ['dur'] + .6
B = 60 / 72; E8 = B / 2
T = dict(dream=13.0, reveal=19.15, beth=24.5, jesus=29.3, flight=32.6, home=41.6, matriz=51.2, card=60.8)
S.seed(5)
ev = []
def N(*a): ev.append(a)

CH = {'Dm': ['D3', 'A3', 'D4', 'F4', 'A4', 'F4', 'D4', 'A3'], 'G': ['G2', 'D3', 'G3', 'B3', 'D4', 'B3', 'G3', 'D3'],
      'Am': ['A2', 'E3', 'A3', 'C4', 'E4', 'C4', 'A3', 'E3'], 'C': ['C3', 'G3', 'C4', 'E4', 'G4', 'E4', 'C4', 'G3'],
      'F': ['F2', 'C3', 'F3', 'A3', 'C4', 'A3', 'F3', 'C3'], 'Bb': ['Bb2', 'F3', 'Bb3', 'D4', 'F4', 'D4', 'Bb3', 'F3'],
      'D': ['D3', 'A3', 'D4', 'F#4', 'A4', 'F#4', 'D4', 'A3']}
def guitar(t0, t1, prog, vel=.55):
    t, k = t0, 0
    while t < t1 - .05:
        notes = CH[prog[k % len(prog)]]
        for i, p in enumerate(notes):
            tt = t + i * E8
            if tt < t1 - .05: N(tt, 'guitar_nylon', p, E8 * 2.2, vel * (1.1 if i == 0 else .9), -.15)
        t += B * 4; k += 1

# A · the workshop (0–13): guitar alone, a recorder joins on bar 2
guitar(0.0, T['dream'], ['Dm', 'G', 'Am', 'Dm'])
for t, p, d in [(3.3, 'A4', B), (4.2, 'C5', E8), (4.6, 'D5', B * 1.5), (5.8, 'C5', E8), (6.2, 'A4', B * 2), (8.3, 'G4', B), (9.1, 'A4', E8), (9.5, 'B4', E8), (9.9, 'A4', B * 3)]:
    N(t, 'recorder', p, d, .42, .2)

# B · the dream (13–24.5): low organ drone, near silence, then the light
N(T['dream'], 'organ_soft', 'D3', 4.6, .32, 0); N(T['dream'], 'organ_soft', 'A3', 4.6, .26, 0)
for k, p in enumerate(['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'A5', 'D6']):
    N(T['reveal'] - .25 + k * .05, 'harp', p, 2.4, .5 + k * .025, -.25)
N(T['reveal'], 'hand_chimes', 'D6', 3.5, .45, .3); N(T['reveal'] + .1, 'glockenspiel', 'A6', 2.5, .35, .2)
for p in ['D4', 'F#4', 'A4']: N(T['reveal'] + .2, 'violins', p, T['beth'] - T['reveal'] - .2, .34, .25)
for p in ['D3', 'A3']: N(T['reveal'] + .2, 'cellos', p, T['beth'] - T['reveal'] - .2, .34, -.2)
for i in range(6):
    for k, p in enumerate(['D4', 'A4', 'D5', 'F#5']): N(T['reveal'] + .9 + i * B * 1.0 + k * E8 / 2, 'harp', p, 1.2, .28, -.3)

# C · Bethlehem (24.5–32.6): a lullaby on harp, glockenspiel on the Name
t = T['beth']
for bar, ch in enumerate(['Dm', 'Bb', 'F', 'C', 'Dm']):
    for i, p in enumerate(CH[ch][:6]):
        tt = t + bar * B * 2 + i * B / 3
        if tt < T['flight'] - .2: N(tt, 'harp', p.replace('2', '3'), 1.4, .38, -.2)
for p, tt in [('A5', 25.4), ('F5', 26.4), ('G5', 27.2), ('A5', 28.0)]: N(tt, 'flute', p, B * 1.1, .34, .25)
N(T['jesus'], 'glockenspiel', 'D6', 3, .55, .1); N(T['jesus'], 'glockenspiel', 'A6', 3, .4, .2); N(T['jesus'], 'hand_chimes', 'D5', 4, .4, -.1)
for p in ['D4', 'F#4', 'A4']: N(T['jesus'], 'violins', p, 3.4, .3, .25)

# D · the flight (32.6–41.6): pizzicato ostinato, frame drum, a flute line in the low register
t = T['flight']
while t < T['home'] - .3:
    for i, p in enumerate(['D3', 'D3', 'A3', 'D3', 'F3', 'D3', 'A3', 'C4']):
        N(t + i * E8, 'cellos_pizz', p, .3, .62 if i % 2 == 0 else .48, -.1)
    N(t, 'frame_drum', None, None, .55, 0); N(t + B * 2, 'frame_drum', None, None, .45, 0); N(t + B * 3.5, 'frame_drum', None, None, .3, .1)
    t += B * 4
for tt, p, d in [(33.3, 'D5', B), (34.1, 'E5', E8), (34.5, 'F5', B), (35.3, 'E5', E8), (35.7, 'D5', B * 1.5), (36.9, 'C5', B), (37.7, 'A4', B * 2), (39.6, 'D5', B), (40.4, 'C5', E8), (40.8, 'A4', B)]:
    N(tt, 'flute', p, d, .45, .25)
N(T['flight'], 'contrabass', 'D2', T['home'] - T['flight'], .35, 0)

# E · Nazaré again (41.6–51.2): the guitar returns, the flute takes the recorder's tune an octave up
guitar(T['home'], T['matriz'], ['Dm', 'G', 'Am', 'D'], .5)
for tt, p, d in [(43.2, 'A5', B), (44.1, 'C6', E8), (44.5, 'D6', B * 1.5), (45.7, 'C6', E8), (46.1, 'A5', B * 2), (48.2, 'G5', B), (49.0, 'A5', E8), (49.4, 'B5', E8), (49.8, 'A5', B * 2)]:
    N(tt, 'flute', p, d, .36, .2)

# F · Recife (51.2–60.5): strings + organ, Dm → Bb → F → C → D (Picardy)
prog = [('Dm', 51.2), ('Bb', 53.6), ('F', 55.4), ('C', 57.2), ('D', 58.6)]
voic = {'Dm': ['D3', 'F3', 'A3', 'D4'], 'Bb': ['Bb2', 'F3', 'Bb3', 'D4'], 'F': ['F2', 'C3', 'A3', 'C4'], 'C': ['C3', 'G3', 'C4', 'E4'], 'D': ['D3', 'F#3', 'A3', 'D4']}
for i, (c, t0) in enumerate(prog):
    t1 = prog[i + 1][1] if i + 1 < len(prog) else 60.45
    v = voic[c]
    N(t0, 'contrabass', v[0].replace('3', '2') if '3' in v[0] else v[0], t1 - t0, .45, 0)
    N(t0, 'cellos', v[1], t1 - t0, .42, -.2); N(t0, 'violas', v[2], t1 - t0, .4, .05)
    N(t0, 'violins', v[3].replace('4', '5'), t1 - t0, .38, .3)
    for p in v: N(t0, 'organ_soft', p, t1 - t0, .22, 0)
N(51.2, 'timpani', 'D3', 2, .5, 0)
for tt, p in [(56.55, 'D4'), (57.4, 'A3')]: N(tt, 'tubular_bells', p, 5, .55, -.2 if p == 'D4' else .2)

# G · end card: silence, then one bell and a held chord
N(T['card'] + .1, 'tubular_bells', 'D4', 6, .6, 0)
for p in ['D3', 'A3', 'D4', 'F#4']: N(T['card'] + .3, 'organ_soft', p, 5.4, .2, 0)
for k, p in enumerate(['D4', 'A4', 'D5', 'F#5', 'A5']): N(T['card'] + .3 + k * .12, 'harp', p, 3, .3, -.2)

mix = S.render(ev, dur=DUR)
mix = S.room(mix, size=.55, mix=.24)
# the two silences: before "Não tenhas medo" and before the end card
for a, b in [(T['reveal'] - 1.4, T['reveal'] - .3), (T['card'] - .45, T['card'] + .05)]:
    i0, i1 = int(a * SR), int(b * SR); f = 2400
    mix[i0:i0 + f] *= np.linspace(1, .04, f)[:, None]; mix[i0 + f:i1] *= .04
mix = limit(mix, .9)
sf.write(os.path.join(HERE, 'out/score.wav'), mix.astype(np.float32), SR)
used = sorted({e[1] for e in ev})
open(os.path.join(HERE, 'out/instruments.txt'), 'w').write('\n'.join(used))
print('score', round(len(mix) / SR, 2), 's · instruments:', used)
