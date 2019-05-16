'use strict';

(function () {
  // Константы
  // ----------
  var ESC_KEYCODE = 27;
  // var ENTER_KEYCODE = 13;

  // Интерфейс
  // ----------
  window.util = {
    // Общие
    getRandomInt: function (min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },
    getRandomElement: function (array) {
      return array[this.getRandomInt(0, array.length - 1)];
    },
    getRandomProperty: function (object) {
      var keys = Object.keys(object);
      return object[keys[Math.floor(keys.length * Math.random())]];
    },
    getFormatedPrice: function (number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    capitalizeFirstLetter: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    isEmpty: function (obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
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
    randomizeArray: function (srcArray) {
      var destArray = [];

      srcArray.forEach(function (value) {
        if (this.getRandomInt(0, 1)) {
          destArray.push(value);
        }
      }, this);

      return destArray;
    },

    // DOM-элементы
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

    // Форма
    initForm: function (form) {
      var elements = form.elements;

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var value = element.value;
        var placeholder = element.placeholder;
        var checked = element.checked;

        if (value) {
          element.dataset.initValue = value;
        }

        if (placeholder) {
          element.dataset.initPlaceholder = placeholder;
        }

        if (checked) {
          element.dataset.initChecked = checked;
        }
      }
    },
    clearForm: function (form) {
      var elements = form.elements;

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var initValue = element.dataset.initValue;
        var initPlaceholder = element.dataset.initPlaceholder;
        var initChecked = element.dataset.initChecked;

        if ('value' in element) {
          if (initValue) {
            element.value = initValue;
          } else {
            element.value = '';
          }
        }

        if ('placeholder' in element) {
          if (initPlaceholder) {
            element.placeholder = initPlaceholder;
          } else {
            element.placeholder = '';
          }
        }

        if ('checked' in element) {
          if (initChecked) {
            element.checked = initChecked;
          } else {
            element.checked = false;
          }
        }
      }
    },
    setFormElementLimitByAnother: function (srcElement, destElement, type, rules) {
      var value = rules[srcElement.value];
      destElement.min = value;
      destElement.placeholder = value;
    },
    syncSelects: function (srcSelect, destSelect) {
      destSelect.selectedIndex = srcSelect.selectedIndex;
    },
    setSelectLimitsByAnother: function (srcSelect, destSelect, rules) {
      var destVariants = rules[srcSelect.value];
      var destOptions = destSelect.querySelectorAll('option');

      for (var i = 0; i < destOptions.length; i++) {
        var option = destOptions[i];

        if (destVariants.indexOf(option.value) >= 0) {
          option.disabled = false;
          option.selected = true;
        } else {
          option.disabled = true;
        }
      }
    },

    // События
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        if (typeof action === 'object') {
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
