'use strict';

(function () {
  // Константы
  // ----------
  var ESC_KEYCODE = 27;
  // var ENTER_KEYCODE = 13;

  // Интерфейс
  // ----------
  window.util = {
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    },
    getRandomElement: function (array) {
      return array[this.getRandomInt(0, array.length - 1)];
    },
    getFormatedPrice: function (number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    capitalizeFirstLetter: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    shuffleArray: function (srcArray) {
      var copiedArray = srcArray.slice();
      var destArray = [];

      while (copiedArray.length > 0) {
        var randomIndex = this.getRandomInt(0, copiedArray.length - 1);
        var element = copiedArray.splice(randomIndex, 1)[0];
        destArray.push(element);
      }

      return destArray;
    },
    removeChildren: function (elem) {
      while (elem.lastChild) {
        elem.removeChild(elem.lastChild);
      }
    },
    removeElements: function (elements) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].remove();
      }
    },
    setTrueInAttributes: function (elements, attribute) {
      for (var i = 0; i < elements.length; i++) {
        elements[i][attribute] = true;
      }
    },
    setFalseInAttributes: function (elements, attribute) {
      for (var i = 0; i < elements.length; i++) {
        elements[i][attribute] = false;
      }
    },
    renderFragment: function (data, callback, template) {
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < data.length; i++) {
        fragment.appendChild(callback(data[i], template));
      }

      return fragment;
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        if (typeof(action) === 'object') {
          var actions = action;
          for (var method in actions) {
            if (actions.hasOwnProperty(method)) {
              actions[method]();
            }
          }
        } else {
          action();
        }
      }
    }
  };
})();
