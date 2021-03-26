const PARAM_BLUR = 1.6;

class Word {
  constructor(word) {
    const hPadding = Word.FONT_SIZE / 2;
    const vPadding = Word.FONT_SIZE / 3;
    const bounds = Word.font.textBounds(word, 0, 0, Word.FONT_SIZE);
    const imageWidth = bounds.w + 2 * hPadding;
    const imageHeight = bounds.h + 2 * vPadding;
    const chars = this.getCharPoints(word);

    this.word = word;
    this.image = createGraphics(imageWidth, imageHeight);

    this.horizontalShear(chars);
    this.keyTransform(chars);
    this.waveShear(chars);
    //this.noiseShear(chars);

    this.image.background(255, 0);
    this.image.translate(hPadding, this.image.height - vPadding);
    this.image.fill(0);
    this.drawChars(chars);
    this.image.filter(BLUR, PARAM_BLUR);

    const temp = this.image.get();
    this.image.remove();
    this.image = temp;
  }

  drawChars(chars) {
    for(let c = 0; c < chars.length; c++) {
      this.image.beginShape();
      for (let i = 0; i < chars[c].length; i++) {
        const p = chars[c][i];
        vertex(p.x, p.y);
      }
      this.image.endShape();
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

  horizontalShear(chars) {
    const shear = 0.3333 * Word.FONT_SIZE * random(0.5, 1);
    const flip = (random() > 0.5) ? 1 : -1;

    for(let c = 0; c < chars.length; c++) {
      for (let i = 0; i < chars[c].length; i++) {
        const p = chars[c][i];
        const sy = map(p.y, 0, this.image.height, 0, flip * shear);
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
        const sy = map(p.y, 0, this.image.height, -keystone, keystone);
        const sx = map(p.x, 0, this.image.width, -flip, flip);
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
        chars[c][i].y = p.y - ampHi * sin(PI * p.x * nWavesHi / this.image.width + phase);
        chars[c][i].y = p.y - ampLo * sin(PI * p.x * nWavesLo / this.image.width + phase);
      }
    }
  }

  noiseShear(chars) {
    const noiseScale = Word.FONT_SIZE / .7;
    const maxChange = Word.FONT_SIZE;

    for(let c = 0; c < chars.length; c++) {
      const z = random(0, this.image.width);
      for (let i = 0; i < chars[c].length; i++) {
        const p = chars[c][i];
        chars[c][i].x += maxChange * (0.5 - noise(p.x / noiseScale, p.y / noiseScale, z / noiseScale));
        chars[c][i].y += maxChange * (0.5 - noise(p.y / noiseScale, p.x / noiseScale));
      }
    }
  }
}
