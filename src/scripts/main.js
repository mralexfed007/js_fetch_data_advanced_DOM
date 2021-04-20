'use strict';

const phoneArr = ['fail test blablabla', 'samsung-gem', 'dell-venue',
  'motorola-xoom-with-wi-fi', '2', 'sanyo-zio', 't-mobile-mytouch-4g'];
let arr = [];
const succssesArr = [];
const body = document.querySelector('body');
const BASE_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';
const request = (url) => {
  return fetch(`${BASE_URL}${url}`);
};

function getFirstReceivedDetails(idPhoneArr) {
  arr = idPhoneArr.map(id => request(`${id}.json`));

  return Promise.race(arr);
}

function getAllSuccessfulDetails(idPhoneArr) {
  arr = idPhoneArr.map(id => request(`${id}.json`));

  return Promise.allSettled(arr);
}

function notification(data) {
  const div = document.createElement('div');
  const h3 = document.createElement('h3');

  if (!data.length) {
    div.className = 'first-received';
    h3.textContent = 'First Received';
    div.append(h3);

    div.insertAdjacentHTML('beforeend', `
    <ul>
      <li>${data.id}</li>
      <li>${data.name}</li>
    </ul>
    `);
    body.append(div);
  } else {
    div.className = 'all-successful';
    h3.textContent = 'All Successful';
    div.append(h3);

    for (const phone of data) {
      div.insertAdjacentHTML('beforeend', `
    <ul>
      <li>${phone.id}</li>
      <li>${phone.name}</li>
    </ul>
    `);
    }
    body.append(div);
  }
}

getFirstReceivedDetails(phoneArr)
  .then(phone => phone.json())
  .then(notification);

const allSuccsses = getAllSuccessfulDetails(phoneArr).then(phoneArray => {
  for (const phone of phoneArray) {
    phone.value.json().then(phoneDetail => {
      succssesArr.push(phoneDetail);
    });
  }

  return succssesArr;
});

setTimeout(() => {
  allSuccsses.then(notification);
}, 1000);
