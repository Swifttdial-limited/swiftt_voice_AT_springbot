import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Table, Input, Popconfirm, Button } from 'antd';

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

class EditableTable extends PureComponent {
  static defaultProps = {
    loading: false,
    product: {},
  };

  static propTypes = {
    loading: PropTypes.bool,
    product: PropTypes.object.isRequired,
  };

  state = { data: [] };

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }
  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }

  render() {
    const { product, loading } = this.props;

    // console.log(product);

    if (product.associatedProducts.length) {
      console.log('L');
      const data = [];
      for (let i = 0; i < 5; i++) {
        data.push({
          key: i.toString(),
          name: `Edrward ${i}`,
        });
      }
      this.setState({ data });
      this.cacheData = data.map(item => ({ ...item }));
    }

    const columns = [{
      title: 'Product',
      dataIndex: 'name',
      width: '90%',
      render: (text, record) => this.renderColumns(text, record, 'name'),
    }, {
      title: '',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record) => {
        const { editable } = record;
        return (
          <div className="editable-row-operations">
            {
              editable ? (
                <span>
                  <a onClick={() => this.save(record.key)}>Save</a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
) : <a onClick={() => this.edit(record.key)}>Edit</a>
            }
          </div>
        );
      },
    }];

    return (
      <div>
        <Button>Add</Button>
        <Table
          bordered
          loading={loading}
          dataSource={this.state.data}
          columns={columns}
        />
      </div>
    );
  }
}

export default EditableTable;
