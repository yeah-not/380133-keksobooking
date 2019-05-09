'use strict';

// Модуль взаимодействия с сервером
// ----------

(function () {
  // Константы
  // ----------
  var STATUS_SUCCESS = 200;
  var TIMEOUT = 5000;
  var URL = 'https://js.dump.academy/keksobooking/';
  var URL_DATA = 'data/';

  // Функции
  // ----------
  var createXMLHttpRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_SUCCESS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    return xhr;
  };

  // TEMP:
  var onXHRSuccess = function (response) {
    console.log(response);
  };

  var onXHRError = function (message) {
    console.log(message);
  };

  // Интерфейс
  // ----------
  window.backend = {
    load: function (onSuccess, onError) {
      var xhr = createXMLHttpRequest(onSuccess, onError);

      xhr.open('GET', URL + URL_DATA);
      xhr.send();
    },
    upload: function (data, onSuccess, onError) {
      var xhr = createXMLHttpRequest(onSuccess, onError);

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };

  // TEMP:
  window.backend.load(onXHRSuccess, onXHRError);
})();
