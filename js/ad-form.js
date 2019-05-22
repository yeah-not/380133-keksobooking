'use strict';

(function () {
  // Функции
  // ----------
  var showErrors = function () {
    adForm.classList.add('ad-form--validate');
  };

  var hideErrors = function () {
    adForm.classList.remove('ad-form--validate');
  };

  var showSuccessMsg = function () {
    successMsg.classList.remove('hidden');
    document.addEventListener('click', onClickForSuccessMsg);
    document.addEventListener('keydown', onEscPressForSuccessMsg);
  };

  var hideSuccessMsg = function () {
    successMsg.classList.add('hidden');
    document.removeEventListener('click', onClickForSuccessMsg);
    document.removeEventListener('keydown', onEscPressForSuccessMsg);
  };

  var reset = function () {
    hideErrors();
    window.util.clearForm(adForm);
    window.adForm.disable();

    window.adForm.onReset();
  };

  // Обработчики
  // ----------
  var onXHRSuccess = function () {
    showSuccessMsg();
    reset();
  };

  var onXHRError = function (message) {
    window.message.append('error', message);
  };

  var onClickForSuccessMsg = function () {
    hideSuccessMsg();
  };

  var onEscPressForSuccessMsg = function (evt) {
    window.util.isEscEvent(evt, hideSuccessMsg);
  };

  var onAdFormSubmit = function (evt) {
    evt.preventDefault();
    var formData = new FormData(adForm);
    window.backend.upload(formData, onXHRSuccess, onXHRError);
  };

  var onAdFormSubmitClick = function () {
    showErrors();
  };

  var onAdFormReset = function (evt) {
    evt.preventDefault();
    reset();
  };

  var onAdFormTypeChange = function () {
    window.util.setFormElementLimitByAnother(adFormType, adFormPrice, 'min', window.data.form.minPriceByType);
  };

  var onAdFormTimeInChange = function () {
    window.util.syncSelects(adFormTimeIn, adFormTimeOut);
  };

  var onAdFormTimeOutChange = function () {
    window.util.syncSelects(adFormTimeOut, adFormTimeIn);
  };

  var onAdFormRoomsChange = function () {
    window.util.setSelectLimitsByAnother(adFormRooms, adFormCapacity, window.data.form.guestsByRooms);
  };

  // DOM-элементы
  // ----------
  var adForm = document.querySelector('.ad-form');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormFieldsets = adForm.querySelectorAll('.ad-form__element');
  var adFormAddress = adForm.querySelector('#address');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimeIn = adForm.querySelector('#timein');
  var adFormTimeOut = adForm.querySelector('#timeout');
  var adFormRooms = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var successMsg = document.querySelector('.success');

  // Интерфейс
  // ----------
  window.adForm = {
    init: function () {
      window.util.initForm(adForm);
      // this.disable();
    },
    disable: function () {
      adForm.classList.add('ad-form--disabled');
      window.util.setTrueInAttributes(adFormFieldsets, 'disabled');

      adForm.removeEventListener('submit', onAdFormSubmit);
      adForm.removeEventListener('reset', onAdFormReset);
      adFormSubmit.removeEventListener('click', onAdFormSubmitClick);
      adFormType.removeEventListener('change', onAdFormTypeChange);
      adFormTimeIn.removeEventListener('change', onAdFormTimeInChange);
      adFormTimeOut.removeEventListener('change', onAdFormTimeOutChange);
      adFormRooms.removeEventListener('change', onAdFormRoomsChange);
    },
    enable: function () {
      adForm.addEventListener('submit', onAdFormSubmit);
      adForm.addEventListener('reset', onAdFormReset);
      adFormSubmit.addEventListener('click', onAdFormSubmitClick);
      adFormType.addEventListener('change', onAdFormTypeChange);
      adFormTimeIn.addEventListener('change', onAdFormTimeInChange);
      adFormTimeOut.addEventListener('change', onAdFormTimeOutChange);
      adFormRooms.addEventListener('change', onAdFormRoomsChange);

      adForm.classList.remove('ad-form--disabled');
      window.util.setFalseInAttributes(adFormFieldsets, 'disabled');
    },
    setAddress: function (location) {
      adFormAddress.value = location.x + ', ' + location.y;
    },
    onReset: function () {},
  };
})();
