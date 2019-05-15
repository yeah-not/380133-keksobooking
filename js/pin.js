'use strict';

(function () {
  // Константы
  // ----------

  // Функции
  // ----------
  var updateAll = function () {
    renderAll(advertsData, window.data.advertsNum);
  };

  var renderOne = function (advert, template) {
    var pin = template.cloneNode(true);
    var pinImg = pin.querySelector('img');
    var pinWidth = window.data.pin.sizes.width;

    pin.style.left = (advert.location.x - pinWidth / 2) + 'px';
    pin.style.top = advert.location.y + 'px';
    pinImg.src = advert.author.avatar;
    pinImg.alt = advert.offer.title;

    pin.addEventListener('click', function (evt) {
      onPinClick(evt, advert);
    });

    return pin;
  };

  var renderAll = function (adverts, amount) {
    if (amount) {
      adverts = window.util.shuffleArray(adverts).slice(0, amount);
    }
    var pinsFragment = window.util.renderFragment(adverts, renderOne, pinTemplate);
    pinsContainer.appendChild(pinsFragment);

    document.addEventListener('keydown', onEscPress);
  };

  var activate = function (pin, advert) {
    deactivate();
    pin.classList.add('map__pin--active');

    window.pin.onActive(advert);
  };

  var deactivate = function () {
    var pin = map.querySelector('.map__pin--active');
    if (pin) {
      pin.classList.remove('map__pin--active');
    }

    window.pin.onDeactive();
  };

  // Обработчики
  // ----------
  var onPinClick = function (evt, advert) {
    evt.preventDefault();
    var pin = evt.currentTarget;

    if (!pin.classList.contains('map__pin--active')) {
      activate(pin, advert);
    } else {
      deactivate();
    }
  };

  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, deactivate);
  };

  var onXHRSuccess = function (response) {
    advertsData = response;
    updateAll();
  };

  var onXHRError = function (message) {
    window.message.append('error', message);
  };

  // DOM-элементы
  // ----------
  var map = document.querySelector('.map');
  var pinsContainer = document.querySelector('.map__pins');

  // Шаблоны
  // ----------
  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');

  // Старт программы
  // ----------
  var advertsData = [];

  // Интерфейс
  // ----------
  window.pin = {
    loadAll: function () {
      // var advertsData = window.data.generateAdverts(window.data.advertsNum);
      // updateAll();
      window.backend.load(onXHRSuccess, onXHRError);
    },
    removeAll: function () {
      var pins = pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
      window.util.removeElements(pins);

      document.removeEventListener('keydown', onEscPress);
    },
    saveDefaultPosition: function (pin) {
      var left = pin.offsetLeft;
      var top = pin.offsetTop;

      pin.dataset.defaultLeft = left + 'px';
      pin.dataset.defaultTop = top + 'px';
    },
    movePinToDefaultPosition: function (pin) {
      var left = pin.dataset.defaultLeft;
      var top = pin.dataset.defaultTop;

      pin.style.left = left;
      pin.style.top = top;
    },
    deactivate: deactivate,
    onActive: function () {},
    onDeactive: function () {},
  };
})();
