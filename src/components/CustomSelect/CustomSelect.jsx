import React, { Component } from 'react';

import CreatableSelect from 'react-select/lib/Creatable';


const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

const defaultOptions = [
  createOption('One'),
  createOption('Two'),
  createOption('Three'),
];

export default class CustomSelect extends Component {
  state = {
    isLoading: false,
    options: defaultOptions,
    value: undefined,
  };
  handleChange = (newValue, actionMeta) => {
    this.setState({ value: newValue });
  };
  handleCreate = (inputValue) => {
    this.setState({ isLoading: true });
    setTimeout(() => {
      const { options } = this.state;
      const newOption = createOption(inputValue);
      this.setState({
        isLoading: false,
        options: [...options, newOption],
        value: newOption,
      });
    }, 1000);
  };
  render() {
    console.log(this.props);
    const { isLoading, options, value } = this.state;
    return (
      <CreatableSelect
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={this.handleChange}
        onCreateOption={this.handleCreate}
        options={options}
        value={value}
      />
    );
  }
}