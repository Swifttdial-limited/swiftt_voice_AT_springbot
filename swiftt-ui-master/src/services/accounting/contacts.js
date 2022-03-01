import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config'; import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const {
  contacts,
  contact,
  contactIdentifications,
  contactIdentification,
  contactPerson,
  contactPersons
} = accounting;

export async function query(params) {
  return request(contacts, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(contacts, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(contact)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(contact)(params), {
    method: 'PATCH',
    body: params,
  });
}

// /////////////////////////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(contact)(params), {
    method: 'GET',
  });
}

// ////////////////////////////////////////////////////////
export async function queryContactIdentification(params) {
  return request(pathToRegexp.compile(contactIdentifications)(params), {
    method: 'GET',
  });
}

export async function createContactIdentification(params) {
  return request(pathToRegexp.compile(contactIdentifications)(params), {
    method: 'POST',
    body: params,
  });
}

export async function removeContactIdentification(params) {
  return request(pathToRegexp.compile(contactIdentification)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function updateContactIdentification(params) {
  return request(pathToRegexp.compile(contactIdentification)(params), {
    method: 'PATCH',
    body: params,
  });
}


// ////////////////////////////////////////////////////////
export async function queryContactPerson(params) {
  return request(pathToRegexp.compile(contactPersons)(params), {
    method: 'GET',
  });
}

export async function createContactPerson(params) {
  return request(pathToRegexp.compile(contactPersons)(params), {
    method: 'POST',
    body: params,
  });
}

export async function removeContactPerson(params) {
  return request(pathToRegexp.compile(contactPerson)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function updateContactPerson(params) {
  return request(pathToRegexp.compile(contactPerson)(params), {
    method: 'PATCH',
    body: params,
  });
}
