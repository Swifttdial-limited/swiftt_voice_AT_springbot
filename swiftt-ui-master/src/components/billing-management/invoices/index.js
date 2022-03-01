import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {
  Card,
  Icon,
  Tooltip,
  List,
  Avatar,
} from 'antd';
import moment from 'moment';
import { random } from '../../../utils/theme';
import { getRandomInt } from '../../../utils/utils';

// eslint-disable-next-line react/no-typos
InvoicesListView.propTypes = {
  handleOnEncounterClick: PropTypes.func.isRequired,
};
// eslint-disable-next-line react/no-typos
InvoicesListView.PropTypes = {
  isActive: false,
};
const dateTimeFormat = 'YYYY-MM-DD HH:mm';

function InvoicesListView({ invoices, handleOnEncounterClick }) {
  const { activeVisitId, loading, success, pagination } = invoices;
  const list = (activeVisitId && !loading && success ? invoices[activeVisitId] : []);
  return (
    <Card bodyStyle={{ padding: '0px 10px', height: '95vh', overflow: 'scroll' }} >
      <QueueAnim
        delay={300}
        type="top"
        interval={200}
        className="queue-simple"
        id="invoice-wrapper"
      >
        <List
          dataSource={list}
          // size="small"
          pagination={list.length > 20 ? pagination : false}
          loading={loading}
          renderItem={invoice => (
            <List.Item
              key={invoice.id}
              onClick={() => handleOnEncounterClick(invoice)}
            >
              <List.Item.Meta
                avatar={
                  <Tooltip placement="bottom" title={invoice.status}>
                    <Avatar size="small" style={{ backgroundColor: random[getRandomInt(20)] }}>
                      {invoice.customer.name.charAt(0)}
                    </Avatar>
                  </Tooltip>
                  }
                title={invoice.customer.name}
                description={invoice.customer.code}
              />
              <div>
                <span style={{
                          display: 'block',
                          textAlign: 'right',
                          padding: 5,
                        }}
                >
                  {invoice.invoiceNumber}
                </span>
                <span style={{
                    display: 'block',
                    textAlign: 'right',
                    padding: 5,
                  }}
                >
                  {moment(invoice.transactionDate)
                          .local()
                          .format(dateTimeFormat)}
                </span>
              </div>
            </List.Item>
            )}
        />
      </QueueAnim>
    </Card>
  );
}

export default InvoicesListView;
