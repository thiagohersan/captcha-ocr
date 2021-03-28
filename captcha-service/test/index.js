const API_URL = 'https://tbglhpigzk.execute-api.us-east-1.amazonaws.com/dev/captcha';

const mHttpPost = new XMLHttpRequest();
const mHttpGet = new XMLHttpRequest();

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

getCaptcha();

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
    EL.captchaInput.value = '';

    if(res.success && res.url.length > 0) {
      window.location.href = res.url;
    } else {
      if(!nextCaptcha.ready) {
        thisCaptcha.ready = false;
        unsetImage(EL.captchaImage);
        EL.captchaButton.classList.remove('show');
      } else {
        thisCaptcha.ready = nextCaptcha.ready;
        thisCaptcha.token = nextCaptcha.token;
        thisCaptcha.image = nextCaptcha.image;
        nextCaptcha.ready = false;
        setImage(EL.captchaImage, thisCaptcha.image);
      }
      getCaptcha();
    }
  }
};

window.addEventListener('load', () => {
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
  EL.captchaImage.style.height = window.getComputedStyle(EL.captchaImage).getPropertyValue('width');

  EL.loader = document.createElement('div');
  EL.loader.classList.add('loader', 'show');
  EL.captchaImage.appendChild(EL.loader);

  EL.captchaInput = document.createElement('input');
  EL.captchaInput.setAttribute('type', 'text');
  EL.captchaInput.classList.add('captcha-input');
  EL.captchaContainer.appendChild(EL.captchaInput);

  EL.captchaButton = document.createElement('input');
  EL.captchaButton.setAttribute('type', 'button');
  EL.captchaButton.setAttribute('value', 'SEND');
  EL.captchaButton.classList.add('captcha-button');
  EL.captchaContainer.appendChild(EL.captchaButton);

  EL.captchaButton.addEventListener('click', (event) => {
    if(thisCaptcha.ready) checkCaptcha();
  });

  EL.link.addEventListener('click', (event) => {
    showCaptcha(EL.captchaContainer, event);
  });

  EL.overlay.addEventListener('click', (event) => {
    EL.overlay.classList.remove('show');
  });

  EL.captchaContainer.addEventListener('click', (event) => {
    event.stopPropagation();
  });
});

function constrain(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function showCaptcha(el, event) {
  const padding = 5;
  const maxLeft = EL.overlay.offsetWidth - el.offsetWidth;
  const maxTop = EL.overlay.offsetHeight - el.offsetHeight;
  const centerLeft = (event.clientX - el.offsetWidth / 2);
  const centerTop = (event.clientY - el.offsetHeight / 2);
  el.style.left =  constrain(centerLeft, padding, maxLeft - padding) + 'px';
  el.style.top =  constrain(centerTop, padding, maxTop - padding) + 'px';
  EL.overlay.classList.add('show');
}

function getCaptcha() {
  mHttpGet.open('GET', API_URL);
  mHttpGet.send();
}

function checkCaptcha() {
  EL.captchaButton.classList.remove('show');
  mHttpPost.open('POST', API_URL);
  mHttpPost.send(JSON.stringify({
    token: thisCaptcha.token,
    phrase: EL.captchaInput.value
  }));
}

function setImage(el, img64) {
  EL.loader.classList.remove('show');
  el.style.backgroundImage = `url("${img64}")`;
  EL.captchaButton.classList.add('show');
}

function unsetImage(el) {
  el.style.backgroundImage = '';
  EL.loader.classList.add('show');
  EL.captchaButton.classList.remove('show');
}
