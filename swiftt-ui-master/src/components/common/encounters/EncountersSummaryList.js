import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, LocaleProvider } from 'antd';
import PropTypes from 'prop-types';
import enUS from 'antd/lib/locale-provider/en_US';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const ageDateFormat = 'YYYY, M, DD';

class EncountersSummaryList extends PureComponent {
  constructor(props) {
    super(props);
    const { current } = this.props.encounters.pagination;
    this.currentPage = current;
    this.newPage = current;
    this.state = {
      width: 800,
    };
  }

  componentDidMount() {
    const { dispatch, patient } = this.props;
    dispatch({ type: 'encounters/queryPatientEncounters', payload: { patientId: patient.id } });

    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'encounters/purge' });

    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  onEnd = (e) => {
    e.target.style.height = 'auto';
  }

  async pageChange(pagination) {
    await this.props.onPageChange(pagination);
    this.newPage = pagination.current;
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
    const { encounters } = this.props;
    const {
      loading,
      list,
      pagination,
      onViewItem,
    } = encounters;

    const columns = [
      {
        title: 'Visit No.',
        dataIndex: 'visitNumber',
        key: 'visitNumber',
      }, {
        title: 'Visit Type',
        dataIndex: 'visitType.name',
        key: 'visitType.name',
      }, {
        title: 'Visit Time',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: text => <span>{moment(text).local().format(dateTimeFormat)} ({moment(moment(text).local().format(ageDateFormat)).fromNow(true)})</span>,
      }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
    ];

    return (
      <div>
        <LocaleProvider locale={enUS}>
          <Table
            bordered
            size="middle"
            columns={columns}
            dataSource={list}
            loading={loading}
            onChange={::this.pageChange}
            pagination={pagination}
            simple
            rowKey={record => record.id}
            scroll={{ x: this.state.width }}
          />
        </LocaleProvider>
      </div>
    );
  }
}

EncountersSummaryList.propTypes = {
  encounters: PropTypes.object,
  patient: PropTypes.object.isRequired,
};

function mapStateToProps({ encounters }) {
  return { encounters };
}

export default connect(mapStateToProps)(EncountersSummaryList);
