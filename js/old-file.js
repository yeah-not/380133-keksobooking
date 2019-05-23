'use strict';

// Модуль работы input[type=file]
// ----------

(function () {
  // Константы
  // ----------

  // Функции
  // ----------
  var readOne = function (file, onSuccess) {
    var fileReader = new FileReader();

    fileReader.addEventListener('load', function () {
      onSuccess(fileReader.result);
    });

    fileReader.readAsDataURL(file);
  };

  var readAll = function (files, onSuccess) {
    for (var key in files) {
      if (files.hasOwnProperty(key)) {
        readOne(files[key], onSuccess);
      }
    }
  };

  // Обработчики
  // ----------

  // DOM-элементы
  // ----------

  // Старт
  // ----------

  // Интерфейс
  // ----------
  window.file = {
    readAll: readAll
  };
})();

var renderPreview = function (imageDataURL, template) {
  var preview = template.cloneNode(true);
  var previewImage = preview.querySelector('img');

  previewImage.src = imageDataURL;

  return preview;
};

var renderPreviews = function (previewsData, previewsContainer, previewTemplate) {
  var previewsFragment = window.util.renderFragment(previewsData, renderPreview, previewTemplate);
  previewsContainer.appendChild(previewsFragment);
}

var onFileReadSuccess = function (fileData) {
  previewsData.push(fileData);
  renderPreviews(previewsData, photoContainer, photoTemplate);
}

var previewsData = [];

var photoChooser = document.querySelector('.ad-form__input');
var photoContainer = document.querySelector('.ad-form__photo-container');

var template = document.querySelector('template');
var photoTemplate = template.content.querySelector('.ad-form__photo');

photoChooser.addEventListener('change', function (evt) {
  window.file.readAll(evt.target.files, onFileReadSuccess);
});
