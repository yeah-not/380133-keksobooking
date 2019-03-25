'use strict';

// Функции
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

var generateAdvert = function (avatars, data) {
  var advert = {
    author: {
      avatar: ''
    },
    offer: {
      title: data.titles[getRandomInt(0, TITLES.length - 1)],
      address: '',
      price: getRandomInt(1000, 1000000),
      type: data.types[getRandomInt(0, TYPES.length - 1)],
      rooms: getRandomInt(1, 5),
      guests: getRandomInt(1, 30),
      checkin: data.checkInOut[getRandomInt(0, CHECK_IN_OUT.length - 1)],
      checkout: data.checkInOut[getRandomInt(0, CHECK_IN_OUT.length - 1)],
      features: data.features[getRandomInt(0, FEATURES.length - 1)],
      description: '',
      photos: [],
    },
    location: {
      x: getRandomInt(data.xRange[0], data.xRange[1]),
      y: getRandomInt(data.yRange[0], data.yRange[1])
    }
  };

  // 'avatar': Адреса изображений не повторяются
  var avatar = 0;

  do {
    avatar = getRandomInt(1, 8);
  } while (avatars.indexOf(avatar) >= 0);

  avatars.push(avatar);
  advert.author.avatar = 'img/avatars/user0' + avatar + '.png';

  // "address": строка, адрес предложения, вида "{{location.x}}, {{location.y}}", например, "600, 350"
  advert.offer.address = advert.location.x + ', ' + advert.location.y;

  // "photos": массив из строк расположенных в произвольном порядке
  var photos = [];
  var photo = '';

  for (var j = 0; j < data.photos.length; j++) {
    do {
      photo = data.photos[getRandomInt(0, data.photos.length - 1)];
    } while (photos.indexOf(photo) >= 0);
    photos[j] = photo;
  }

  advert.offer.photos = photos;

  // "features": массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner",
  var features = data.features.slice();
  features.length = getRandomInt(1, data.features.length);
  advert.offer.features = features;

  return advert;
};

var generateAdverts = function (amount, data) {
  var adverts = [];
  var avatars = [];

  for (var i = 0; i < amount; i++) {
    adverts[i] = generateAdvert(avatars, data);
  }

  return adverts;
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

var renderPins = function (adverts, template) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < adverts.length; i++) {
    fragment.appendChild(renderPin(adverts[i], template));
  }

  return fragment;
};

var renderCard = function (advert) {
  var card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = advert.offer.title;
  card.querySelector('.popup__description').textContent = advert.offer.description;
  card.querySelector('.popup__avatar').src = advert.author.avatar;
  card.querySelector('.popup__type').textContent = TYPES_RUS[TYPES.indexOf(advert.offer.type)];
  card.querySelector('.popup__text--address').textContent = advert.offer.address;
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;

  // Русское название типа
  var advertTypeIndex = TYPES.indexOf(advert.offer.type);
  card.querySelector('.popup__type').textContent = TYPES_RUS[advertTypeIndex];

  // Цена с разбивкой на пробелы
  var price = numberWithSpaces(advert.offer.price, 3);
  card.querySelector('.popup__text--price').textContent = price + '₽/ночь';

  // Выведите количество гостейи комнат offer.rooms и offer.guests
  // в блок .popup__text--capacityстрокойвида {{offer.rooms}} комнаты для {{offer.guests}} гостей. Например,2 комнаты для 3 гостей.
  var roomsNum = advert.offer.rooms;
  var roomsNumRemainder = roomsNum % 10;
  var guestsNum = advert.offer.guests;
  var guestsNumRemainder = guestsNum % 10;
  var roomsLabel = 'комната';
  var guestsLabel = 'гостя';

  if (roomsNumRemainder > 1 && roomsNumRemainder < 5) {
    roomsLabel = 'комнаты';
  } else if (roomsNumRemainder >= 5) {
    roomsLabel = 'комнат';
  }

  if (guestsNumRemainder > 1) {
    guestsLabel = 'гостей';
  }

  card.querySelector('.popup__text--capacity').textContent = roomsNum + ' ' + roomsLabel + ' для ' + guestsNum + ' ' + guestsLabel;

  // .popup__features - все доступные удобства в объявлении списком
  var features = advert.offer.features;
  var featureTemplate = cardTemplate.querySelector('.popup__feature');
  var featuresList = card.querySelector('.popup__features');

  featureTemplate.classList.remove(featureTemplate.classList[1]);
  featuresList.innerHTML = '';

  for (var i = 0; i < features.length; i++) {
    var featureElement = featureTemplate.cloneNode();
    featureElement.classList.add(featureElement.classList[0] + '--' + features[i]);
    featuresList.appendChild(featureElement);
  }

  // .popup__photos - все фотографии из списка offer.photos
  var photos = advert.offer.photos;
  var photoTemplate = cardTemplate.querySelector('.popup__photo');
  var photosList = card.querySelector('.popup__photos');

  photosList.innerHTML = '';

  for (var j = 0; j < photos.length; j++) {
    var photoElement = photoTemplate.cloneNode();
    photoElement.src = photos[j];
    photosList.appendChild(photoElement);
  }

  return card;
};

// Константы
var ADVERTS_AMOUNT = 8;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TYPES_RUS = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
var CHECK_IN_OUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var WIDTH = 50;
var HEIGHT = 70;
var Y_RANGE = [130, 630];

// Переменные
var map = document.querySelector('.map');
var xRange = [WIDTH / 2, map.offsetWidth - WIDTH / 2];

// Данные
var advertsData = {
  titles: TITLES,
  types: TYPES,
  typesRus: TYPES_RUS,
  checkInOut: CHECK_IN_OUT,
  features: FEATURES,
  photos: PHOTOS,
  dimensions: [WIDTH, HEIGHT],
  xRange: xRange,
  yRange: Y_RANGE
};

// DOM-элементы
var pinsContainer = document.querySelector('.map__pins');
var filtersContainer = document.querySelector('.map__filters-container');
var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');

// ---
// Старт программы
// ---
var adverts = generateAdverts(ADVERTS_AMOUNT, advertsData);
pinsContainer.appendChild(renderPins(adverts, pinTemplate));

var firstCard = renderCard(adverts[0]);
map.insertBefore(firstCard, filtersContainer);

map.classList.remove('map--faded');


// Доработать
// "guests": число, случайное количество гостей, которое можно разместить
// "location": { «x»: Значение ограничено раз мерами блока, в котором перетаскивается метка.
// Координаты X и Y, которые вы вставите в разметку, это не координатылевого верхнего угла блока метки, а координаты, на которые указываетметка своим острым концом. Чтобы найти эту координату нужно учестьразмеры элемента с меткой.
