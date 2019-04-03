'use strict';

// Константы
// ----------
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var ADVERTS_AMOUNT = 8;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_IN_OUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AVATAR_PATH = 'img/avatars/user';
var WIDTH = 50;
var HEIGHT = 70;
var Y_RANGE = [130, 630];
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

var toArray = function (collection) {
  var array = [];

  for (var i = 0; i < collection.length; i++) {
    array.push(collection[i]);
  }

  return array;
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

// Функции
// ----------
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

var renderFragment = function (data, callback, template) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(callback(data[i], template));
  }

  return fragment;
};

var renderPin = function (advert, template) {
  var pin = template.cloneNode(true);
  var pinImg = pin.querySelector('img');

  pin.style.left = (advert.location.x - WIDTH / 2) + 'px';
  pin.style.top = advert.location.y + 'px';
  pinImg.src = advert.author.avatar;
  pinImg.alt = advert.offer.title;

  return pin;
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

var setAddress = function (isPinActive) {
  var addressInput = advertForm.querySelector('#address');
  var pinHeight = Math.round(mainPin.offsetHeight / 2);
  var pinWidth = Math.round(mainPin.offsetWidth / 2);

  if (isPinActive) {
    pinHeight = mainPin.offsetHeight + 22;
  }

  var location = {
    x: mainPin.offsetLeft + pinWidth,
    y: mainPin.offsetTop + pinHeight
  };

  addressInput.value = location.x + ', ' + location.y;
};

// Обработчики
// ----------
var onMainPinMouseUp = function () {
  setAddress(true);
  activatePage();
};

var onEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeCard();
  }
};

var onEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    var target = evt.target;
    var cardClose = document.querySelector('.map__card .popup-close');

    if (target === cardClose) {
      closeCard();
    }
  }
};

var showCard = function (pins, adverts, evt) {
  var target = evt.currentTarget;
  var index = pins.indexOf(target);
  var advert = adverts[index];

  var oldCard = map.querySelector('.map__card');
  if (oldCard) {
    oldCard.remove();
  }

  var newCard = renderCard(advert, cardTemplate, locale);
  map.insertBefore(newCard, filtersContainer);

  var cardClose = newCard.querySelector('.popup__close');
  cardClose.addEventListener('click', closeCard);
  document.addEventListener('keydown', onEscPress);
};

var closeCard = function (evt) {
  var card = map.querySelector('.map__card');

  if (evt) {
    evt.preventDefault();
  }

  if (card) {
    card.remove();
    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('keydown', onEnterPress);
  }

};

var activatePage = function () {
  var oldPins = pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
  removeElements(oldPins);
  closeCard();

  var adverts = generateAdverts(ADVERTS_AMOUNT, advertsData);
  var pinsFragment = renderFragment(adverts, renderPin, pinTemplate);
  pinsContainer.appendChild(pinsFragment);

  var newPins = toArray(pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)'));
  for (var i = 0; i < newPins.length; i++) {
    newPins[i].addEventListener('click', function (evt) {
      showCard(newPins, adverts, evt);
    });
  }

  for (var j = 0; j < advertFormElements.length; j++) {
    advertFormElements[j].disabled = false;
  }

  document.addEventListener('keydown', onEnterPress);

  map.classList.remove('map--faded');
  advertForm.classList.remove('ad-form--disabled');
};

var deactivatePage = function () {
  map.classList.add('map--faded');
  advertForm.classList.add('ad-form--disabled');

  for (var i = 0; i < advertFormElements.length; i++) {
    advertFormElements[i].disabled = true;
  }

  document.removeEventListener('keydown', onEnterPress);
};

// Данные
// ----------
var map = document.querySelector('.map');
var xRange = [WIDTH / 2, map.offsetWidth - WIDTH / 2];

var locale = LOCALE_RUS;
var advertsData = {
  titles: TITLES,
  types: TYPES,
  checkInOut: CHECK_IN_OUT,
  features: FEATURES,
  photos: PHOTOS,
  avatarPath: AVATAR_PATH,
  dimensions: [WIDTH, HEIGHT],
  xRange: xRange,
  yRange: Y_RANGE,
};

// DOM-элементы
// ----------
var pinsContainer = document.querySelector('.map__pins');
var filtersContainer = document.querySelector('.map__filters-container');
var advertForm = document.querySelector('.ad-form');
var advertFormElements = advertForm.querySelectorAll('.ad-form__element');
var mainPin = document.querySelector('.map__pin--main');

// Шаблоны
// ----------
var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');

// Старт программы
// ----------
deactivatePage();
setAddress(false);
mainPin.addEventListener('mouseup', onMainPinMouseUp);
