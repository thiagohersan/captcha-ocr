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

const TEXT = {
  submit: {
    en: 'ENTER',
    pt: 'ENTRAR'
  },
  instruction: {
    en: 'Type phrase here',
    pt: 'Escreva a frase aqui'
  },
  error: {
    en: 'Try again',
    pt: 'Tente novamente'
  }
}

setLanguage();
getCaptcha();

mHttpGet.onreadystatechange = (err) => {
  if (mHttpGet.readyState == 4 && mHttpGet.status == 200) {
    const res = JSON.parse(mHttpGet.responseText);
    if (res.success && res.image.startsWith('data:image/jpeg;base64,')) {
      if (!thisCaptcha.ready) {
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
    if (res.success && res.url.length > 0) {
      EL.captchaMessage.classList.remove('error-1984');
      EL.captchaInput.value = '';
      window.location.href = res.url;
    } else {
      EL.captchaMessage.classList.add('error-1984');
      EL.captchaMessage.innerHTML = TEXT.error[API.lang];
      checkAndGetNextCaptcha();
    }
  }
};

window.addEventListener('load', () => {
  EL.link = document.getElementById('my-link-1984');

  EL.overlay = document.createElement('div');
  EL.overlay.classList.add('overlay-1984');
  document.body.appendChild(EL.overlay);

  EL.captchaContainer = document.createElement('div');
  EL.captchaContainer.classList.add('captcha-container-1984');
  EL.overlay.appendChild(EL.captchaContainer);

  EL.captchaImage = document.createElement('div');
  EL.captchaImage.classList.add('captcha-image-1984');
  EL.captchaContainer.appendChild(EL.captchaImage);
  EL.captchaImage.style.height = window.getComputedStyle(EL.captchaImage).getPropertyValue('width');

  EL.loader = document.createElement('div');
  EL.loader.classList.add('loader-1984', 'show-1984');
  EL.captchaImage.appendChild(EL.loader);

  EL.captchaInput = document.createElement('textarea');
  EL.captchaInput.setAttribute('rows', '3');
  EL.captchaInput.setAttribute('placeholder', TEXT.instruction[API.lang]);
  EL.captchaInput.classList.add('captcha-input-1984');
  EL.captchaContainer.appendChild(EL.captchaInput);

  EL.captchaMessage = document.createElement('div');
  EL.captchaMessage.classList.add('captcha-message-1984');
  EL.captchaMessage.innerHTML = '.';
  EL.captchaContainer.appendChild(EL.captchaMessage);

  EL.buttonContainer = document.createElement('div');
  EL.buttonContainer.classList.add('button-container-1984');
  EL.captchaContainer.appendChild(EL.buttonContainer);

  EL.refreshButton = document.createElement('button');
  EL.refreshButton.classList.add('captcha-button-1984');
  EL.buttonContainer.appendChild(EL.refreshButton);

  EL.captchaButton = document.createElement('button');
  EL.captchaButton.innerHTML = TEXT.submit[API.lang];
  EL.captchaButton.classList.add('captcha-button-1984');
  EL.buttonContainer.appendChild(EL.captchaButton);

  EL.refreshButtonImage = document.createElement('div');
  EL.refreshButtonImage.classList.add('button-image-1984');
  EL.refreshButtonImage.style.height = EL.captchaButton.offsetHeight + 'px';
  EL.refreshButtonImage.style.width = EL.captchaButton.offsetHeight + 'px';
  EL.refreshButton.appendChild(EL.refreshButtonImage);

  EL.link.addEventListener('click', (event) => {
    event.preventDefault();
    showCaptcha(event);
  });

  EL.captchaButton.addEventListener('click', (event) => {
    if (thisCaptcha.ready) checkCaptcha();
  });

  EL.refreshButton.addEventListener('click', (event) => {
    clearMessage();
    checkAndGetNextCaptcha();
  });

  EL.overlay.addEventListener('click', (event) => {
    hideCaptcha();
  });

  EL.captchaContainer.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.body.addEventListener('keydown', (event) => {
    if (!EL.overlay.classList.contains('show-1984')) return;

    if (event.key === 'Escape') {
      hideCaptcha();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (thisCaptcha.ready && EL.captchaButton.classList.contains('show-1984')) checkCaptcha();
    }
  });
});

function setLanguage() {
  API.lang = document.documentElement.getAttribute('lang') || 'en';
}

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
  EL.overlay.classList.add('show-1984');
  EL.captchaInput.focus();
  EL.captchaInput.setSelectionRange(0, 0);
}

function hideCaptcha() {
  EL.overlay.classList.remove('show-1984');
}

function getCaptcha() {
  mHttpGet.open('GET', `${API.URL}?lang=${API.lang}`);
  mHttpGet.send();
}

function checkAndGetNextCaptcha() {
  EL.captchaInput.value = '';
  if (!nextCaptcha.ready) {
    thisCaptcha.ready = false;
    unsetImage();
    hideButtons();
  } else {
    thisCaptcha.ready = nextCaptcha.ready;
    thisCaptcha.token = nextCaptcha.token;
    thisCaptcha.image = nextCaptcha.image;
    nextCaptcha.ready = false;
    setImage(thisCaptcha.image);
  }
  getCaptcha();
}

function showButtons() {
  EL.captchaButton.classList.add('show-1984');
  EL.refreshButton.classList.add('show-1984');
}

function hideButtons() {
  EL.captchaButton.classList.remove('show-1984');
  EL.refreshButton.classList.remove('show-1984');
}

function clearMessage() {
  EL.captchaMessage.classList.remove('error-1984');
}

function checkCaptcha() {
  hideButtons();
  clearMessage();
  EL.captchaMessage.innerHTML = '.';
  mHttpPost.open('POST', API.URL);
  mHttpPost.send(JSON.stringify({
    token: thisCaptcha.token,
    phrase: EL.captchaInput.value
  }));
}

function setImage(img64) {
  EL.loader.classList.remove('show-1984');
  EL.captchaImage.style.backgroundImage = `url("${img64}")`;
  showButtons();
  EL.captchaInput.focus();
  EL.captchaInput.setSelectionRange(0, 0);
}

function unsetImage() {
  EL.captchaImage.style.backgroundImage = '';
  EL.loader.classList.add('show-1984');
  hideButtons();
}
