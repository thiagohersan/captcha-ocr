const EL = {};

let mFont;

function preload() {
  mFont = loadFont('./fonts/Open_Sans/OpenSans-Bold.ttf');
  EL.container = document.getElementById('my-canvas-container');
  EL.menu = document.getElementById('my-menu-container');
  EL.text = document.getElementById('my-input-text');
  EL.text.addEventListener('keyup', createCaptcha);
}

function setup() {
  const mDim = Math.min(windowWidth, windowHeight - EL.menu.offsetHeight);
  const mCanvas = createCanvas(mDim, mDim);
  mCanvas.parent('my-canvas-container');
  mCanvas.id('my-captcha-canvas');
  mCanvas.elt.classList.add('captcha-canvas');
  smooth();
  noLoop();
  textFont(mFont);
  textSize(FONT_SIZE);
  textAlign(CENTER, CENTER);
}

function windowResized() {
  const mDim = Math.min(windowWidth, windowHeight - EL.menu.offsetHeight);
  resizeCanvas(mDim, mDim);
}


function createCaptcha() {
  // TODO:
  //   - get text, measure length/height, etc
  //   - set font-size
  //   - place text
  //   - distort text

  background(255);
  text(EL.text.value, 0, 0, width, height);
}
