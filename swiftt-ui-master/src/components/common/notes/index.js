import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import Authorized from '../../../utils/Authorized';
import NotesList from './List';
import NoteForm from './Form';
import NoteToolbar from './Toolbar';

@connect(({ notes, loading }) => ({
  notes,
  loading: loading.effects['notes/query'],
}))
class NotesView extends PureComponent {

  static propTypes = {
    isPreviousVisit: PropTypes.bool,
    visit: PropTypes.string.isRequired,
    notes: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  state = {
    isComposerVisible: false,
  };

  componentDidMount() {
    const { dispatch, visit } = this.props;

    if (visit) {
      dispatch({ type: 'notes/query', payload: { encounterId: visit } });
    }
  }
  componentDidUpdate(prevProps) {
    const { dispatch, visit } = this.props;
    if (visit !== prevProps.visit) {
      dispatch({ type: 'notes/query', payload: { encounterId: visit } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'notes/purge' });
  }

  handleSubmit = (data) => {
    const { notes, dispatch, visit } = this.props;
    const { currentItem } = notes;

    dispatch({
      type: currentItem.id !== undefined ? 'notes/update' : 'notes/create',
      payload: { ...Object.assign({}, currentItem, data), encounterId: visit }
    });

    this.toggleComposerVisible();
  }

  handleCancel = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'notes/purgeCurrentItem',
    });
    this.toggleComposerVisible();
  }

  handleEdit = (item) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'notes/setCurrentItem',
      payload: {
        ...item,
      },
    });
  }

  toggleComposerVisible = (item) => {
    this.setState(( previousState, currentProps) => {
      return {
        isComposerVisible: !previousState.isComposerVisible
      }
    }, () => {
      if(item !== undefined && item.id !== undefined)
        this.handleEdit(item)
    })
  }

  render() {
    const { dispatch, notes, visit, isPreviousVisit } = this.props;
    const { loading, list, pagination, currentItem } = notes;

    const { isComposerVisible } = this.state;

    const noteListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) { },
      onDeleteItem(id) {
        dispatch({ type: 'notes/delete', payload: id });
      },
      onEditItem: this.toggleComposerVisible,
    };

    const noteFormProps = {
      item: currentItem.id !== undefined ? currentItem : {},
      type: currentItem.id !== undefined ? 'update' : 'new',
      onCancel: this.handleCancel,
      onOk: this.handleSubmit,
    };

    const noteToolbarProps = {
      onAdd: this.toggleComposerVisible,
      isPreviousVisit,
    };

    return (
      <Row>
        <Col>
          {isComposerVisible && !isPreviousVisit && <NoteForm {...noteFormProps} />}
          {!isComposerVisible
            &&
            (<div>
              {!isPreviousVisit && ( //disable if its a perious visit
                <NoteToolbar  {...noteToolbarProps} />
              )}
              <Authorized authority="READ_VISIT_NOTES">
                <NotesList {...noteListProps} />
              </Authorized>
            </div>)
          }
        </Col>
      </Row>
    );
  }
}

export default NotesView;
