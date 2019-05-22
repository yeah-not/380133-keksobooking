'use strict';

// Модуль загрузки превью изображений
// ----------

(function () {
  // Константы
  // ----------
  var IMG_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // Функции
  // ----------

  // Обработчики
  // ----------

  // DOM-элементы
  // ----------
  var fileChooser = document.querySelector('.ad-form-header__input');
  var preview = document.querySelector('.ad-form-header__preview img');

  // Старт
  // ----------
  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];

    if (file) {
      var fileName = file.name.toLowerCase();

      var isImageFile = IMG_FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
    }

    if (isImageFile) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function () {
        preview.src = fileReader.result;
      });

      fileReader.readAsDataURL(file);
    }
  });


  // Интерфейс
  // ----------

})();
