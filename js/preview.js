'use strict';

// Модуль загрузки превью изображений
// ----------

(function () {
  // Константы
  // ----------
  var IMG_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // Функции
  // ----------
  var choosePreview = function (files, callback) {
    var filesArr = Object.values(files);

    filesArr.forEach(function (file, index) {
      if (file) {
        var fileName = file.name.toLowerCase();
        var isImageFile = IMG_FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });
      }

      if (isImageFile) {
        var fileReader = new FileReader();

        fileReader.addEventListener('load', function () {
          callback(fileReader.result, index);
        });

        fileReader.readAsDataURL(file);
      }
    });
  };

  var setPreview = function (previewImage, imageDataURL) {
    previewImage.src = imageDataURL;
  };

  var renderPreview = function (previewSelector, previewContainer, imageDataURL) {
    var previewElement = document.querySelector(previewSelector + ':empty');
    var previewTemplate = template.content.querySelector(previewSelector);
    var previewImage;

    if (previewElement) {
      previewImage = previewTemplate.querySelector('img').cloneNode();

      previewElement.appendChild(previewImage);
    } else {
      previewElement = previewTemplate.cloneNode(true);
      previewImage = previewElement.querySelector('img');

      previewContainer.appendChild(previewElement);
    }

    setPreview(previewImage, imageDataURL);
  };

  // Обработчики
  // ----------
  var onAvatarChooserChange = function (evt) {
    choosePreview(evt.target.files, setPreview.bind(evt.target, avatarPreview));
  };

  var onAdPhotoChooserChange = function (evt) {
    choosePreview(evt.target.files, renderPreview.bind(evt.target, adPhotoSelector, adPhotoContainer));
  };

  // DOM-элементы
  // ----------
  var avatarChooser = document.querySelector('.ad-form-header__input');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');

  var adPhotoChooser = document.querySelector('.ad-form__input');
  var adPhotoContainer = document.querySelector('.ad-form__photo-container');
  var adPhotoSelector = '.ad-form__photo';

  var template = document.querySelector('template');

  // Интерфейс
  // ----------
  window.preview = {
    enable: function () {
      avatarChooser.disabled = false;
      adPhotoChooser.disabled = false;

      avatarChooser.addEventListener('change', onAvatarChooserChange);
      adPhotoChooser.addEventListener('change', onAdPhotoChooserChange);
    },
    disable: function () {
      avatarChooser.disabled = true;
      adPhotoChooser.disabled = true;

      avatarChooser.removeEventListener('change', onAvatarChooserChange);
      adPhotoChooser.removeEventListener('change', onAdPhotoChooserChange);
    },
  }
})();
