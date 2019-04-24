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
    var positionRangeX = window.data.mainPin.position.rangeX;
    var positionRangeY = window.data.mainPin.position.rangeY;

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

    if (offsetTop >= positionRangeY.min && offsetTop <= positionRangeY.max) {
      mainPin.style.top = offsetTop + 'px';
    }

    if (offsetLeft >= positionRangeX.min && offsetLeft <= positionRangeX.max) {
      mainPin.style.left = offsetLeft + 'px';
    }

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
  var mainPin = document.querySelector('.map__pin--main');

  // Старт программы
  // ----------
  var startCoords = {};

  mainPin.addEventListener('mousedown', onMainPinMouseDown);
})();
