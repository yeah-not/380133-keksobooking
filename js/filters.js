'use strict';
(function () {
  // Константы
  // ----------

  // Функции
  // ----------


  // Обработчики
  // ----------
  var updateFilterFromSelect = function (filterName, filterValue) {
    filterName = filterName.replace('housing-', '');

    if (filterValue === 'any') {
      delete filters[filterName];
    } else {
      filters[filterName] = filterValue;
    }
  };

  var updateFilterFromCheckbox = function (filterName, filterValue, isChecked) {
    if (!filters[filterName]) {
      filters[filterName] = [];
    }

    var filterIndex = filters[filterName].indexOf(filterValue);

    if (isChecked && filterIndex < 0) {
      filters[filterName].push(filterValue);
    } else if (!isChecked && filterIndex >= 0) {
      filters[filterName].splice(filterIndex, 1);
    }
  };

  var onFilterElementChange = function (evt) {
    var curTarget = evt.currentTarget;
    var filterName = curTarget.name;
    var filterValue = curTarget.value;
    var filterType = curTarget.type;
    var isChecked = curTarget.checked;

    switch (filterType) {
      case 'select-one':
        updateFilterFromSelect(filterName, filterValue);
        break;
      case 'checkbox':
        updateFilterFromCheckbox(filterName, filterValue, isChecked);
        break;
      default:
    }
    console.log(filters);
  };

  // Элементы
  // ----------
  var filtersForm = document.querySelector('.map__filters');
  var filtersElements = filtersForm.querySelectorAll('[name]');

  // Старт
  // ----------
  var filters = {};

  // Интерфейс
  // ----------
  window.filters = {
    selected: filters,
    activate: function () {
      filtersElements.forEach(function (filterElement) {
        filterElement.disabled = false;
        filterElement.addEventListener('change', onFilterElementChange);
      });
    },
    deactivate: function () {
      filtersElements.forEach(function (filterElement) {
        filterElement.disabled = true;
        filterElement.removeEventListener('change', onFilterElementChange);
      });
    }
  };

})();
