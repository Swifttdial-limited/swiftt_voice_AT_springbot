import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import store from '../index';
import config from './config';

const codeMessage = {
  200: 'The server successfully returned the requested data',
  201: 'New or modified data was successful. ',
  202: 'A request has been queued into the background (asynchronous task)',
  204: 'The data is deleted successfully. ',
  400: 'issued a request error, the server did not make new or modify data, the operation. ',
  401: 'The user does not have permission (token, username, password incorrect). ',
  403: 'User is authorized, but access is forbidden. ',
  404: 'issued a request for a non-existent record, the server did not operate',
  406: 'The format of the request is not available. ',
  410: 'The requested resource is permanently deleted and will not be available again. ',
  422: 'A validation error occurred while creating an object. ',
  500: 'server error occurred, please check the server',
  502: 'Gateway error',
  503: 'Service unavailable, server temporarily overloaded or maintained',
  504: 'Gateway timed out',
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let errortext = '';
    response.json().then((body) => {
      if (body.userMessage || body.error_description) {
        errortext = body.userMessage || body.error_description;
      } else {
        codeMessage[response.status];
      }
      notification.warning({
        message: 'Request failed',
        description: errortext,
        duration: 10,
        style: {
          marginTop: 30,
        },
      });
    });

    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {

  // TODO just for dashboard demo purposes
  if (url !== '/api/fake_chart_data') {
    url = config.API_URL + url;
  }

  const defaultOptions = {
    credentials: 'omit',
    referrer: 'no-referrer'
  };

  const newOptions = Object.assign({}, defaultOptions, options );

  if (newOptions.login === undefined) {
    const access_token = sessionStorage.getItem('o_t');
    newOptions.headers = {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/json, text/javascript, */*',
      'Content-Type': 'application/json',
    };

    if (newOptions.method === 'GET' && typeof newOptions.body === 'object') {
      if (stringify(newOptions.body, { indices: false }).length > 1) {
        url += `?${stringify(newOptions.body, { indices: false })}`;
      }

      delete newOptions.body;

    } else if (newOptions.method === 'POST' || newOptions.method === 'PATCH' ||
      newOptions.method === 'PUT') {
      newOptions.body = JSON.stringify(newOptions.body);
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {

      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      if(newOptions.file === true){
       return response.text();
      } else {
        return response.json();
      }
    })
    .catch((e) => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        // dispatch({
        //   type: 'login/logout',
        // });
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        // dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        // dispatch(routerRedux.push('/exception/404'));
      }
    });
}
