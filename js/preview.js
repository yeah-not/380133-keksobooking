'use strict';

// Модуль загрузки превью изображений
// ----------

(function () {
  // Константы
  // ----------
  var IMG_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // Функции
  // ----------
  var choosePreview = function (file, callback) {
    if (file) {
      var fileName = file.name.toLowerCase();
      var isImageFile = IMG_FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
    }

    if (isImageFile) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function () {
        callback(fileReader.result);
      });

      fileReader.readAsDataURL(file);
    }
  };

  var setPreview = function (previewElement, imdDataURL) {
    previewElement.src = imdDataURL;
  };


  // Обработчики
  // ----------


  // DOM-элементы
  // ----------
  var avatarChooser = document.querySelector('.ad-form-header__input');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');

  var adPhotoChooser = document.querySelector('.ad-form__input');
  var adPhotoPreview = document.querySelector('.ad-form__photo img');

  // Старт
  // ----------
  avatarChooser.addEventListener('change', function () {
    choosePreview(avatarChooser.files[0], setPreview.bind(avatarChooser, avatarPreview));
  });

  adPhotoChooser.addEventListener('change', function () {
    choosePreview(adPhotoChooser.files[0], setPreview.bind(adPhotoChooser, adPhotoPreview));
  });

  // Интерфейс
  // ----------

})();
