'use strict';

(function () {
  // Функции
  // ----------
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

  var applyFilter = function (adverts, prop, filter) {
    var filteredAdverts = adverts.filter(function (advert) {
      if (prop === 'price') {
        var valuesRange = window.data.filters.priceByFilter[filter];
        return advert.offer[prop] >= valuesRange.min && advert.offer[prop] <= valuesRange.max;
      } else {
        return advert.offer[prop] === filter;
      }
    });

    return filteredAdverts;
  };

  var applyFiltersArray = function (adverts, prop, subFilters) {
    var filteredAdverts = adverts;

    subFilters.forEach(function (subFilter) {
      filteredAdverts = filteredAdverts.filter(function (advert) {
        return advert.offer[prop].indexOf(subFilter) >= 0;
      });
    });

    return filteredAdverts;
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
    window.pin.updateAll();
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
      advertsData = window.data.generateAdverts(window.data.advertsNum);
      // advertsData = window.data.generateAdverts(20);
      this.updateAll();
      // window.backend.load(onXHRSuccess, onXHRError);
    },
    removeAll: function () {
      var pins = pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
      window.util.removeElements(pins);

      document.removeEventListener('keydown', onEscPress);
    },
    updateAll: function (filters) {
      var adverts = advertsData;

      if (filters) {
        for (var key in filters) {
          if (filters.hasOwnProperty(key)) {
            var filter = filters[key];

            if (Array.isArray(filter)) {
              adverts = applyFiltersArray(adverts, key, filter);
            } else {
              adverts = applyFilter(adverts, key, filter);
            }
          }
        }
      }

      renderAll(adverts, window.data.advertsNum);
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
