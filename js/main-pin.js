'use strict';

// Главная метка
// ----------

(function () {
  // Константы
  // ----------

  // Функции
  // ----------

  // Drag'n'drop
  var pickMainPin = function (evt) {
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    activateMap();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var moveMainPin = function (evt) {
    var shift = {
      x: evt.clientX - startCoords.x,
      y: evt.clientY - startCoords.y
    };

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var offsetTop = mainPin.offsetTop + shift.y;
    var offsetLeft = mainPin.offsetLeft + shift.x;

    if (offsetTop >= PIN_Y_RANGE.min && offsetTop <= PIN_Y_RANGE.max) {
      mainPin.style.top = offsetTop + 'px';
    }

    if (offsetLeft >= pinRangeX.min && offsetLeft <= pinRangeX.max) {
      mainPin.style.left = offsetLeft + 'px';
    }

    // if (offsetTop === PIN_Y_RANGE.max) debugger;
    setAddressByPin(true);
  };

  var putMainPin = function () {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    setAddressByPin(true);
    refreshMap(false);

    if (!isPageActive) {
      enableAdForm();
    }
  };

  // Обработчики
  // ----------
  var onMainPinMouseDown = function (evt) {
    pickMainPin(evt);
  };

  var onMouseMove = function (evt) {
    moveMainPin(evt);
  };

  var onMouseUp = function (evt) {
    putMainPin(evt);
  };

  // DOM-элементы
  // ----------
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');

  // Старт программы
  // ----------
  var startCoords = {};
  var pinRangeX = {
    min: 0,
    max: map.offsetWidth - MAIN_PIN_SIZES.width
  };

  mainPin.addEventListener('mousedown', onMainPinMouseDown);
})();
