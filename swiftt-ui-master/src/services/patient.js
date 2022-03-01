import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { patientProfile } = api;
const {
  encounters,
  patient,
  medicalHistoryEntries,
  medicalHistoryEntry,
  patientPreferences,
  patientPreferencesEntry,
} = patientProfile;

export async function query(params) {
  return request(pathToRegexp.compile(patient)(params), {
    method: 'GET',
  });
}

export async function remove(params) {
  return request('', {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(patient)(params), {
    method: 'PATCH',
    body: params,
  });
}

// /////////////////////////////////////////////////////
export async function createEncounter(params) {
  return request(pathToRegexp.compile(encounters)(params), {
    method: 'POST',
    body: params,
  });
}

export async function queryPatientEncounters(params) {
  return request(pathToRegexp.compile(encounters)(params), {
    method: 'GET',
    body: params,
  });
}
// //////////////////////////////////////////////////////////////
export async function createMedicalHistoryEntry(params) {
  return request(pathToRegexp.compile(medicalHistoryEntries)(params), {
    method: 'POST',
    body: params,
  });
}

export async function queryMedicalHistoryEntries(params) {
  return request(pathToRegexp.compile(medicalHistoryEntries)(params), {
    method: 'GET',
  });
}

export async function updateMedicalHistory(params) {
  return request(pathToRegexp.compile(medicalHistoryEntry)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function removeMedicalHistory(params) {
  return request(pathToRegexp.compile(medicalHistoryEntry)(params), {
    method: 'DELETE',
  });
}

//////////////////////////////////////////////////////////////////
export async function queryPatientPreferences(params) {
  return request(pathToRegexp.compile(patientPreferences)(params), {
    method: 'GET',
  });
}

export async function updatePatientPreferences(params) {
  return request(pathToRegexp.compile(patientPreferencesEntry)(params), {
    method: 'PATCH',
    body: params,
  });
}
