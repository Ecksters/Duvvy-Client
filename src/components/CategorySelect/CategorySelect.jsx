import React, { Component } from "react";

import { createCategory } from "actions/categoryActions";
import { updateTransaction } from "actions/transactionActions";
import { connect } from "react-redux";
import { mapStateToProps } from "store";

import CreatableSelect from "react-select/lib/Creatable";


class CategorySelect extends Component {
  state = {
    options: this.props.categories.map((category) => {
      return {label: category.title, value: category.title};
    }),
    transaction: this.props.transaction,
    value: undefined
  };
  componentWillMount = () => {
    const startingLabel = this.props.transaction.category_id !== null ? this.props.categories.find((category) => {
      return category.id === this.props.transaction.category_id
    }).title : null;
    this.setState({value: startingLabel ? {label: startingLabel, value: startingLabel} : undefined});
  }
  handleChange = (newValue, actionMeta) => {
    this.setState({ value: newValue });
    this.props.updateTransaction({
      id: this.state.transaction.id,
      category_id: this.props.categories.find((category) => category.title === newValue.value).id
    });
  };
  handleCreate = (inputValue) => {
    const { options } = this.state;
    const newOption = {label: inputValue, value: inputValue};
    this.setState({
      options: [...options, newOption],
      value: newOption,
    });
    this.props.createCategory({title: inputValue});
  };
  render() {
    const { options, value } = this.state;
    return (
      <CreatableSelect
        isClearable
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