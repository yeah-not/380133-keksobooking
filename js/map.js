'use strict';

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

var NOTICE_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var NOTICE_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var NOTICE_CHECK_IN_OUT = ['12:00', '13:00', '14:00'];
var NOTICE_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var NOTICE_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var NOTICE_Y = [130, 630];
var NOTICE_X = [0, 500];
var NOTICES_NUM = 8;

var map = document.querySelector('.map');
var noticeX = [0, map.offsetWidth]

var notices = [];
var avatars = [];
var features = [];

for (var i = 0; i < NOTICES_NUM; i++) {
  notices[i] = {
    author: {
      avatar: ''
    },
    offer: {
      title: NOTICE_TITLES[getRandomInt(0, NOTICE_TITLES.length - 1)],
      address: '',
      price: getRandomInt(1000, 1000000),
      type: NOTICE_TYPES[getRandomInt(0, NOTICE_TYPES.length - 1)],
      rooms: getRandomInt(1, 5),
      guests: getRandomInt(0, 50),
      checkin: NOTICE_CHECK_IN_OUT[getRandomInt(0, NOTICE_CHECK_IN_OUT.length - 1)],
      checkout: NOTICE_CHECK_IN_OUT[getRandomInt(0, NOTICE_CHECK_IN_OUT.length - 1)],
      features: NOTICE_FEATURES[getRandomInt(0, NOTICE_FEATURES.length - 1)],
      description: '',
      photos: [],
    },
    location: {
      x: getRandomInt(noticeX[0], noticeX[1]),
      y: getRandomInt(NOTICE_Y[0], NOTICE_Y[1])
    }
  };

  // 'avatar': Адреса изображений не повторяются
  var avatar = 0;

  do {
    avatar = getRandomInt(1, 8);
  } while (avatars.indexOf(avatar) >= 0);

  avatars[i] = avatar;
  notices[i].author.avatar = 'img/avatars/user0' + avatars[i] + '.png';

  // "address": строка, адрес предложения, вида "{{location.x}}, {{location.y}}", например, "600, 350"
  notices[i].offer.address = notices[i].location.x + ', ' + notices[i].location.y;

  // "photos": массив из строк расположенных в произвольном порядке
  var photos = [];
  var photo = '';

  for (var j = 0; j < NOTICE_PHOTOS.length; j++) {
    var k = 0;
    do {
      photo = NOTICE_PHOTOS[getRandomInt(0, NOTICE_PHOTOS.length - 1)];
    } while (photos.indexOf(photo) >= 0);
    photos[j] = photo;
  }

  notices[i].offer.photos = photos;

  // "features": массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner",
  features = NOTICE_FEATURES.slice();
  features.length = getRandomInt(1, NOTICE_FEATURES.length);
  notices[i].offer.features = features;

  console.log(notices[i]);
}

map.classList.remove('map--faded');


// Доработать
// "guests": число, случайное количество гостей, которое можно разместить
// "location": { «x»: Значение ограничено раз мерами блока, в котором перетаскивается метка.
