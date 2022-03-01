import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';

import { Input } from 'antd';

import * as libPhoneNumber from 'google-libphonenumber';

const PhoneNumberUtil = libPhoneNumber.PhoneNumberUtil;
const PhoneNumberFormat = libPhoneNumber.PhoneNumberFormat;

class PhoneNumberInput extends PureComponent {

  static defaultProps = {
    countryCode: '',
    phoneCode: '....',
    onPhoneNumberChange: () => {},
  };

  static propTypes = {
    countryCode: PropTypes.string.isRequired,
    editValue: PropTypes.string,
    phoneCode: PropTypes.string.isRequired,
    onPhoneNumberChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.validatePhoneNumberHandler = debounce(this.validatePhoneNumberHandler, 1000);
  }

  componentWillReceiveProps(nextProps) {
    if('editValue' in nextProps) {
      //console.log('Received ', nextProps.editValue);
      // reverse engineerr +254 to national_number
      //const phoneUtil = PhoneNumberUtil.getInstance();
      //const parsedPhoneNumber = phoneUtil.parse(nextProps.editValue, countryCode);
    }
  }

  phoneNumberChangeHandler = e => this.validatePhoneNumberHandler(e.target.value);

  validatePhoneNumberHandler = (phoneNumber) => {
    const { countryCode, phoneCode, onPhoneNumberChange } = this.props;

    const phoneUtil = PhoneNumberUtil.getInstance();
    const parsedPhoneNumber = phoneUtil.parse(phoneCode + phoneNumber, countryCode);

    if (phoneUtil.isValidNumber(parsedPhoneNumber)) {
      onPhoneNumberChange(phoneUtil.format(parsedPhoneNumber, PhoneNumberFormat.E164));
    } else {
      onPhoneNumberChange(null);
    }
  }

  render() {
    const { editValue, phoneCode } = this.props;

    return (
      <Input
        addonBefore={phoneCode}
        placeholder="Enter phone number"
        onChange={this.phoneNumberChangeHandler}
      />
    );
  }
}

export default PhoneNumberInput;
