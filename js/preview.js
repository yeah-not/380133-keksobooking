'use strict';

// Модуль загрузки превью изображений
// ----------

(function () {
  // Константы
  // ----------
  var IMG_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // Функции
  // ----------
  var chooseFile = function (file) {
    if (file) {
      var fileName = file.name.toLowerCase();

      var isImageFile = IMG_FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
    }

    if (!isImageFile) {
      file = undefined;
    }

    return file;
  };

  var readFile = function (file, previewElement) {
    if (!file) {
      return false;
    }

    var fileReader = new FileReader();

    fileReader.addEventListener('load', onFileReaderLoad.bind(this, previewElement));

    fileReader.readAsDataURL(file);
  };

  var setPreview = function (previewElement, imageData) {
    previewElement.src = imageData;
  }

  // Обработчики
  // ----------
  var onFileChooserChange = function (previewElement, evt) {
    readFile(chooseFile(evt.target.files[0]), previewElement);
  };

  var onFileReaderLoad = function (previewElement, evt) {
    setPreview(previewElement, evt.currentTarget.result);
  };

  // DOM-элементы
  // ----------
  var avatarChooser = document.querySelector('.ad-form-header__input');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');

  var photoChooser = document.querySelector('.ad-form__input');
  var photoPreview = document.querySelector('.ad-form__photo img');

  // Старт
  // ----------
  avatarChooser.addEventListener('change', onFileChooserChange.bind(this, avatarPreview));
  photoChooser.addEventListener('change', onFileChooserChange.bind(this, photoPreview));

  // Интерфейс
  // ----------

})();
