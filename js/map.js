'use strict';

// Главный модуль карты
// ----------

(function () {
  // Функции
  // ----------
  var setAddressByMainPin = function (isPinActive) {
    var location = window.mainPin.getLocation(isPinActive);
    window.adForm.setAddress(location);
  };

  // Страница
  var initMap = function () {
    disableMap();

    window.filters.deactivate();
    window.adForm.init();
    window.adForm.disable();
    window.preview.disable();

    window.pin.saveDefaultPosition(mainPin);
    setAddressByMainPin(false);

    window.pin.onActive = function (advert) {
      window.card.insert(advert);
    };

    window.pin.onDeactive = function () {
      window.card.remove();
    };

    window.adForm.onReset = function () {
      refreshMap(true);
      disableMap();
      window.filters.deactivate();
    };

    window.mainPin.onTake = function () {
      enableMap();
    };

    window.mainPin.onMove = function () {
      setAddressByMainPin(true);
    };

    window.mainPin.onPut = function () {
      refreshMap(false);
      setAddressByMainPin(true);
      window.adForm.enable();
      window.preview.enable();
      window.filters.activate();
    };

    window.filters.onChange = function () {
      window.util.debounce(function () {
        window.pin.removeAll();
        window.card.remove();
        window.pin.updateAll(window.filters.selected);
      });
    };
  };

  var refreshMap = function (reset) {
    window.pin.removeAll();
    window.card.remove();

    if (!reset) {
      window.pin.loadAll();
    } else {
      window.pin.movePinToDefaultPosition(mainPin);
    }
  };

  var disableMap = function () {
    map.classList.add('map--faded');
  };

  var enableMap = function () {
    map.classList.remove('map--faded');
  };

  // DOM-элементы
  // ----------
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');

  // Старт программы
  // ----------
  initMap();

})();
