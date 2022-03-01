import React, { PureComponent } from 'react';
import CheckPermissions from './CheckPermissions';

class Authorized extends PureComponent {
  render() {
    const { children, authority, noMatch = null } = this.props;
    const childrenRender = typeof children === 'undefined' ? null : children;
    return CheckPermissions(
      authority,
      childrenRender,
      noMatch
    );
  }
}

export default Authorized;
