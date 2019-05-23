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

  var readFile = function (file, previewImage) {
    if (!file) {
      return false;
    }

    var fileReader = new FileReader();

    fileReader.addEventListener('load', onFileReaderLoad.bind(this, previewImage));

    fileReader.readAsDataURL(file);
  };

  var setPreview = function (previewImage, imageData) {
    previewImage.src = imageData;
  }

  var renderPreviews = function (files, previewTemplate, previewsContainer) {
    for (var key in files) {
      if (files.hasOwnProperty(key)) {
        var file = files[key];

        var previewElement = previewTemplate.cloneNode(true);
        var previewImage = previewElement.querySelector('img');

        readFile(chooseFile(file), previewImage);

        previewsContainer.appendChild(previewElement);
      }
    }
  }

  // Обработчики
  // ----------
  var onFileChooserChange = function (previewTemplate, previewsContainer, evt) {
    renderPreviews(evt.target.files, previewTemplate, previewsContainer);
  };

  var onFileReaderLoad = function (previewImage, evt) {
    setPreview(previewImage, evt.currentTarget.result);
  };

  // DOM-элементы
  // ----------
  var avatarChooser = document.querySelector('.ad-form-header__input');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');

  var photoChooser = document.querySelector('.ad-form__input');
  var photoPreview = document.querySelector('.ad-form__photo img');

  var photoContainer = document.querySelector('.ad-form__photo-container');
  var template = document.querySelector('template');
  var photoTemplate = template.content.querySelector('.ad-form__photo');

  // Старт
  // ----------
  avatarChooser.addEventListener('change', onFileChooserChange.bind(this, avatarPreview));
  // photoChooser.addEventListener('change', onFileChooserChange.bind(this, photoTemplate, photoContainer));

  // Интерфейс
  // ----------

})();
