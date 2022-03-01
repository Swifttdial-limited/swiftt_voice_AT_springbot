import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  Table,
  Button,
  LocaleProvider,
  Tag,
  Alert
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

class EncounterSelectionList extends PureComponent {

  static defaultProps = {
    encounters: {},
    onEncounterSelect: () => {},
  };

  static propTypes = {
    encounters: PropTypes.object,
    onEncounterSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      width: 800,
    };
  }

  componentDidMount() {
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
    const {
      encounters,
      onEncounterSelect,
    } = this.props;

    const renderVisitStatusTag = (status) => {
      switch (status) {
        case 'NEW':
          return <Tag color="magenta">NEW</Tag>;
        case 'ACTIVE':
          return <Tag color="green">IN PROGRESS</Tag>;
        case 'CLOSED':
          return <Tag color="red">CLOSED</Tag>;
        case 'AWAITING_CONFIRMATION':
          return <Tag color="purple">AWAITING CONFIRMATION</Tag>;
        case 'PENDING_ADMISSION':
          return <Tag color="purple">PENDING ADMISSION</Tag>;
        case 'PENDING_PAYMENT':
          return <Tag color="purple">PENDING PAYMENT</Tag>;
        case 'PENDING_BILL_PAYMENT':
          return <Tag color="purple">PENDING BILL PAYMENT</Tag>;
        case 'PENDING_DISCHARGE':
          return <Tag color="purple">PENDING DISCHARGE</Tag>;
        default:
          return <Tag color="blue">{status}</Tag>;
      }
    };

    const columns = [
      {
        title: 'Visit No.',
        dataIndex: 'visitNumber',
        key: 'visitNumber',
        render: (text, record) => <span>{record.visitType.prefix ? record.visitType.prefix + '-' : null}{text}</span>
      }, {
        title: 'Type of Visit',
        dataIndex: 'visitType.name',
        key: 'visitType.name',
      }, {
        title: 'Visit Time',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: text => <span>{moment(text).local().format(dateTimeFormat)}</span>,
      }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => <span>{renderVisitStatusTag(text)}</span>,
      }, {
        title: 'Action',
        key: 'action',
        render: (text, record) => <Button shape="circle" icon="link" onClick={() => onEncounterSelect(record)} />,
      }
    ];

    return(
      <div>
        <Alert
          message="Informational Note"
          description="Patient already has a visit that is in progress. Select a visit to link to appointment"
          type="info"
          showIcon
        />
        <br />

        <LocaleProvider locale={enUS}>
          <Table
            bordered
            size="middle"
            columns={columns}
            dataSource={encounters}
            simple
            rowKey={record => record.id}
            scroll={{ x: this.state.width }}
          />
        </LocaleProvider>
      </div>
    );
  }

}

export default EncounterSelectionList;
