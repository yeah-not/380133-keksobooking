'use strict';

// Главная метка
// ----------

(function () {
  // Константы
  // ----------

  // Обработчики
  // ----------
  var onMainPinMouseUp = function () {
    setAddressByPin(true);

    if (isPageActive) {
      refreshMap(false);
    } else {
      activatePage();
    }
  };

  // DOM-элементы
  // ----------
  var mainPin = document.querySelector('.map__pin--main');

  // Старт программы
  // ----------
  mainPin.addEventListener('mouseup', onMainPinMouseUp);
})();
