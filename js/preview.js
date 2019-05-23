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
  var avatarChooser = document.querySelector('.ad-form-header__input');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');

  // Старт
  // ----------
  avatarChooser.addEventListener('change', function (evt) {
    var file = evt.target.files[0];

    if (file) {
      var fileName = file.name.toLowerCase();
      var isImageFile = IMG_FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
    }

    if (isImageFile) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function () {
        avatarPreview.src = fileReader.result;
      });

      fileReader.readAsDataURL(file);
    }

  });

  // Интерфейс
  // ----------

})();
