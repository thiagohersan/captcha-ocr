const FONT_SIZE = 48;
const FONT_FILE = './fonts/Open_Sans/OpenSans-Bold.ttf';

const EL = {};

function preload() {
  Word.font = loadFont(FONT_FILE);
  Word.FONT_SIZE = FONT_SIZE;
  EL.container = document.getElementById('my-canvas-container');
  EL.menu = document.getElementById('my-menu-container');
  EL.text = document.getElementById('my-input-text');
  EL.button1984 = document.getElementById('my-button-1984');
  EL.text.addEventListener('keyup', createCaptcha);
  EL.button1984.addEventListener('click', create1984Captcha);
}

function setup() {
  const mDim = Math.min(windowWidth, windowHeight - EL.menu.offsetHeight);
  const mCanvas = createCanvas(mDim, mDim);
  mCanvas.parent('my-canvas-container');
  mCanvas.id('my-captcha-canvas');
  mCanvas.elt.classList.add('captcha-canvas');
  smooth();
  noLoop();
  textSize(FONT_SIZE);
}

function windowResized() {
  const mDim = Math.min(windowWidth, windowHeight - EL.menu.offsetHeight);
  resizeCanvas(mDim, mDim);
}

let mWords = [];

function createCaptcha() {
  mWords = EL.text.value.split(' ').map(w => new Word(w));

  const widthScale = 1.2;
  const wordHeight = 0.75 * mWords[0].image.height;
  const totalWidth = mWords.reduce((acc, cw) => acc + cw.image.width, 0);
  const mDim = Math.ceil((Math.sqrt(wordHeight * totalWidth)) / wordHeight) * wordHeight;

  const mCaptcha = createGraphics(widthScale * mDim, 1.5 * mDim);
  mCaptcha.background(255, 0);

  let cX = -10;
  let cY = 0;

  mWords.forEach(w => {
    if (cX + widthScale * w.image.width > mCaptcha.width) {
      cX = -10;
      cY += wordHeight;
    }
    mCaptcha.image(w.image, cX, cY);
    cX += widthScale * w.image.width;
  });

  background(255);
  image(mCaptcha, (width - mCaptcha.width) / 2, 0);
  mCaptcha.remove();
}

function create1984Captcha() {
  const m1984Phrases = seedPhrases.find(el => el.book === '1984').phrases.en;
  EL.text.value = m1984Phrases[Math.floor(m1984Phrases.length * Math.random())];
  createCaptcha();
}
