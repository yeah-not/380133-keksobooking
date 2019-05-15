'use strict';
(function () {
  // Константы
  // ----------

  // Функции
  // ----------

  // Обработчики
  // ----------
  var onFilterElementChange = function () {
    console.log(this.value);
  }

  // Элементы
  // ----------
  var filtersForm = document.querySelector('.map__filters');
  var filtersElements = filtersForm.querySelectorAll('[name]');

  // Старт
  // ----------
  filtersElements.forEach(function(filterElement){
    filterElement.addEventListener('change', onFilterElementChange);
  });

  // Интерфейс
  // ----------
  window.filters = {

  };

})();
