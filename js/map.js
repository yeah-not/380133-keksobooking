'use strict';

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

var getPin = function (avatars) {
  var pin = {
    author: {
      avatar: ''
    },
    offer: {
      title: PIN_TITLES[getRandomInt(0, PIN_TITLES.length - 1)],
      address: '',
      price: getRandomInt(1000, 1000000),
      type: PIN_TYPES[getRandomInt(0, PIN_TYPES.length - 1)],
      rooms: getRandomInt(1, 5),
      guests: getRandomInt(0, 50),
      checkin: PIN_CHECK_IN_OUT[getRandomInt(0, PIN_CHECK_IN_OUT.length - 1)],
      checkout: PIN_CHECK_IN_OUT[getRandomInt(0, PIN_CHECK_IN_OUT.length - 1)],
      features: PIN_FEATURES[getRandomInt(0, PIN_FEATURES.length - 1)],
      description: '',
      photos: [],
    },
    location: {
      x: getRandomInt(pinX[0], pinX[1]),
      y: getRandomInt(PIN_Y[0], PIN_Y[1])
    }
  };

  // 'avatar': Адреса изображений не повторяются
  var avatar = 0;

  do {
    avatar = getRandomInt(1, 8);
  } while (avatars.indexOf(avatar) >= 0);

  avatars.push(avatar);
  pin.author.avatar = 'img/avatars/user0' + avatar + '.png';

  // "address": строка, адрес предложения, вида "{{location.x}}, {{location.y}}", например, "600, 350"
  pin.offer.address = pin.location.x + ', ' + pin.location.y;

  // "photos": массив из строк расположенных в произвольном порядке
  var photos = [];
  var photo = '';

  for (var j = 0; j < PIN_PHOTOS.length; j++) {
    do {
      photo = PIN_PHOTOS[getRandomInt(0, PIN_PHOTOS.length - 1)];
    } while (photos.indexOf(photo) >= 0);
    photos[j] = photo;
  }

  pin.offer.photos = photos;

  // "features": массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner",
  var features = [];
  features = PIN_FEATURES.slice();
  features.length = getRandomInt(1, PIN_FEATURES.length);
  pin.offer.features = features;

  return pin;
}

var getPins = function () {
  var pins = [];
  var avatars = [];

  for (var i = 0; i < PINS_NUM; i++) {
    pins[i] = getPin(avatars);
  }

  return pins;
}

var PIN_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var PIN_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var PIN_CHECK_IN_OUT = ['12:00', '13:00', '14:00'];
var PIN_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PIN_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_Y = [130, 630];
var PINS_NUM = 8;

var map = document.querySelector('.map');
var pinX = [0, map.offsetWidth];

var pins = getPins();

var pinsListEl = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var pinEl = pinTemplate.cloneNode(true);
pinsListEl.appendChild(pinEl);

// console.log(getPins());

map.classList.remove('map--faded');


// Доработать
// "guests": число, случайное количество гостей, которое можно разместить
// "location": { «x»: Значение ограничено раз мерами блока, в котором перетаскивается метка.
