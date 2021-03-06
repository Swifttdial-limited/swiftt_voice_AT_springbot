import classnames from 'classnames';

import config from './config';
import request from './request';

String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, function () {
    return arguments[1].toUpperCase();
  });
};

String.prototype.humpToHyphen = function () {
  return this
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase();
};

Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? o[k]
        : (`00${o[k]}`).substr((`${o[k]}`).length));
    }
  }
  return format;
};

module.exports = {
  config,
  request,
  classnames,
};
