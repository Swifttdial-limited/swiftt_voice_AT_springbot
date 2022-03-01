import React from 'react';
import { Button, Badge } from 'antd';

function BillingToolBar({
    handleBillingButtonClick,
    selectedRequestItems,
}) {
    return (
        <div style={{ padding: 5, }}>
            <Badge count={selectedRequestItems.length}>
                <Button
                    type="primary"
                    icon="wallet"
                    // loading={billingBtnLoading}
                    onClick={handleBillingButtonClick}
                    disabled={(selectedRequestItems && selectedRequestItems.length <= 0) || (typeof selectedRequestItems.length === 'undefined')}
                >
                     Generate Invoice(s)
                </Button>
            </Badge>
        </div>
    );

}



export default BillingToolBar;