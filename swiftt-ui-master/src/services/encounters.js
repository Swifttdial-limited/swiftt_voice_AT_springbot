import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { encounterProfile, billing } = api;
const { invoices } = billing;
const {
  encounter,
  encounterDischargeSummaries,
  encounterActions,
  encounterDiagnoses,
  encounterDiagnosis,
  encounterNotes,
  encounters,
  medications,
  medication,
  medicalSupplies,
  medicalSupply,
  requests,
} = encounterProfile;

export async function query(params) {
  return request(encounters, {
    method: 'GET',
    body: params,
  });
}

export async function queryEncountersCount(params) {
  return request('/api/v1/encounters/action/countNewToday', {
    method: 'GET',
    body: params,
  });
}

export async function queryOne(params) {
  return request(pathToRegexp.compile(encounter)(params), {
    method: 'GET',
  });
}

export async function applyAction(params) {
  console.log('service applyAction');
  return request(pathToRegexp.compile(encounterActions)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request('', {
    method: 'PATCH',
    body: params,
  });
}

// ///////////////////////////////////////////////////
export async function createEncounterDiagnosis(params) {
  return request(pathToRegexp.compile(encounterDiagnoses)(params), {
    method: 'POST',
    body: params.encounterDiagnoses,
  });
}

export async function queryEncounterDiagnoses(params) {
  return request(pathToRegexp.compile(encounterDiagnoses)(params), {
    method: 'GET',
  });
}

export async function deleteEncounterDiagnosis(params) {
  return request(pathToRegexp.compile(encounterDiagnosis)(params), {
    method: 'DELETE',
  });
}

/////////////////////////////////////////////////////
export async function queryDischargeSummaries(params) {
  return request(pathToRegexp.compile(encounterDischargeSummaries)(params), {
    method: 'GET',
  });
}

// ///////////////////////////////////////////////////
export async function createNote(params) {
  return request(pathToRegexp.compile(encounterNotes)(params), {
    method: 'POST',
    body: params,
  });
}

export async function queryNotes(params) {
  return request(pathToRegexp.compile(encounterNotes)(params), {
    method: 'GET',
  });
}

// //////////////////////////////////////////////////
export async function createRequest(params) {
  return request(pathToRegexp.compile(requests)(params), {
    method: 'POST',
    body: params.requests,
  });
}

export async function queryRequests(params) {
  return request(pathToRegexp.compile(requests)(params), {
    method: 'GET',
  });
}

export async function createEncounterInvoices(params) {
  return request(pathToRegexp.compile(invoices)(params), {
    method: 'POST',
    body: params,
  });
}

// ///////////////////////////////////////////////////
export async function createMedication(params) {
  return request(pathToRegexp.compile(medications)(params), {
    method: 'POST',
    body: params,
  });
}

export async function queryMedications(params) {
  return request(pathToRegexp.compile(medications)(params), {
    method: 'GET',
  });
}

export async function updateMedication(params) {
  return request(pathToRegexp.compile(medication)(params), {
    method: 'GET',
  });
}

export async function deleteMedication(params) {
  return request(pathToRegexp.compile(medication)(params), {
    method: 'DELETE',
  });
}

// ///////////////////////////////////////////////////
export async function createMedicalSupply(params) {
  return request(pathToRegexp.compile(medicalSupplies)(params), {
    method: 'POST',
    body: params,
  });
}

export async function queryMedicalSupplies(params) {
  return request(pathToRegexp.compile(medicalSupplies)(params), {
    method: 'GET',
  });
}

export async function updateMedicalSupply(params) {
  return request(pathToRegexp.compile(medicalSupply)(params), {
    method: 'GET',
  });
}

export async function deleteMedicalSupply(params) {
  return request(pathToRegexp.compile(medicalSupply)(params), {
    method: 'DELETE',
  });
}
