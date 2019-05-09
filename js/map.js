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
    window.pin.saveDefaultPosition(mainPin);
    window.adForm.init();
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
    };
  };

  var refreshMap = function (reset) {
    window.pin.removeAll();
    window.card.remove();

    if (!reset) {
      window.pin.renderAll();
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
