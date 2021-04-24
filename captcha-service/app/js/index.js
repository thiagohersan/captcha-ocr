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
  EL.languages = document.getElementsByClassName('input-radio');
  EL.text.addEventListener('keyup', createCaptcha);
  EL.button1984.addEventListener('click', create1984Captcha);
  Array.from(EL.languages).forEach(e => {
    e.addEventListener('click', create1984Captcha);
  });
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

  const queryLang = (new URL(location.href)).searchParams.get('lang');
  const queryButton = Array.from(EL.languages).find(el => (el.value === queryLang));
  if (queryButton) queryButton.click();
  EL.button1984.click();
}

function windowResized() {
  const mDim = Math.min(windowWidth, windowHeight - EL.menu.offsetHeight);
  resizeCanvas(mDim, mDim);
}

let mWords = [];

function createCaptcha() {
  let captchaReady = document.getElementById('captcha-ready');
  if(captchaReady) captchaReady.remove();

  mWords = EL.text.value.trim().replace(/ +/g, ' ').split(' ').map(w => new Word(w));

  const widthScale = 1.2;
  const wordHeight = 1.15 * mWords[0].image.height;
  const totalWidth = mWords.reduce((acc, cw) => acc + cw.image.width, 0);
  const mDim = widthScale * Math.ceil((Math.sqrt(wordHeight * totalWidth)) / wordHeight) * wordHeight;

  const mCaptcha = createGraphics(mDim, mDim);
  mCaptcha.background(255);

  let cX = 0;
  let cY = 0;
  let maxX = 0;

  mWords.forEach(w => {
    if (cX + widthScale * w.image.width > mCaptcha.width) {
      if (cX > maxX) maxX = cX;
      cX = 0;
      cY += wordHeight;
    }
    mCaptcha.image(w.image, cX, cY);
    cX += widthScale * w.image.width;
  });

  resizeCanvas(maxX, cY + wordHeight);
  background(255);
  image(mCaptcha, 0, 0);

  mCaptcha.remove();

  captchaReady = document.createElement('div');
  captchaReady.setAttribute('id', 'captcha-ready');
  document.body.appendChild(captchaReady);
}

function create1984Captcha() {
  const mLanguage = Array.from(EL.languages).find(el => el.checked).value;
  //const m1984Phrases = seedPhrases.find(el => el.book === '1984').phrases[mLanguage];
  const m1984Phrases = phrases_1984[mLanguage];
  EL.text.value = m1984Phrases[Math.floor(m1984Phrases.length * Math.random())];
  createCaptcha();
}
