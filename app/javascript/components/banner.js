import Typed from 'typed.js';

function loadDynamicBannerText() {
  new Typed('#banner-typed-text', {
    strings: ["Language is not a barrier anymore", "Stay connected"],
    typeSpeed: 50,
    loop: true
  });
}

export { loadDynamicBannerText };


