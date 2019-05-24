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
    var previewEmpty = document.querySelector(previewSelector + ':empty');
    var previewTemplate = template.content.querySelector(previewSelector);

    if (!previewEmpty) {
      var previewElement = previewTemplate.cloneNode(true);
      var previewImage = previewElement.querySelector('img');

      previewContainer.appendChild(previewElement);
    } else {
      var previewElement = previewEmpty;
      var previewImageTemplate = previewTemplate.querySelector('img');
      var previewImage = previewImageTemplate.cloneNode();

      previewElement.appendChild(previewImage);
    }

    setPreview(previewImage, imageDataURL);

  };

  var renderPreviews = function () {

  }


  // Обработчики
  // ----------


  // DOM-элементы
  // ----------
  var avatarChooser = document.querySelector('.ad-form-header__input');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');

  var adPhotoChooser = document.querySelector('.ad-form__input');
  var adPhotoContainer = document.querySelector('.ad-form__photo-container');
  var adPhotoSelector = '.ad-form__photo';

  var template = document.querySelector('template');
  var adPhotoTemplate = template.content.querySelector('.ad-form__photo');

  // Старт
  // ----------
  avatarChooser.addEventListener('change', function () {
    choosePreview(avatarChooser.files, setPreview.bind(avatarChooser, avatarPreview));
  });

  adPhotoChooser.addEventListener('change', function () {
    // choosePreview(adPhotoChooser.files[0], setPreview.bind(adPhotoChooser, adPhotoPreview));
    // choosePreview(adPhotoChooser.files, renderPreview.bind(adPhotoChooser, adPhotoContainer, adPhotoTemplate));
    choosePreview(adPhotoChooser.files, renderPreview.bind(adPhotoChooser, adPhotoSelector, adPhotoContainer));
  });

  // Интерфейс
  // ----------

})();
