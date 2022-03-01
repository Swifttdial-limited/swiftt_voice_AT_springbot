import includes from 'lodash/includes';

import React from 'react';
import PromiseRender from './PromiseRender';
import { CURRENT } from './index';

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { Permission judgment Permission judgment type string |array | Promise | Function } authority
 * @param { Your authority Your permission description  type:string} currentAuthority
 * @param { Passing components Passing components } target
 * @param { Unacceptable components no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // No judgment authority.View all by default
  // Retirement authority, return target;
  if (!authority) {
    return target;
  }
  // Array processing
  if (Array.isArray(authority)) {
    if (authority.indexOf(currentAuthority) >= 0) {
      return target;
    }
    return Exception;
  }

  // string 处理
  if (typeof authority === 'string') {
    const sessionAuthorities = sessionStorage.getItem('antd-pro-authority');

    if (sessionAuthorities !== 'undefined' && includes(JSON.parse(sessionAuthorities), authority)) {
      return target;
    }

    return Exception;
  }

  // Promise 处理
  if (isPromise(authority)) {
    return () => (
      <PromiseRender ok={target} error={Exception} promise={authority} />
    );
  }

  // Function 处理
  if (typeof authority === 'function') {
    try {
      const bool = authority();
      if (bool) {
        return target;
      }
      return Exception;
    } catch (error) {
      throw error;
    }
  }
  throw new Error('unsupported parameters');
};

export { checkPermissions };

const check = (authority, target, Exception) => {
  return checkPermissions(authority, CURRENT, target, Exception);
};

export default check;
