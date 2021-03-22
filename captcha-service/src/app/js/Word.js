const FONT_SIZE = 48;
const FONT_FILE = './fonts/Open_Sans/OpenSans-Bold.ttf';

const PARAM_BLUR = 1.6;
const PARAM_SHEAR = [0.25, 0.5];
const PARAM_KEYSTONE = [4, 20];
const PARAM_WAVE = [6, 10];

class Word {
  constructor(word) {
    this.word = word;
    const hPadding = FONT_SIZE / 2;
    const UImage = createGraphics(textWidth(word) + 2 * hPadding, textAscent() + 2 * textDescent());

    UImage.background(255, 0);
    UImage.textFont(mFont);
    UImage.textSize(FONT_SIZE);
    UImage.text(word, hPadding, 0, UImage.width, UImage.height);

    const srcImg = UImage.get();
    this.image = createImage(srcImg.width, srcImg.height);

    this.horizontalShear(srcImg, this.image);
    this.keyTransform(this.image, srcImg);
    this.waveShear(srcImg, this.image);

    this.image.filter(BLUR, PARAM_BLUR);
    UImage.remove();
  }

  horizontalShear(src, dst) {
    const w = (Math.random() > 0.5) ?
          random(PARAM_SHEAR[0], PARAM_SHEAR[1]) : -random(PARAM_SHEAR[0], PARAM_SHEAR[1]);

    const intWidth = Math.floor(src.width);
    const intHeight = Math.floor(src.height);

    src.loadPixels();
    dst.loadPixels();

    for (let i = 0; i < intHeight; i++) {
      for (let j = 0; j < intWidth; j++) {
        const xu = constrain(Math.floor((j + i * w) - (intHeight * w / 2)), 0, intWidth);
        const yu = constrain(Math.floor(i), 0, intHeight);

        for (let p = 0; p < 4; p++) {
          dst.pixels[4 * (i * intWidth + j) + p] = src.pixels[4 * (yu * intWidth + xu) + p];
        }
      }
    }
    dst.updatePixels();
  }

  keyTransform(src, dst) {
    const w0 = random(PARAM_KEYSTONE[0], PARAM_KEYSTONE[1]);
    const w1 = 100.0 - w0;

    // squeeze top or bottom
    const squeezeTop = (Math.random() > 0.5);

    // pick transform parameters based on amount and location of squeeze
    const a =  (squeezeTop) ? (100.0 / (w1 - w0)) : (100.0 / (w1 + w0));
    const b =  (squeezeTop) ? (w0 / (w1 - w0)) : (-w0 / (w1 + w0));
    const c =  (squeezeTop) ? (-b) : (0);
    const d =  0.0;
    const e =  (squeezeTop) ? ((w1 + w0) / (w1 - w0)) : ((w1 - w0) / (w1 + w0));
    const f =  0.0;
    const g =  0.0;
    const h =  2.0 * b;

    const intWidth = Math.floor(src.width);
    const intHeight = Math.floor(src.height);

    const centerV = (squeezeTop) ? (-w0 / 2) : (w0 / 2.5);

    src.loadPixels();
    dst.loadPixels();

    for (let i = 0; i < intHeight; i++) {
      const ydf = i / intHeight;

      for (let j = 0; j < intWidth; j++) {
        const xdf = j / intWidth;

        // percent
        const xuf = (a * xdf + b * ydf + c) / (g * xdf + h * ydf + 1);
        const yuf = (d * xdf + e * ydf + f) / (g * xdf + h * ydf + 1);

        // pixel
        const xu = constrain(Math.round(xuf * intWidth), 0, intWidth);
        const yu = constrain(Math.round(yuf * intHeight + centerV), 0, intHeight);

        for (let p = 0; p < 4; p++) {
          dst.pixels[4 * (i * intWidth + j) + p] = src.pixels[4 * (yu * intWidth + xu) + p];
        }
      }
    }
    dst.updatePixels();
  }

  waveShear(src, dst) {
    const nWaves = this.word.length;
    const ampY = random(PARAM_WAVE[0], PARAM_WAVE[1]);
    const deltaFreq = ['CONSTANT', 'INCREASING', 'DECREASING'][Math.floor(3 * Math.random())];

    const intWidth = Math.floor(src.width);
    const intHeight = Math.floor(src.height);

    const intWidth_2 = intWidth / 2;
    const ampY_2 = ampY / 2;
    const nWaves_m1 = constrain(nWaves / 2.2, 1, nWaves);
    const nWaves_m2 = constrain(nWaves / 1.6, 1, nWaves);

    src.loadPixels();
    dst.loadPixels();

    for (let j = 0; j < intWidth; j++) {
      const _j = (intWidth - j);

      for (let i = 0; i < intHeight; i++) {
        let yuf = 0;

        if (deltaFreq === 'CONSTANT') {
          yuf = i - ampY * sin(PI * j * nWaves / intWidth);
        } else if (deltaFreq === 'INCREASING') {
          yuf = i - ampY_2 * sin(PI * (nWaves_m1 * 0.01 * (j + intWidth_2)) * j / intWidth);
        } else {
          yuf = i - ampY_2 * sin(PI * (nWaves_m2 * 0.01 * (_j + intWidth_2)) * _j / intWidth);
        }

        const xu = constrain(Math.round(j), 0, intWidth);
        const yu = constrain(Math.round(yuf - ampY / 2), 0, intHeight);

        for (let p = 0; p < 4; p++) {
          dst.pixels[4 * (i * intWidth + j) + p] = src.pixels[4 * (yu * intWidth + xu) + p];
        }
      }
    }
    dst.updatePixels();
  }
}
