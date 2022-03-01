import React from 'react';
import numeral from 'numeral';

const FooterTable = ({ items, payments }) => {

    const totalReceivedAmount = payments.reduce((total, payment) => {
        const { receivedAmount, paymentMode } = payment;
        if (paymentMode.tradingCurrency && paymentMode.tradingCurrency.rate !== null) {
            const { tradingCurrency } = paymentMode;
            const { rate } = tradingCurrency;
            return (parseFloat(total) + (parseFloat(receivedAmount) * rate));
        }
        return (parseFloat(total) + parseFloat(receivedAmount));
    }, 0);

    const totalPayableAmount = items.reduce((total, item) => {
        const { totalAmount } = item;
        return (parseFloat(total) + parseFloat(totalAmount));
    }, 0);

    return (
        <div className="ant-table ant-table-small ant-table-scroll-position-left">
            <div className="ant-table-content">
                <div className="ant-table-body">
                    <table>
                        <tbody>
                            <tr className="ant-table-row  ant-table-row-level-0">
                                <td style={{ fontSize: '13px', textAlign: 'center' }} colSpan={3}>
                                    Total
                  </td>
                                <td style={{
                                    fontSize: '12px',
                                    textAlign: 'right',
                                    padding: '0 10px',
                                }}
                                >{numeral(totalPayableAmount).format('0,0.00')}
                                </td>
                            </tr>
                            <tr className="ant-table-row  ant-table-row-level-0">
                                <td style={{ fontSize: '13px', textAlign: 'center' }} colSpan={3}>
                                    Paid
                  </td>
                                <td style={{
                                    fontSize: '12px',
                                    textAlign: 'right',
                                    padding: '0 10px',
                                }}
                                >{numeral(totalReceivedAmount).format('0,0.00')}
                                </td>
                            </tr>
                            <tr className="ant-table-row  ant-table-row-level-0">
                                <td style={{ fontSize: '13px', textAlign: 'center' }} colSpan={3}>
                                    Balance
                  </td>
                                <td style={{
                                    fontSize: '12px',
                                    textAlign: 'right',
                                    padding: '0 10px',
                                }}
                                >{numeral((totalReceivedAmount * 1) - (totalPayableAmount * 1)).format('0,0.00')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default FooterTable;