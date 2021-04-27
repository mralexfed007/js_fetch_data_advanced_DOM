'use strict';

const body = document.querySelector('body');
const BASE_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';
const request = (url) => {
  return fetch(`${BASE_URL}${url}`);
};

function getAllId() {
  // eslint-disable-next-line max-len
  return fetch(`https://mate-academy.github.io/phone-catalogue-static/api/phones.json`)
    .then(res => res.json()).then(result => {
      const res = result.map(phone => phone.id);

      return res;
    });
}

function getFirstReceivedDetails() {
  return getAllId().then(res => res.map(id => request(`${id}.json`)))
    .then(res => Promise.race(res)).then(phone => phone.json());
}

function getAllSuccessfulDetails() {
  return getAllId().then(res => res.map(id => request(`${id}.json`)
    .then(result => result.json())))
    .then(allSuccessfulArr => Promise.allSettled(allSuccessfulArr));
}

function getThreeFastestDetails() {
  return getAllId().then(arr => arr.map(id => request(`${id}.json`)))
    .then(threeFastestArr => {
      return new Promise((resolve) => {
        const resArr = [];

        for (let i = 0; i < threeFastestArr.length; i++) {
          Promise.race(threeFastestArr).then(result => result.clone()
            .json()).then(res => {
            if (resArr.length < 3) {
              resArr.push(res);
            } else if (resArr.length === 3) {
              resolve(resArr);
            }
          });
        }
      });
    }).then(res => Promise.allSettled(res));
}

function createContainer(data, divClass, textContent) {
  const div = document.createElement('div');
  const h3 = document.createElement('h3');
  const phoneArr = [].concat(data);

  div.className = divClass;
  h3.textContent = textContent;
  div.append(h3);

  for (const phone of phoneArr) {
    div.insertAdjacentHTML('beforeend', `
  <ul>
    <li>${phone.id}</li>
    <li>${phone.name}</li>
  </ul>
  `);
  }
  body.prepend(div);
}

const firstRecive = getFirstReceivedDetails();
const allSuccsses = getAllSuccessfulDetails()
  .then(results => results.filter(res => res.status === 'fulfilled')
    .map(res => res.value));
const threeFastest = getThreeFastestDetails()
  .then(results => results.map(res => res.value));

firstRecive
  .then(res => createContainer(res, 'first-received', 'First Received'));

allSuccsses
  .then(res => createContainer(res, 'all-successful', 'All Successful'));

threeFastest.then(res => createContainer(res, 'three-first', 'Three Fastest'));
