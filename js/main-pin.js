'use strict';

// Главная метка
// ----------

(function () {
  // Константы
  // ----------

  // Функции
  // ----------

  // Drag'n'drop
  var take = function (evt) {
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    window.mainPin.onTake();
  };

  var move = function (evt) {
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

    window.mainPin.onMove();
  };

  var put = function () {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    window.mainPin.onPut();
  };

  // Обработчики
  // ----------
  var onMainPinMouseDown = function (evt) {
    take(evt);
  };

  var onMouseMove = function (evt) {
    move(evt);
  };

  var onMouseUp = function (evt) {
    put(evt);
  };

  // DOM-элементы
  // ----------
  var mainPin = document.querySelector('.map__pin--main');

  // Старт программы
  // ----------
  var startCoords = {};
  mainPin.addEventListener('mousedown', onMainPinMouseDown);

  window.mainPin = {
    getLocation: function (isPinActive) {
      var mainPinWidth = window.data.mainPin.sizes.width;
      var mainPinHeight = window.data.mainPin.sizes.width;
      var mainPinPointerHeight = window.data.mainPin.sizes.width;

      var marginTop = mainPinHeight / 2;
      var marginLeft = mainPinWidth / 2;

      if (isPinActive) {
        marginTop = mainPinHeight + mainPinPointerHeight;
      }

      var location = {
        x: mainPin.offsetLeft + marginLeft,
        y: mainPin.offsetTop + marginTop,
      };

      return location;
    },
    onTake: function () {},
    onMove: function () {},
    onPut: function () {},
  };
})();
