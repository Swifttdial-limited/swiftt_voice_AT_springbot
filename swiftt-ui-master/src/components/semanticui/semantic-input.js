const React = require('react');

import Switch from 'antd';
import './semantic-input.less';

const FontAwesome = require('react-fontawesome');

const SemanticInput = function statelessFunctionComponentClass(props) {
  return (
    <div className="ui action input">
      <input type="password" defaultValue="123456" />
      <a className="ui teal right labeled icon button" href="?" >
        <FontAwesome name="key icon" />
        Unlock
      </a>

    </div>
  );
};

module.exports = SemanticInput;
