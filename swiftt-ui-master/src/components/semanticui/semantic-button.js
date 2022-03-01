const React = require('react');

import './semantic-button.less';

const SemanticButton = function statelessFunctionComponentClass(props) {
  return (
    <button onClick={props.onClick} className={`ui button ${props.type}`}>{props.text}</button>
  );
};

module.exports = SemanticButton;
