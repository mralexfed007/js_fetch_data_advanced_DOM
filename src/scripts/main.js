'use strict';

const phoneArr = ['wef', 'wef', 'wef', 'samsung-gem', 'dell-venue',
  'motorola-xoom-with-wi-fi', '2', 'sanyo-zio', 't-mobile-mytouch-4g'];
const body = document.querySelector('body');
const BASE_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';
const request = (url) => {
  return fetch(`${BASE_URL}${url}`);
};

function getFirstReceivedDetails(idPhoneArr) {
  const firstReceivedArr = idPhoneArr.map(id => request(`${id}.json`));

  return Promise.race(firstReceivedArr).then(phone => phone.json());
}

function getAllSuccessfulDetails(idPhoneArr) {
  const allSuccessfulArr = idPhoneArr.map(id => {
    return request(`${id}.json`).then(res => res.json());
  });

  return Promise.allSettled(allSuccessfulArr);
}

function getThreeFastestDetails(idPhoneArr) {
  const threeFastestArr = idPhoneArr.map(id => request(`${id}.json`));

  return new Promise((resolve) => {
    const promArr = [];

    for (const promise of threeFastestArr) {
      promise.then((result) => {
        promArr.push(result);

        if (promArr.length === 3) {
          resolve(promArr);
        }
      });
    }
  }).then(arr => arr.map(res => res.json()))
    .then(res => Promise.allSettled(res));
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
  } else if (data.length === 3) {
    div.className = 'three-first';
    h3.textContent = 'Three Fastest';
    div.append(h3);

    for (const phone of data) {
      div.insertAdjacentHTML('beforeend', `
    <ul>
      <li>${phone.id}</li>
      <li>${phone.name}</li>
    </ul>
    `);
    }
    body.prepend(div);
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

const firstRecive = getFirstReceivedDetails(phoneArr);
const allSuccsses = getAllSuccessfulDetails(phoneArr)
  .then(results => results.filter(res => res.status === 'fulfilled')
    .map(res => res.value));
const threeFastest = getThreeFastestDetails(phoneArr)
  .then(results => results.map(res => res.value));

firstRecive.then(notification);
allSuccsses.then(notification);
threeFastest.then(notification);
