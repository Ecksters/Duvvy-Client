import React, { Component } from "react";

import { createBudget } from "actions/budgetActions";
import { updateCategory } from "actions/categoryActions";
import { connect } from "react-redux";
import { mapStateToProps } from "store";

import CreatableSelect from "react-select/lib/Creatable";

const budgetSort = (a,b) => ((a.label < b.label) ? -1 : ((a.label > b.label) ? 1 : 0))

class BudgetSelect extends Component {
  state = {
    options: this.props.budgets.map((budget) => {
      return {label: budget.title, value: budget.title};
    })
    .sort(budgetSort),
    category: this.props.category,
    value: undefined,
    isLoading: false
  };
  componentWillReceiveProps = () => {
    const startingLabel = this.props.category.budget_id ? this.props.budgets.find((budget) => {
      return budget.id === this.props.category.budget_id
    }).title : null;
    this.setState({value: startingLabel ? {label: startingLabel, value: startingLabel} : undefined});
  }
  componentWillMount = this.componentWillReceiveProps;
  handleChange = (newValue, actionMeta) => {
    if(!this.props.newCategory) {
      this.props.updateCategory({
        id: this.state.category.id,
        budget_id: newValue === null ? null : this.props.budgets.find((budget) => budget.title === newValue.value).id
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
    this.props.createBudget({title: inputValue}, !this.props.newCategory ? this.state.category.id : undefined);
    this.setState({isLoading: true});
    setTimeout(() => {
      if(this.props.onChange) {
        this.props.onChange(newOption ? newOption.value : null);
      }
      this.setState({
        options: [...options, newOption].sort(budgetSort),
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
        placeholder="Select Budget..."
        onChange={this.handleChange}
        onCreateOption={this.handleCreate}
        options={options}
        value={value}
      />
    );
  }
}

export default connect(mapStateToProps, {createBudget, updateCategory})(BudgetSelect);