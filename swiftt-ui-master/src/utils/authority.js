import split from 'lodash/split';

// use sessionStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return sessionStorage.getItem('antd-pro-authority');
}

export function setAuthority(authority) {
  return sessionStorage.setItem('antd-pro-authority', authority);
}
