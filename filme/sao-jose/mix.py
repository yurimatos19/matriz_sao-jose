# Sound design + final mix: ambience beds per scene, foley from window.EV, voice, ducked score.
import sys, os, json
LIB = os.environ['LIB']; sys.path.insert(0, LIB)
import numpy as np, soundfile as sf, soxr
from core.audio.sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, thump, whoosh, add, limit, compress
HERE = os.path.dirname(os.path.abspath(__file__))
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
EV, DUR = EVJ['ev'], EVJ['dur'] + .4
N = int(DUR * SR)
rng = np.random.default_rng(3)
T = dict(dream=13.0, reveal=19.15, beth=24.5, flight=32.6, home=41.6, matriz=51.2, card=60.8)

def load(p, n=N):
    x, sr = sf.read(p)
    if x.ndim == 1: x = np.stack([x, x], 1)
    if sr != SR: x = soxr.resample(x, sr, SR)
    x = x[:n]; return np.pad(x, ((0, n - len(x)), (0, 0)))
music = load(os.path.join(HERE, 'out/score.wav'))
voice = np.zeros((N, 2)); fx = np.zeros((N, 2)); amb = np.zeros((N, 2))
def put(buf, x, at, g=1., pan=0.):
    if x.ndim == 2: x = x.mean(1)
    add(buf, x, at, g, pan)

# ---- materials
def plane_stroke(v=1.):            # hand plane shaving pine: a grainy hiss that rises and lifts off
    d = .55; n = noise(d); tt = t_(d)
    grain = 1 + 4 * np.abs(bp(rng.standard_normal(len(n)), 40, 160, 1))
    x = bp(n, 1800, 7500) * grain * np.sin(np.pi * np.clip(tt / d, 0, 1)) ** .7
    x += bp(noise(d), 300, 900) * env_exp(d, .05) * .4
    return norm(x) * v
def knife(d=.5, v=1.):             # palette knife dragged through thick paint
    n = noise(d); tt = t_(d)
    x = bp(n, 600, 4200) * (1 + 3 * np.abs(bp(rng.standard_normal(len(n)), 20, 90, 1))) * np.sin(np.pi * tt / d) ** 1.5
    return norm(x) * v
def hoof(v=1.):                    # small hoof / sandal on sand
    d = .12; return norm(lp(noise(d), 700) * env_exp(d, .02) + thump(.4, 90)[:int(d * SR)] * .5) * v
def birds(d):                      # sparse chirps
    out = np.zeros(len(t_(d))); t = .3
    while t < d - .4:
        f0 = 2600 + rng.random() * 1800; n = 2 + int(rng.random() * 3)
        for k in range(n):
            dd = .07; tt = t_(dd); f = f0 * (1 + .25 * np.sin(np.pi * tt / dd))
            s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / dd) * .25
            i = int((t + k * .1) * SR); out[i:i + len(s)] += s[:len(out) - i]
        t += 1.2 + rng.random() * 2.2
    return out
def crickets(d):
    tt = t_(d); c = np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 28 * tt) > .2) * ((np.sin(2 * np.pi * .9 * tt) > 0) * .8 + .2)
    return c * .05 + lp(noise(d), 300) * .02
def wind(d):
    m = .5 + .5 * np.sin(2 * np.pi * .13 * t_(d) + 1); return bp(noise(d), 150, 1400) * m * .12
def city(d):
    return lp(noise(d), 500) * .05 + bp(noise(d), 800, 2000) * .008

def bed(gen, a, b, g, fade=.6):
    x = gen(b - a); x[:int(fade * SR)] *= np.linspace(0, 1, int(fade * SR)); x[-int(fade * SR):] *= np.linspace(1, 0, int(fade * SR))
    put(amb, x, a, g, 0)
bed(lambda d: birds(d) + lp(noise(d), 400) * .02, 0, T['dream'] + .4, 1.0)
bed(crickets, T['dream'] - .3, T['beth'] + .5, .9)
bed(lambda d: crickets(d) * .6, T['beth'] - .3, T['flight'] + .4, .8)
bed(wind, T['flight'] - .3, T['home'] + .4, 1.0)
bed(lambda d: birds(d) + lp(noise(d), 400) * .02, T['home'] - .3, T['matriz'] + .4, .9)
bed(city, T['matriz'] - .6, T['card'], 1.0)          # J-cut: the city comes in under the last Nazaré line

for e in EV:
    t, ty = e['t'], e['type']
    if ty == 'voice':
        v = load(os.path.join(HERE, 'voice', e['id'] + '.wav'), int((e['d'] + .5) * SR)).mean(1)
        v = compress(v / (np.abs(v).max() + 1e-9) * .9, thr=.3, ratio=3)
        put(voice, v, t, 1.0, 0)
    elif ty == 'scrape': put(fx, knife(e['d'] + .3, .32), t - .1, 1, rng.uniform(-.3, .3))
    elif ty == 'plane': put(fx, plane_stroke(.16 if e.get('soft') else .22), t + .1, 1, -.25)
    elif ty == 'hoof': put(fx, hoof(.18 + rng.random() * .06), t, 1, .1)
    elif ty == 'light': put(fx, whoosh(1.2, .25), t - .5, 1, .3)

# ---- balance: voice ~10 dB over music; music ducked under every line
rms = lambda x: np.sqrt(np.mean(x[np.abs(x).sum(1) > 1e-4] ** 2) + 1e-12)
voice *= .22 / rms(voice)
duck = np.ones(N)
for e in EV:
    if e['type'] != 'voice': continue
    a, b = int((e['t'] - .25) * SR), int((e['t'] + e['d'] + .3) * SR)
    duck[a:b] = np.minimum(duck[a:b], .36)
k = np.ones(int(.25 * SR)) / int(.25 * SR); duck = np.convolve(duck, k, 'same')
mix = music * .8 * duck[:, None] + fx * .9 + amb * duck[:, None] ** .5 + voice
# keep the low end in check (synthetic beds and bass)
lo = np.stack([lp(mix[:, c], 110) for c in (0, 1)], 1); mix = mix - lo * .35
mix = limit(mix, .92)
sf.write(os.path.join(HERE, 'out/mix.wav'), mix.astype(np.float32), SR)
print('mix', round(N / SR, 2), 's peak', round(float(np.abs(mix).max()), 3))
