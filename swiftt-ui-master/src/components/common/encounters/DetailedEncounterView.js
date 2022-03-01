import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import { Table, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import DescriptionList from '../../DescriptionList';
import { queryVisitBillItems } from '../../../services/billing-management/bills';

const { Description } = DescriptionList;
const ageDateFormat = 'YYYY, M, DD';
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

class DetailedEncounterView extends PureComponent {

  state = {
    billItems: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      width: 800,
    };
  }

  componentDidMount() {
    const { encounter } = this.props;

    let billItems = queryVisitBillItems({
      visitId: encounter.id,
      size: 1000,
    });

    billItems
      .then((response) => {
        this.setState({ billItems: response.content });
      });

    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  onEnd = (e) => {
    e.target.style.height = 'auto';
  }

  updateDimensions() {
    if (window.innerWidth < 1000) {
      this.setState({ width: 850 });
    } else if (window.innerWidth > 1000) {
      this.setState({ width: 0 });
    } else {
      const updateWidth = window.innerWidth - 100;
      this.setState({ width: updateWidth });
    }
  }

  render() {
    const { encounter } = this.props;

    const { billItems } = this.state;

    const renderHeader = () => {
      return (
        <DescriptionList size="small">
          <Description term="Visit Number">{encounter.visitNumber}</Description>
          <Description term="Visit Date">{moment(encounter.creationDate).format(dateFormat)}</Description>
          <Description term="Visit Type">{encounter.visitType.name}</Description>
        </DescriptionList>
      );
    }

    const renderFooter = () => {

    }

    const columns = [
      {
        title: 'Date.',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: (text) => <span>{moment(text).local().format(dateTimeFormat)}</span>,
      }, {
        title: 'Description',
        dataIndex: 'requestItem.priceListItem.product.productName',
        key: 'requestItem.priceListItem.product.productName',
        render: (text, record) => <span>{record.requestItem.priceListItem.product.productName} ({record.requestItem.priceListItem.product.productCode})</span>
      }, {
        title: 'Qty',
        dataIndex: 'requestItem.quantity',
        key: 'requestItem.quantity',
        render: (text, record) => <span>{record.requestItem.quantity}</span>
      }, {
        title: 'Unit Price',
        dataIndex: 'requestItem.priceListItem.sellingPrice',
        key: 'requestItem.priceListItem.sellingPrice',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>
      }, {
        title: 'Amount',
        dataIndex: 'amountPayable',
        key: 'amountPayable',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>
      }, {
        title: 'Paid',
        dataIndex: 'amountPayable',
        key: 'amountPayable',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>
      }, {
        title: 'Balance',
        dataIndex: 'quantity',
        key: 'quantity',
        render: (text) => <span>{numeral(text).format('0,0.00')}</span>
      }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
    ];

    return (
      <Table
        bordered
        columns={columns}
        dataSource={billItems}
        pagination={false}
        title={() => renderHeader()}
        footer={() => renderFooter()}
        style={{ marginTop: '0px !important', marginBottom: 20 }}
      />
    );
  }
}

DetailedEncounterView.propTypes = {
  encounter: PropTypes.object.isRequired,
};

export default DetailedEncounterView;
