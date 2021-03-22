const FONT_SIZE = 48;

class Word {
  constructor(word) {
    this.word = word;
    this.UImage = createGraphics(textWidth(word) + FONT_SIZE, textAscent() + 2 * textDescent());
    this.UImage.background(200, 0, 0);
    this.UImage.textFont(mFont);
    this.UImage.textSize(FONT_SIZE);
    this.UImage.text(word, FONT_SIZE / 2, 0, this.UImage.width, this.UImage.height);

    const srcImg = this.UImage.get();
    const dstImg = createImage(srcImg.width, srcImg.height);

    this.horizontalShear(srcImg, dstImg);
    this.horizontalShear(dstImg, srcImg);
    this.keyTransform(srcImg, dstImg);

    dstImg.filter(BLUR, 1);

    image(dstImg, 0, 0, dstImg.width / 1, dstImg.height / 1);
  }

  horizontalShear(src, dst) {
    const w = (Math.random() > 0.5) ? random(0.3, 0.7) : -1 * random(0.3, 0.7);

    src.loadPixels();
    dst.loadPixels();

    const intWidth = Math.floor(src.width);
    const intHeight = Math.floor(src.height);

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
    const w0 = random(5, 20);
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

    src.loadPixels();
    dst.loadPixels();

    const intWidth = Math.floor(src.width);
    const intHeight = Math.floor(src.height);

    for (let i = 0; i < intHeight; i++) {
      const ydf = i / intHeight;

      for (let j = 0; j < intWidth; j++) {
        const xdf = j / intWidth;

        // percent
        const xuf = (a * xdf + b * ydf + c) / (g * xdf + h * ydf + 1);
        const yuf = (d * xdf + e * ydf + f) / (g * xdf + h * ydf + 1);

        // pixel
        const xu = constrain(Math.round(xuf * intWidth), 0, intWidth);
        const yu = constrain(Math.round(yuf * intHeight), 0, intHeight);

        for (let p = 0; p < 4; p++) {
          dst.pixels[4 * (i * intWidth + j) + p] = src.pixels[4 * (yu * intWidth + xu) + p];
        }
      }
    }
    dst.updatePixels();
  }
}
