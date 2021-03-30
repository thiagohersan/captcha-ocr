const API = {
  URL: 'https://tbglhpigzk.execute-api.us-east-1.amazonaws.com/dev/captcha',
  lang: 'en'
};

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

API.lang = (new URL(location.href)).searchParams.get('lang') || 'en';
getCaptcha();

mHttpGet.onreadystatechange = (err) => {
  if (mHttpGet.readyState == 4 && mHttpGet.status == 200) {
    const res = JSON.parse(mHttpGet.responseText);
    if(res.success && res.image.startsWith('data:image/jpeg;base64,')) {
      if(!thisCaptcha.ready) {
        thisCaptcha.ready = true;
        thisCaptcha.token = res.token;
        thisCaptcha.image = res.image;
        setImage(thisCaptcha.image);
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
      //window.location.href = res.url;
      EL.captchaMessage.classList.remove('error');
      EL.captchaMessage.classList.add('ok');
      EL.captchaMessage.innerHTML = 'OK !';
      setTimeout(() => window.location.href = window.location.href, 1000);
    } else {
      EL.captchaMessage.classList.remove('ok');
      EL.captchaMessage.classList.add('error');
      EL.captchaMessage.innerHTML = 'Try again';
      if(!nextCaptcha.ready) {
        thisCaptcha.ready = false;
        unsetImage();
        EL.captchaButton.classList.remove('show');
      } else {
        thisCaptcha.ready = nextCaptcha.ready;
        thisCaptcha.token = nextCaptcha.token;
        thisCaptcha.image = nextCaptcha.image;
        nextCaptcha.ready = false;
        setImage(thisCaptcha.image);
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

  EL.captchaInput = document.createElement('textarea');
  EL.captchaInput.setAttribute('rows', '3');
  EL.captchaInput.setAttribute('placeholder', 'enter phrase here');
  EL.captchaInput.classList.add('captcha-input');
  EL.captchaContainer.appendChild(EL.captchaInput);

  EL.captchaMessage = document.createElement('div');
  EL.captchaMessage.classList.add('captcha-message');
  EL.captchaMessage.innerHTML = '.';
  EL.captchaContainer.appendChild(EL.captchaMessage);

  EL.captchaButton = document.createElement('input');
  EL.captchaButton.setAttribute('type', 'button');
  EL.captchaButton.setAttribute('value', 'SEND');
  EL.captchaButton.classList.add('captcha-button');
  EL.captchaContainer.appendChild(EL.captchaButton);

  EL.link.addEventListener('click', (event) => {
    showCaptcha(event);
  });

  EL.captchaButton.addEventListener('click', (event) => {
    if(thisCaptcha.ready) checkCaptcha();
  });

  EL.overlay.addEventListener('click', (event) => {
    hideCaptcha();
  });

  EL.captchaContainer.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.body.addEventListener('keydown', (event) => {
    if (!EL.overlay.classList.contains('show')) return;

    if (event.key === 'Escape') {
      hideCaptcha();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if(thisCaptcha.ready && EL.captchaButton.classList.contains('show')) checkCaptcha();
    }
  });
});

function constrain(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function showCaptcha(event) {
  const padding = 5;
  const maxLeft = EL.overlay.offsetWidth - EL.captchaContainer.offsetWidth;
  const maxTop = EL.overlay.offsetHeight - EL.captchaContainer.offsetHeight;
  const centerLeft = (event.clientX - EL.captchaContainer.offsetWidth / 2);
  const centerTop = (event.clientY - EL.captchaContainer.offsetHeight / 2);
  EL.captchaContainer.style.left =  constrain(centerLeft, padding, maxLeft - padding) + 'px';
  EL.captchaContainer.style.top =  constrain(centerTop, padding, maxTop - padding) + 'px';
  EL.overlay.classList.add('show');
  EL.captchaInput.focus();
  EL.captchaInput.setSelectionRange(0, 0);
}

function hideCaptcha() {
  EL.overlay.classList.remove('show');
}

function getCaptcha() {
  mHttpGet.open('GET', `${API.URL}?lang=${API.lang}`);
  mHttpGet.send();
}

function checkCaptcha() {
  EL.captchaButton.classList.remove('show');
  EL.captchaMessage.classList.remove('error', 'ok');
  EL.captchaMessage.innerHTML = '.';
  mHttpPost.open('POST', API.URL);
  mHttpPost.send(JSON.stringify({
    token: thisCaptcha.token,
    phrase: EL.captchaInput.value
  }));
}

function setImage(img64) {
  EL.loader.classList.remove('show');
  EL.captchaImage.style.backgroundImage = `url("${img64}")`;
  EL.captchaButton.classList.add('show');
  EL.captchaInput.focus();
  EL.captchaInput.setSelectionRange(0, 0);
}

function unsetImage() {
  EL.captchaImage.style.backgroundImage = '';
  EL.loader.classList.add('show');
  EL.captchaButton.classList.remove('show');
}
