import React, { Component } from "react";

import { createCategory } from "actions/categoryActions";
import { updateTransaction } from "actions/transactionActions";
import { connect } from "react-redux";
import { mapStateToProps } from "store";

import CreatableSelect from "react-select/lib/Creatable";

const categorySort = (a,b) => ((a.label < b.label) ? -1 : ((a.label > b.label) ? 1 : 0))

class CategorySelect extends Component {
  state = {
    options: this.props.categories.map((category) => {
      return {label: category.title, value: category.title};
    })
    .sort(categorySort),
    transaction: this.props.transaction,
    value: undefined,
    isLoading: false
  };
  componentWillReceiveProps = () => {
    const startingLabel = this.props.transaction.category_id !== null ? this.props.categories.find((category) => {
      return category.id === this.props.transaction.category_id
    }).title : null;
    this.setState({value: startingLabel ? {label: startingLabel, value: startingLabel} : undefined});
  }
  componentWillMount = this.componentWillReceiveProps;
  handleChange = (newValue, actionMeta) => {
    if(!this.props.newTransaction) {
      this.props.updateTransaction({
        id: this.state.transaction.id,
        category_id: newValue === null ? null : this.props.categories.find((category) => category.title === newValue.value).id
      });
    }
    this.setState({isLoading: true});
    setTimeout(() => {
      if(this.props.onChange) {
        this.props.onChange(newValue ? newValue.value : null);
      }
      this.setState({ value: newValue, isLoading: false });
    }, 500);
  };
  handleCreate = (inputValue) => {
    const { options } = this.state;
    const newOption = {label: inputValue, value: inputValue};
    this.props.createCategory({title: inputValue}, !this.props.newTransaction ? this.state.transaction.id : undefined);
    this.setState({isLoading: true});
    setTimeout(() => {
      if(this.props.onChange) {
        this.props.onChange(newOption ? newOption.value : null);
      }
      this.setState({
        options: [...options, newOption].sort(categorySort),
        value: newOption,
        isLoading: false
      });
    }, 500);
  };
  render() {
    const { isLoading, options, value } = this.state;
    return (
      <CreatableSelect
        isClearable
        isLoading={isLoading}
        disabled={isLoading}
        placeholder="Select Category..."
        onChange={this.handleChange}
        onCreateOption={this.handleCreate}
        options={options}
        value={value}
      />
    );
  }
}

export default connect(mapStateToProps, {createCategory, updateTransaction})(CategorySelect);