'use strict';

// Функции
// ----------

// Объявления

var getAdvertCapacity = function (rooms, guests) {
  var roomsRemainder = rooms % 10;
  var guestsRemainder = guests % 10;
  var roomsLabel = 'комната';
  var guestsLabel = 'гостя';

  if (roomsRemainder > 1 && roomsRemainder < 5) {
    roomsLabel = 'комнаты';
  } else if (roomsRemainder >= 5) {
    roomsLabel = 'комнат';
  }

  if (guestsRemainder > 1) {
    guestsLabel = 'гостей';
  }

  return rooms + ' ' + roomsLabel + ' для ' + guests + ' ' + guestsLabel;
};

// Метки
var renderPin = function (advert, template) {
  var pin = template.cloneNode(true);
  var pinImg = pin.querySelector('img');
  var pinWidth = window.data.pin.sizes.width;

  pin.style.left = (advert.location.x - pinWidth / 2) + 'px';
  pin.style.top = advert.location.y + 'px';
  pinImg.src = advert.author.avatar;
  pinImg.alt = advert.offer.title;

  pin.addEventListener('click', function (evt) {
    onPinClick(evt, advert);
  });

  return pin;
};

var renderPins = function () {
  var adverts = window.data.generateAdverts(window.data.advertsNum);
  var pinsFragment = window.util.renderFragment(adverts, renderPin, pinTemplate);
  pinsContainer.appendChild(pinsFragment);
};

var removePins = function () {
  var pins = pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
  window.util.removeElements(pins);
};

var savePinDefaultPosition = function (pin) {
  var left = pin.offsetLeft;
  var top = pin.offsetTop;

  pin.dataset.defaultLeft = left + 'px';
  pin.dataset.defaultTop = top + 'px';
};

var activatePin = function (pin) {
  pin.classList.add('map__pin--active');
};

var deactivatePin = function () {
  var pin = map.querySelector('.map__pin--active');
  if (pin) {
    pin.classList.remove('map__pin--active');
  }
};

// Карточка
var renderCard = function (advert, template, locale) {
  var card = template.cloneNode(true);

  card.querySelector('.popup__title').textContent = advert.offer.title;
  card.querySelector('.popup__description').textContent = advert.offer.description;
  card.querySelector('.popup__text--address').textContent = advert.offer.address;
  card.querySelector('.popup__avatar').src = advert.author.avatar;
  card.querySelector('.popup__type').textContent = window.util.capitalizeFirstLetter(locale[advert.offer.type]);
  card.querySelector('.popup__text--price').textContent = window.util.getFormatedPrice(advert.offer.price, 3) + '₽/ночь';
  card.querySelector('.popup__text--capacity').textContent = getAdvertCapacity(advert.offer.rooms, advert.offer.guests);
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;

  var features = advert.offer.features;
  var featuresList = card.querySelector('.popup__features');
  var featureTemplate = template.querySelector('.popup__feature');

  featureTemplate.classList.remove(featureTemplate.classList[1]);
  window.util.removeChildren(featuresList);
  featuresList.appendChild(window.util.renderFragment(features, renderCardFeature, featureTemplate));

  var photos = advert.offer.photos;
  var photosList = card.querySelector('.popup__photos');
  var photoTemplate = template.querySelector('.popup__photo');

  window.util.removeChildren(photosList);
  photosList.appendChild(window.util.renderFragment(photos, renderCardPhoto, photoTemplate));

  return card;
};

var renderCardFeature = function (featureName, template) {
  var feature = template.cloneNode();
  feature.classList.add(feature.classList[0] + '--' + featureName);
  return feature;
};

var renderCardPhoto = function (photoSrc, template) {
  var photo = template.cloneNode();
  photo.src = photoSrc;
  return photo;
};

var insertCard = function (advert) {
  removeCard();

  var card = renderCard(advert, cardTemplate, locale);
  map.insertBefore(card, filtersContainer);

  var cardClose = card.querySelector('.popup__close');
  cardClose.addEventListener('click', onCardCloseClick);
  document.addEventListener('keydown', onEscPressForCard);
};

var removeCard = function () {
  var card = map.querySelector('.map__card');

  if (card) {
    card.remove();
    document.removeEventListener('keydown', onEscPressForCard);
  }

};

// Страница
var initPage = function () {
  savePinDefaultPosition(mainPin);
  setAddressByPin(false);
  window.util.initForm(adForm);
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
  removePins();
  removeCard();

  if (!reset) {
    renderPins();
  } else {
    movePinToDefaultPosition(mainPin);
  }
};

var movePinToDefaultPosition = function (pin) {
  var left = pin.dataset.defaultLeft;
  var top = pin.dataset.defaultTop;

  pin.style.left = left;
  pin.style.top = top;
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

var onPinClick = function (evt, advert) {
  evt.preventDefault();
  var pin = evt.currentTarget;

  if (!pin.classList.contains('map__pin--active')) {
    deactivatePin();
    insertCard(advert);
    activatePin(pin);
  } else {
    removeCard();
    deactivatePin();
  }
};

var onCardCloseClick = function (evt) {
  evt.preventDefault();
  removeCard();
};

var onEscPressForCard = function (evt) {
  window.util.isEscEvent(evt, {1: removeCard, 2: deactivatePin});
};

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
var pinsContainer = document.querySelector('.map__pins');
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
var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');

// Данные
// ----------
var isPageActive = false;
var locale = window.data.locales.ru;

// Старт программы
// ----------
deactivatePage();
initPage();
