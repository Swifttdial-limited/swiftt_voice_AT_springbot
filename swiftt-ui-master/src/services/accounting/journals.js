import pathToRegexp from 'path-to-regexp';
import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const { journals, reports, customerInvoice, customerInvoices } = accounting;
const {
  creditNotes,
  creditNote,
  creditNoteLines,
  debitNotes,
  debitNote,
  debitNoteLines,
  journalEntries,
  manualJournalEntries,
  manualEntriesLines,
  pettyCashEntries,
  pettyCashEntriesLines,
  bankingEntriesLines,
  bankingEntries,
  customerRefundEntries,
  vendorPayments,
  vendorPayment,
  vendorPaymentLines,
} = journals;
const { trialBalance, customerStatement, customerAging,vendorAging, vendorStatement } = reports;

////////////////////////////////////////////////////////////////////
export async function queryCreditNoteEntries(params) {
  return request(creditNotes, {
    method: 'GET',
    body: params,
  });
}

export async function queryCreditNote(params) {
  return request(pathToRegexp.compile(creditNote)(params), {
    method: 'GET',
    body: params,
  });
}


export async function queryCreditNoteEntryLines(params) {
  return request(pathToRegexp.compile(creditNoteLines)(params), {
    method: 'GET',
    body: params,
  });
}

export async function queryDebitNoteEntries(params) {
  return request(debitNotes, {
    method: 'GET',
    body: params,
  });
}

export async function queryDebitNote(params) {
  return request(pathToRegexp.compile(debitNote)(params), {
    method: 'GET',
    body: params,
  });
}


export async function queryDebitNoteEntryLines(params) {
  return request(pathToRegexp.compile(debitNoteLines)(params), {
    method: 'GET',
    body: params,
  });
}

////////////////////////////////////////////////////////////////////

export async function queryCustomerRefundEntries(params) {
  return request(customerRefundEntries, {
    method: 'GET',
    body: params,
  });
}

export async function queryCustomerRefundEntryLines(params) {
  return request(pathToRegexp.compile(manualEntriesLines)(params), {
    method: 'GET',
    body: params,
  });
}

export async function queryManualEntries(params) {
  return request(manualJournalEntries, {
    method: 'GET',
    body: params,
  });
}

export async function queryManualEntryLines(params) {
  return request(pathToRegexp.compile(manualEntriesLines)(params), {
    method: 'GET',
    body: params,
  });
}

export async function queryBankingEntries(params) {
  return request(bankingEntries, {
    method: 'GET',
    body: params,
  });
}
export async function queryPettyCashEntries(params) {
  return request(pettyCashEntries, {
    method: 'GET',
    body: params,
  });
}

export async function queryBankingEntryLines(params) {
  return request(pathToRegexp.compile(bankingEntriesLines)(params), {
    method: 'GET',
    body: params,
  });
}

export async function queryPettyCashLines(params) {
  return request(pathToRegexp.compile(pettyCashEntriesLines)(params), {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(journalEntries, {
    method: 'POST',
    body: params,
  });
}

export async function query(params) {
  return request(journalEntries, {
    method: 'GET',
    body: params,
  });
}

export async function queryTrialBalanceReport(params) {
  return request(trialBalance, {
    method: 'GET',
    body: params,
  });
}

////////////////////////////////////////////////////
export async function queryVendorPaymentEntries(params) {
  return request(vendorPayments, {
    method: 'GET',
    body: params,
  });
}

export async function queryVendorPayment(params) {
  return request(pathToRegexp.compile(vendorPayment)(params), {
    method: 'GET',
    body: params,
  });
}

export async function queryVendorPaymentEntryLines(params) {
  return request(pathToRegexp.compile(vendorPaymentLines)(params), {
    method: 'GET',
    body: params,
  });
}

export async function queryCustomerInvoices(params) {
  return request(pathToRegexp.compile(customerInvoices)(params), {
    method: 'GET',
    body: params,
  });
}


export async function queryCustomerStatement(params) {
  return request(pathToRegexp.compile(customerStatement)(params), {
    method: 'GET',
    body: params,
  });
}

export async function queryCustomerAging(params) {
  return request(pathToRegexp.compile(customerAging)(params), {
    method: 'GET',
    body: params,
  });
}


export async function queryVendorStatement(params) {
  return request(pathToRegexp.compile(vendorStatement)(params), {
    method: 'GET',
    body: params,
  });
}


export async function queryVendorAging(params) {
  return request(pathToRegexp.compile(vendorAging)(params), {
    method: 'GET',
    body: params,
  });
}

export async function queryCustomerInvoiceLines(params) {
  return request(pathToRegexp.compile(customerInvoice)(params), {
    method: 'GET',
    body: params,
  });
}
