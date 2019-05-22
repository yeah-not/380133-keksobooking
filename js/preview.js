'use strict';

// Модуль загрузки превью изображений
// ----------

(function () {
  // Константы
  // ----------
  var IMG_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // Функции
  // ----------
  var chooseFile = function () {
    var file = fileChooser.files[0];

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

  var readFile = function (file) {
    if (!file) {
      return false;
    }

    var fileReader = new FileReader();

    fileReader.addEventListener('load', onFileReaderLoad);

    fileReader.readAsDataURL(file);
  };

  var setPreview = function (imageData) {
    preview.src = imageData;
  }

  // Обработчики
  // ----------
  var onFileChooserChange = function () {
    readFile(chooseFile());
  };

  var onFileReaderLoad = function (evt) {
    setPreview(evt.currentTarget.result);
  };

  // DOM-элементы
  // ----------
  var fileChooser = document.querySelector('.ad-form-header__input');
  var preview = document.querySelector('.ad-form-header__preview img');

  // Старт
  // ----------
  fileChooser.addEventListener('change', onFileChooserChange);


  // Интерфейс
  // ----------

})();
