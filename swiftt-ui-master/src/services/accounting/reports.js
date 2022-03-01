import pathToRegexp from 'path-to-regexp';
import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const { reports } = accounting;
const {
  balanceSheetSummary,
  balanceSheetDetail,
  cashBook,
  cashiersCollectionSummary,
  cashierCollectionAnalysis,
  trialBalance,
  trialBalanceGroups,
  generalLedger,
  incomeStatementSummary,
  incomeStatementDetail,
  balanceSheetExport,
  balanceSheetSummaryExport,
} = reports;

export async function fetchBalanceSheetDetail(params) {
  return request(pathToRegexp.compile(balanceSheetDetail)(params), {
    method: 'GET',
    body: params,
  });
}


export async function fetchBalanceSheetSummary(params) {
  return request(pathToRegexp.compile(balanceSheetSummary)(params), {
    method: 'GET',
    body: params,
  });
}

export async function exportBalanceSheet(params) {
  return request(pathToRegexp.compile(balanceSheetExport)(params), {
    method: 'GET',
    body: params,
    file: true,
  });
}
export async function exportBalanceSheetSummary(params) {
  return request(pathToRegexp.compile(balanceSheetSummaryExport)(params), {
    method: 'GET',
    body: params,
    file: true,
  });
}


export async function fetchCashBook(params) {
  return request(pathToRegexp.compile(cashBook)(params), {
    method: 'GET',
    body: params,
  });
}

export async function fetchCashiersCollectionSummary(params) {
  return request(pathToRegexp.compile(cashiersCollectionSummary)(params), {
    method: 'GET',
    body: params,
  });
}

export async function fetchCashierCollectionAnalysis(params) {
  return request(pathToRegexp.compile(cashierCollectionAnalysis)(params), {
    method: 'GET',
    body: params,
  });
}

export async function fetchTrialBalance(params) {
  return request(pathToRegexp.compile(trialBalance)(params), {
    method: 'GET',
    body: params,
  });
}

export async function fetchTrialBalanceSummary(params) {
  return request(pathToRegexp.compile(trialBalanceGroups)(params), {
    method: 'GET',
    body: params,
  });
}


export async function fetchGeneralLedger(params) {
  return request(pathToRegexp.compile(generalLedger)(params), {
    method: 'GET',
    body: params,
  });
}


export async function fetchIncomeStatementDetail(params) {
  return request(pathToRegexp.compile(incomeStatementDetail)(params), {
    method: 'GET',
    body: params,
  });
}

export async function fetchIncomeStatementSummary(params) {
  return request(pathToRegexp.compile(incomeStatementSummary)(params), {
    method: 'GET',
    body: params,
  });
}
