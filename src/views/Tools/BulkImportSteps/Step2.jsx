import React from "react";
import moment from "moment";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import CSVUpload from "components/CustomUpload/CSVUpload.jsx"

import { connect } from "react-redux";
import { mapStateToProps } from "store"
import { createTransactionsAndCategories } from "actions/transactionActions";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  choiche: {
    textAlign: "center",
    cursor: "pointer",
    marginTop: "20px"
  }
};

const isNumber = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

class Step2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvData: [],
      sanitizedData: [],
      newCategories: [],
      dataSummary: (<div></div>),
      errors: true,
      fileRender: 0
    };
    this.baseState = this.state;
    this.handleData = this.handleData.bind(this);
  }
  
  extractValidData(data) {
    const extractedData = {clean: [], dirty: []};
    let rowCount = 1;
    extractedData.clean = data.reduce((newData, row) => {
      rowCount++;
      const convertedRow = {};
      for(const key in row) {
        convertedRow[key.toLowerCase()] = row[key]
      }
      if(moment(convertedRow.date, 'YYYY-MM-DD', true).isValid() &&
      isNumber(convertedRow.amount) && Number(convertedRow.amount) >= 0 && 
      convertedRow.description && convertedRow.description.length > 0){
        convertedRow.amount = Number(convertedRow.amount);
        newData.push(convertedRow);
      }
      else {
        extractedData.dirty.push({row: rowCount, ...row});
      }
      return newData;
    }, []);
    return extractedData;
  }
  extractCategories(data) {
    return data.filter((value, index, self) => self.findIndex((row) => row.category === value.category) === index)
          .map((row) => ({title: row.category}));
  }

  handleData(data) {
    const sanitizedData = this.extractValidData(data);
    const categories = this.extractCategories(sanitizedData.clean);
    const newCategories = categories.filter((category) =>
      this.props.categories.find((existingCategory) => existingCategory.title === category.title) === undefined)
    this.setState({
      csvData: data,
      sanitizedData: sanitizedData,
      newCategories: newCategories,
      errors: sanitizedData.dirty.length > 0,
      dataSummary: (
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={6} lg={6}>
            <h5>Data Summary:</h5>
            Input Transaction Count: {data.length}<br />
            Valid Transactions: {sanitizedData.clean.length}<br />
            Invalid Rows: {sanitizedData.dirty.length}<br />
            Total Categories: {categories.length} <br />
            New Categories: {newCategories.length}
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={6}>
            <h6>
              {sanitizedData.dirty.length > 0
              ? "First error occurred on row: " + sanitizedData.dirty[0].row
              : "No problems detected, hit Next to finish importing."}
              </h6>
          </GridItem>
        </GridContainer>
      )
    });
  }
  isValidated() {
    if(!this.state.errors) {
      this.props.createTransactionsAndCategories(this.state.sanitizedData.clean, this.state.newCategories);
      this.setState({...this.baseState, fileRender: this.state.fileRender + 1})
      return true;
    }
    return false;
  }
  sendState() {
    return this.state;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <h4 className={classes.infoText}>Select your file and let's double check the format</h4>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={10}>
            <CSVUpload dataHandler={this.handleData} key={this.state.fileRender}/>
          </GridItem>
        </GridContainer>
        { this.state.dataSummary }
      </div>
    );
  }
}

export default connect(mapStateToProps, {createTransactionsAndCategories})(withStyles(style)(Step2));