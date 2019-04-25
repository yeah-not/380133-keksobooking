'use strict';

// Функции
// ----------

// Страница
var initPage = function () {
  window.pin.saveDefaultPosition(mainPin);
  setAddressByPin(false);
  window.util.initForm(adForm);

  window.pin.onActive = function (advert) {
    window.card.insert(advert);
  };

  window.pin.onDeactive = function () {
    window.card.remove();
  };
};

var deactivatePage = function () {
  deactivateMap();
  disableAdForm();
};

var activatePage = function () {
  refreshMap(false);
  activateMap();
  enableAdForm();
};

// Карта
var refreshMap = function (reset) {
  window.pin.removeAll();
  window.card.remove();

  if (!reset) {
    window.pin.renderAll();
  } else {
    window.pin.movePinToDefaultPosition(mainPin);
  }
};

var deactivateMap = function () {
  map.classList.add('map--faded');
};

var activateMap = function () {
  map.classList.remove('map--faded');
};

// Форма
var disableAdForm = function () {
  adForm.classList.add('ad-form--disabled');
  window.util.setTrueInAttributes(adFormFieldsets, 'disabled');

  adForm.removeEventListener('submit', onAdFormSubmit);
  adForm.removeEventListener('reset', onAdFormReset);
  adFormSubmit.removeEventListener('click', onAdFormSubmitClick);
  adFormType.removeEventListener('change', onAdFormTypeChange);
  adFormTimeIn.removeEventListener('change', onAdFormTimeInChange);
  adFormTimeOut.removeEventListener('change', onAdFormTimeOutChange);
  adFormRooms.removeEventListener('change', onAdFormRoomsChange);
};

var enableAdForm = function () {

  adForm.addEventListener('submit', onAdFormSubmit);
  adForm.addEventListener('reset', onAdFormReset);
  adFormSubmit.addEventListener('click', onAdFormSubmitClick);
  adFormType.addEventListener('change', onAdFormTypeChange);
  adFormTimeIn.addEventListener('change', onAdFormTimeInChange);
  adFormTimeOut.addEventListener('change', onAdFormTimeOutChange);
  adFormRooms.addEventListener('change', onAdFormRoomsChange);

  adForm.classList.remove('ad-form--disabled');
  window.util.setFalseInAttributes(adFormFieldsets, 'disabled');
};

var showAdFormErrors = function () {
  adForm.classList.add('ad-form--validate');
};

var hideAdFormErrors = function () {
  adForm.classList.remove('ad-form--validate');
};

var showSuccessMsg = function () {
  success.classList.remove('hidden');
  document.addEventListener('click', onClickForSuccess);
  document.addEventListener('keydown', onEscPressForSuccess);
};

var hideSuccessMsg = function () {
  success.classList.add('hidden');
  document.removeEventListener('click', onClickForSuccess);
  document.removeEventListener('keydown', onEscPressForSuccess);
};

var resetAdForm = function () {
  hideAdFormErrors();

  window.util.clearForm(adForm);
  refreshMap(true);
  deactivatePage();
};

var submitAdForm = function () {
  adForm.reset();
  showSuccessMsg();
};

var setAddressByPin = function (isPinActive) {
  var mainPinWidth = window.data.mainPin.sizes.width;
  var mainPinHeight = window.data.mainPin.sizes.width;
  var mainPinPointerHeight = window.data.mainPin.sizes.width;

  var marginTop = mainPinHeight / 2;
  var marginLeft = mainPinWidth / 2;

  if (isPinActive) {
    marginTop = mainPinHeight + mainPinPointerHeight;
  }

  var location = {
    x: mainPin.offsetLeft + marginLeft,
    y: mainPin.offsetTop + marginTop
  };

  adFormAddress.value = location.x + ', ' + location.y;
};


// Обработчики
// ----------

var onClickForSuccess = function () {
  hideSuccessMsg();
};

var onEscPressForSuccess = function (evt) {
  window.util.isEscEvent(evt, hideSuccessMsg);
};

var onAdFormSubmit = function (evt) {
  evt.preventDefault();
  submitAdForm();
};

var onAdFormSubmitClick = function () {
  showAdFormErrors();
};

var onAdFormReset = function (evt) {
  evt.preventDefault();
  resetAdForm();
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
var map = document.querySelector('.map');
var filtersContainer = document.querySelector('.map__filters-container');
var mainPin = document.querySelector('.map__pin--main');
var success = document.querySelector('.success');

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

// Шаблоны
// ----------

// Данные
// ----------
var isPageActive = false;
var locale = window.data.locales.ru;

// Старт программы
// ----------
deactivatePage();
initPage();
