const API_URL = 'https://tbglhpigzk.execute-api.us-east-1.amazonaws.com/dev/captcha';

const mHttpPost = new XMLHttpRequest();
const mHttpGet = new XMLHttpRequest();
let captchaReady = false;

const EL = {};

const nextCaptcha = {
  ready: false,
  token: '',
  image: ''
};

const thisCaptcha = {
  ready: false,
  token: '',
  image: ''
};

mHttpGet.onreadystatechange = (err) => {
  if (mHttpGet.readyState == 4 && mHttpGet.status == 200) {
    const res = JSON.parse(mHttpGet.responseText);
    if(res.success && res.image.startsWith('data:image/png;base64,')) {
      if(!thisCaptcha.ready) {
        thisCaptcha.ready = true;
        thisCaptcha.token = res.token;
        thisCaptcha.image = res.image;
        setImage(EL.captchaImage, thisCaptcha.image);
        getCaptcha();
      } else {
        nextCaptcha.ready = true;
        nextCaptcha.token = res.token;
        nextCaptcha.image = res.image;
      }
    }
  }
};

mHttpPost.onreadystatechange = (err) => {
  if (mHttpPost.readyState == 4 && mHttpPost.status == 200) {
    const res = JSON.parse(mHttpPost.responseText);
    if(res.success && res.url.length > 0) {
      // TODO: go to url
      console.log('SUCCESS ! SHOULD REDIRECT SOON !');
    } else {
      EL.captchaInput.value = '';
      if(!nextCaptcha.ready) {
        thisCaptcha.ready = false;
      } else {
        thisCaptcha.ready = nextCaptcha.ready;
        thisCaptcha.token = nextCaptcha.token;
        thisCaptcha.image = nextCaptcha.image;
        setImage(EL.captchaImage, thisCaptcha.image);
      }
      getCaptcha();
    }
  }
};

window.addEventListener('load', () => {
  getCaptcha();

  EL.link = document.getElementById('my-link');
  EL.overlay = document.createElement('div');
  EL.overlay.classList.add('overlay');
  document.body.appendChild(EL.overlay);

  EL.captchaContainer = document.createElement('div');
  EL.captchaContainer.classList.add('captcha-container');
  EL.overlay.appendChild(EL.captchaContainer);

  EL.captchaImage = document.createElement('div');
  EL.captchaImage.classList.add('captcha-image');
  EL.captchaContainer.appendChild(EL.captchaImage);

  EL.captchaInput = document.createElement('input');
  EL.captchaInput.setAttribute('type', 'text');
  EL.captchaInput.classList.add('captcha-input');
  EL.captchaContainer.appendChild(EL.captchaInput);

  EL.captchaButton = document.createElement('input');
  EL.captchaButton.setAttribute('type', 'button');
  EL.captchaButton.setAttribute('value', 'SEND');
  EL.captchaButton.classList.add('captcha-button');
  EL.captchaContainer.appendChild(EL.captchaButton);

  setImage(EL.captchaImage, '');

  EL.captchaButton.addEventListener('click', (event) => {
    if(thisCaptcha.ready) checkCaptcha();
  });

  EL.link.addEventListener('click', (event) => {
    EL.overlay.style.pointerEvents = 'all';
    centerOnClick(EL.captchaContainer, event);
    EL.overlay.style.opacity = '1';
  });

  EL.overlay.addEventListener('click', (event) => {
    EL.overlay.style.opacity = '0';
    EL.overlay.style.pointerEvents = 'none';
  });

  EL.captchaContainer.addEventListener('click', (event) => {
    event.stopPropagation();
  });
});

function centerOnClick(el, event) {
  const padding = 5;
  const maxLeft = EL.overlay.offsetWidth - el.offsetWidth;
  const maxTop = EL.overlay.offsetHeight - el.offsetHeight;
  const centerLeft = (event.clientX - el.offsetWidth / 2);
  const centerTop = (event.clientY - el.offsetHeight / 2);
  el.style.left =  constrain(centerLeft, padding, maxLeft - padding) + 'px';
  el.style.top =  constrain(centerTop, padding, maxTop - padding) + 'px';
}

function constrain(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function getCaptcha() {
  mHttpGet.open('GET', API_URL);
  mHttpGet.send();
}

function checkCaptcha() {
  mHttpPost.open('POST', API_URL);
  mHttpPost.send(JSON.stringify({
    token: thisCaptcha.token,
    phrase: EL.captchaInput.value
  }));
}

function setImage(el, img64) {
  el.style.backgroundImage = `url("${img64}")`;
}
