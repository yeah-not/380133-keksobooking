'use strict';

// Константы
// ----------
var ESC_KEYCODE = 27;
// var ENTER_KEYCODE = 13;

var ADVERTS_AMOUNT = 8;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_IN_OUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AVATAR_PATH = 'img/avatars/user';
var Y_RANGE = [130, 630];
var PIN_SIZES = {
  width: 50,
  height: 70
};
var MAIN_PIN_SIZES = {
  width: 65,
  height: 65,
  pointerHeight: 22
};
var LOCALE_RUS = {
  'palace': 'дворец',
  'flat': 'квартира',
  'house': 'дом',
  'bungalo': 'бунгало'
};

// Утилиты
// ----------
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

var numberWithSpaces = function (number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

var capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

var shuffleArray = function (srcArray) {
  var copiedArray = srcArray.slice();
  var destArray = [];

  while (copiedArray.length > 0) {
    var random = getRandomInt(0, copiedArray.length - 1);
    var element = copiedArray.splice(random, 1)[0];
    destArray.push(element);
  }

  return destArray;
};

var removeChildren = function (elem) {
  while (elem.lastChild) {
    elem.removeChild(elem.lastChild);
  }
};

var removeElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].remove();
  }
};

var setBoolAttributes = function (elements, attribute) {
  for (var i = 0; i < elements.length; i++) {
    elements[i][attribute] = true;
  }
};

var removeBoolAttributes = function (elements, attribute) {
  for (var i = 0; i < elements.length; i++) {
    elements[i][attribute] = false;
  }
};

var renderFragment = function (data, callback, template) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(callback(data[i], template));
  }

  return fragment;
};

// Функции
// ----------

// Объявления
var generateAdvert = function (index, data) {
  var advert = {
    author: {
      avatar: data.avatarPath + (index < 10 ? '0' : '') + (index + 1) + '.png'
    },
    offer: {
      title: data.titles[getRandomInt(0, data.titles.length - 1)],
      address: '',
      price: getRandomInt(1000, 1000000),
      type: data.types[getRandomInt(0, data.types.length - 1)],
      rooms: getRandomInt(1, 5),
      guests: getRandomInt(1, 25),
      checkin: data.checkInOut[getRandomInt(0, data.checkInOut.length - 1)],
      checkout: data.checkInOut[getRandomInt(0, data.checkInOut.length - 1)],
      features: data.features.slice(1, getRandomInt(0, data.features.length)),
      description: '',
      photos: shuffleArray(data.photos)
    },
    location: {
      x: getRandomInt(data.xRange[0], data.xRange[1]),
      y: getRandomInt(data.yRange[0], data.yRange[1])
    }
  };

  advert.offer.address = advert.location.x + ', ' + advert.location.y;

  return advert;
};

var generateAdverts = function (amount, data) {
  var adverts = [];

  for (var i = 0; i < amount; i++) {
    adverts[i] = generateAdvert(i, data);
  }

  return adverts;
};

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

  pin.style.left = (advert.location.x - PIN_SIZES.width / 2) + 'px';
  pin.style.top = advert.location.y + 'px';
  pinImg.src = advert.author.avatar;
  pinImg.alt = advert.offer.title;

  pin.addEventListener('click', function (evt) {
    onPinClick(evt, advert);
  });

  return pin;
};

var renderPins = function () {
  var adverts = generateAdverts(ADVERTS_AMOUNT, advertsData);
  var pinsFragment = renderFragment(adverts, renderPin, pinTemplate);
  pinsContainer.appendChild(pinsFragment);
};

var removePins = function () {
  var pins = pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
  removeElements(pins);
};

// Карточка
var renderCard = function (advert, template, locale) {
  var card = template.cloneNode(true);

  card.querySelector('.popup__title').textContent = advert.offer.title;
  card.querySelector('.popup__description').textContent = advert.offer.description;
  card.querySelector('.popup__text--address').textContent = advert.offer.address;
  card.querySelector('.popup__avatar').src = advert.author.avatar;
  card.querySelector('.popup__type').textContent = capitalizeFirstLetter(locale[advert.offer.type]);
  card.querySelector('.popup__text--price').textContent = numberWithSpaces(advert.offer.price, 3) + '₽/ночь';
  card.querySelector('.popup__text--capacity').textContent = getAdvertCapacity(advert.offer.rooms, advert.offer.guests);
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;

  var features = advert.offer.features;
  var featuresList = card.querySelector('.popup__features');
  var featureTemplate = template.querySelector('.popup__feature');

  featureTemplate.classList.remove(featureTemplate.classList[1]);
  removeChildren(featuresList);
  featuresList.appendChild(renderFragment(features, renderCardFeature, featureTemplate));

  var photos = advert.offer.photos;
  var photosList = card.querySelector('.popup__photos');
  var photoTemplate = template.querySelector('.popup__photo');

  removeChildren(photosList);
  photosList.appendChild(renderFragment(photos, renderCardPhoto, photoTemplate));

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
var deactivatePage = function () {
  deactivateMap();
  disableForm();
};

var activatePage = function () {
  refreshMap();
  activateMap();
  enableForm();
};

// Карта
var refreshMap = function () {
  removePins();
  removeCard();
  renderPins();
};

var deactivateMap = function () {
  map.classList.add('map--faded');
};

var activateMap = function () {
  map.classList.remove('map--faded');
};

// Форма
var disableForm = function () {
  form.classList.add('ad-form--disabled');
  setBoolAttributes(formFieldsets, 'disabled');
};

var enableForm = function () {
  formTitle.addEventListener('invalid', onFormTitleInvalid);
  formPrice.addEventListener('invalid', onFormPriceInvalid);

  form.addEventListener('submit', onFormSubmit);
  form.addEventListener('reset', onFormReset);
  formSubmit.addEventListener('click', onFormSubmitClick);

  form.classList.remove('ad-form--disabled');
  removeBoolAttributes(formFieldsets, 'disabled');
};

var setAddressByPin = function (isPinActive) {
  var marginTop = MAIN_PIN_SIZES.height / 2;
  var marginLeft = MAIN_PIN_SIZES.width / 2;

  if (isPinActive) {
    marginTop = MAIN_PIN_SIZES.height + MAIN_PIN_SIZES.pointerHeight;
  }

  var location = {
    x: mainPin.offsetLeft + marginLeft,
    y: mainPin.offsetTop + marginTop
  };

  formAddress.value = location.x + ', ' + location.y;
};

// Обработчики
// ----------
var onMainPinMouseUp = function () {
  setAddressByPin(true);

  if (isPageActive) {
    refreshMap();
  } else {
    activatePage();
  }
};

var onPinClick = function (evt, advert) {
  evt.preventDefault();
  insertCard(advert);
};

var onCardCloseClick = function (evt) {
  evt.preventDefault();
  removeCard();
};

var onEscPressForCard = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    removeCard();
  }
};

var onFormSubmit = function (evt) {
  evt.preventDefault();

  console.log('Submit');
};

var onFormSubmitClick = function () {
  form.classList.add('ad-form--validate');
};

var onFormReset = function () {
  form.classList.remove('ad-form--validate');
};

var onFormTitleInvalid = function (evt) {
  var target = evt.target;
};

var onFormPriceInvalid = function (evt) {
  var target = evt.target;
};

// DOM-элементы
// ----------
var map = document.querySelector('.map');
var pinsContainer = document.querySelector('.map__pins');
var filtersContainer = document.querySelector('.map__filters-container');
var mainPin = document.querySelector('.map__pin--main');

var form = document.querySelector('.ad-form');
var formSubmit = form.querySelector('.ad-form__submit');
var formFieldsets = form.querySelectorAll('.ad-form__element');
var formAddress = form.querySelector('#address');
var formTitle = form.querySelector('#title');
var formType = form.querySelector('#type');
var formPrice = form.querySelector('#price');
var formTimein = form.querySelector('#timein');
var formTimeout = form.querySelector('#timeout');
var formRooms = form.querySelector('#room_number');
var formCapacity = form.querySelector('#capacity');

// TEMP:
// formTitle.required = false;
// formPrice.required = false;

// Шаблоны
// ----------
var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');

// Данные
// ----------
var isPageActive = false;
var xRange = [PIN_SIZES.width / 2, map.offsetWidth - PIN_SIZES.width / 2];
var locale = LOCALE_RUS;
var advertsData = {
  titles: TITLES,
  types: TYPES,
  checkInOut: CHECK_IN_OUT,
  features: FEATURES,
  photos: PHOTOS,
  avatarPath: AVATAR_PATH,
  dimensions: [PIN_SIZES.width, PIN_SIZES.height],
  xRange: xRange,
  yRange: Y_RANGE,
};

// Старт программы
// ----------
deactivatePage();
setAddressByPin(false);
mainPin.addEventListener('mouseup', onMainPinMouseUp);

// TEMP:
activatePage();
