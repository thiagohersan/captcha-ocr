const PARAM_BLUR = 6;

class Word {
  constructor(word) {
    const bounds = Word.font.textBounds(word, 0, 0, Word.FONT_SIZE);
    const chars = this.getCharPoints(word);

    this.word = word;
    this.graphic = createGraphics(bounds.w + 2 * Word.FONT_SIZE,
                                bounds.h + 2 * Word.FONT_SIZE);

    this.limits = {
      x: { min: 10000, max: -10000 },
      y: { min: 10000, max: -10000 }
    }

    this.horizontalShear(chars);
    this.keyTransform(chars);
    this.waveShear(chars);
    this.noiseShear(chars);
    this.getLimits(chars);

    this.graphic.background(255, 0);
    this.graphic.fill(0);
    this.drawChars(chars);
    this.graphic.filter(BLUR, PARAM_BLUR);

    this.image = this.graphic.get();
    this.graphic.remove();
    this.graphic = null;
    this.limits = null;
  }

  drawChars(chars) {
    const padding = Word.FONT_SIZE / 6;

    for(let c = 0; c < chars.length; c++) {
      this.graphic.beginShape();
      for (let i = 0; i < chars[c].length; i++) {
        const p = chars[c][i];
        const mx = map(p.x, this.limits.x.min, this.limits.x.max, padding, this.graphic.width - padding);
        const my = map(p.y, this.limits.y.min, this.limits.y.max, padding, this.graphic.height - padding);
        vertex(mx, my);
      }
      this.graphic.endShape();
    }
  }

  getCharPoints(word) {
    const spacer = ' '.repeat(10);
    const spaced = word.split('').map(x => x+spacer).join('');
    const spacerWidth = Word.font.textBounds(spacer, 0, 0, Word.FONT_SIZE).w;

    let points = Word.font.textToPoints(spaced, 0, 0, Word.FONT_SIZE, {
      sampleFactor: 1
    });

    const chars = [];
    let p = points[0];
    let pp = points[0];
    let mChar = [pp];

    for (let i = 1; i < points.length; i++) {
      p = points[i];

      if(Math.abs(p.x - pp.x) > spacerWidth) {
        chars.push([...mChar]);
        mChar = [];
      } else {
        mChar.push({
          x: p.x - chars.length * spacerWidth,
          y: p.y
        });
      }
      pp = points[i];
    }
    chars.push(mChar);
    return chars;
  }

  getLimits(chars) {
    for(let c = 0; c < chars.length; c++) {
      for (let i = 0; i < chars[c].length; i++) {
        const p = chars[c][i];
        if(p.x > this.limits.x.max) this.limits.x.max = p.x;
        if(p.x < this.limits.x.min) this.limits.x.min = p.x;
        if(p.y > this.limits.y.max) this.limits.y.max = p.y;
        if(p.y < this.limits.y.min) this.limits.y.min = p.y;
      }
    }
  }

  horizontalShear(chars) {
    const shear = 0.3333 * Word.FONT_SIZE * random(0.5, 1);
    const flip = (random() > 0.5) ? 1 : -1;

    for(let c = 0; c < chars.length; c++) {
      for (let i = 0; i < chars[c].length; i++) {
        const p = chars[c][i];
        const sy = map(p.y, 0, this.graphic.height, 0, flip * shear);
        chars[c][i].x = p.x + sy;
      }
    }
  }

  keyTransform(chars) {
    const keystone = 0.3333 * Word.FONT_SIZE * random(0.5, 1);
    const flip = (random() > 0.5) ? 1 : -1;

    for(let c = 0; c < chars.length; c++) {
      for (let i = 0; i < chars[c].length; i++) {
        const p = chars[c][i];
        const sy = map(p.y, 0, this.graphic.height, -keystone, keystone);
        const sx = map(p.x, 0, this.graphic.width, -flip, flip);
        chars[c][i].x = p.x + sy * sx;
      }
    }
  }

  waveShear(chars) {
    const ampHi = 4 * random(0.5, 1);
    const ampLo = 12 * random(0.5, 1);
    const nWavesLo = this.word.length / 2;
    const phase = random(-PI, PI);

    for(let c = 0; c < chars.length; c++) {
      const nWavesHi = random(1.33 * this.word.length, 3.333 * this.word.length);
      for (let i = 0; i < chars[c].length; i++) {
        const p = chars[c][i];
        chars[c][i].y = p.y - ampHi * sin(PI * p.x * nWavesHi / this.graphic.width + phase);
        chars[c][i].y = p.y - ampLo * sin(PI * p.x * nWavesLo / this.graphic.width + phase);
      }
    }
  }

  noiseShear(chars) {
    const noiseScale = Word.FONT_SIZE / .7;
    const maxChange = Word.FONT_SIZE / 2;

    for(let c = 0; c < chars.length; c++) {
      const z = random(0, this.graphic.width);
      for (let i = 0; i < chars[c].length; i++) {
        const p = chars[c][i];
        chars[c][i].x += maxChange * (0.5 - noise(p.x / noiseScale, p.y / noiseScale, z / noiseScale));
        chars[c][i].y += maxChange * (0.5 - noise(p.y / noiseScale, p.x / noiseScale));
      }
    }
  }
}
