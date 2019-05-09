'use strict';

// Модуль информационных сообщений
// ----------

(function () {
  // Константы
  // ----------
  var REMOVE_TIMEOUT = 5000;

  // Элементы и Шаблоны
  // ----------
  var messagePanel = document.querySelector('.message-panel');
  var template = document.querySelector('template');

  // Функции
  // ----------
  var remove = function (messageBar) {
    messagePanel.removeChild(messageBar);
  };

  // Обработчики
  // ----------
  var onMessageBarClick = function (evt) {
    var currentTarget = evt.currentTarget;
    remove(currentTarget);
  };

  // Интерфейс
  // ----------
  window.message = {
    append: function (type, text) {
      var messageTemplate = template.content.querySelector('.message-bar--' + type);
      var messageBar = messageTemplate.cloneNode(true);

      messageBar.querySelector('.message-bar__text').textContent = text;
      messageBar.addEventListener('click', onMessageBarClick);

      messagePanel.appendChild(messageBar);
      // setTimeout(remove, REMOVE_TIMEOUT, messageBar);
    }
  };
})();
