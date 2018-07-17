import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

import FormControl from "@material-ui/core/FormControl";
import Datetime from "react-datetime";
import CustomInput from "components/CustomInput/CustomInput.jsx"

import { connect } from "react-redux";
import { mapStateToProps } from "store"
import { createTransaction, updateTransaction, deleteTransaction } from "../actions/transactionActions";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import CreditCard from "@material-ui/icons/CreditCard";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check"
import Add from "@material-ui/icons/Add"

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CategorySelect from "components/CategorySelect/CategorySelect.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import SweetAlert from "react-bootstrap-sweetalert";

import buttonStyle from "assets/jss/material-dashboard-pro-react/components/buttonStyle.jsx";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";

const styles = {
  ...buttonStyle,
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: this.props.transactions,
      br: false,
      alert: null,
      show: false,
      creatingTransaction: false,
      transactionToModify: null,
      editTransactionDate: null,
      editTransactionDescription: null,
      editTransactionAmount: null,
      editTransactionCategory: null
    };
    this.hideAlert = this.hideAlert.bind(this);
    this.successDelete = this.successDelete.bind(this);
  }
  warningWithConfirmMessage() {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-300px" }}
          title="Are you sure?"
          onConfirm={() => this.successDelete()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
          cancelBtnCssClass={
            this.props.classes.button + " " + this.props.classes.danger
          }
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          There's no way to undo it once it's deleted!
        </SweetAlert>
      )
    });
  }
  successDelete() {
    this.props.deleteTransaction(this.state.transactionToModify);
    this.setState({
      transactionToModify: null,
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-300px" }}
          title="Deleted!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
          Transaction deleted.
        </SweetAlert>
      )
    });
  }
  inputAlert() {
    this.setState({
      alert: (
        <SweetAlert
          showCancel
          style={{ display: "block", marginTop: "-300px" }}
          title="Transaction"
          onConfirm={() => {
            const newTransaction = {
                id: this.state.transactionToModify.id,
                date: this.state.editTransactionDate,
                description: this.state.editTransactionDescription,
                amount: this.state.editTransactionAmount,
                category_id: this.state.editTransactionCategory
              };
            if(newTransaction.date && newTransaction.description && newTransaction.amount) {
              if(this.state.creatingTransaction) {
                this.props.createTransaction(newTransaction);
              } else {
                this.props.updateTransaction(newTransaction);
              }
              this.showNotification("br");
              this.hideAlert();
            }
          }}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.info
          }
          cancelBtnCssClass={
            this.props.classes.button + " " + this.props.classes.danger
          }>
          <GridContainer style={{textAlign: "left"}}>
            <GridItem xs={6}>
              <FormControl fullWidth>
                <label>Date</label>
                <Datetime
                  defaultValue={this.state.editTransactionDate}
                  timeFormat={false}
                  dateFormat="YYYY-MM-DD"
                  onChange={(date) => this.setState({editTransactionDate: date.format("YYYY-MM-DD")})}
                  inputProps={{ placeholder: "YYYY-MM-DD",}}
                />
              </FormControl>
            </GridItem>
            <GridItem xs={6}>
              <label>Description</label>
              <CustomInput
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (e) => this.setState({editTransactionDescription: e.target.value}),
                  defaultValue: this.state.editTransactionDescription,
                  style: {marginTop: '-25px'},
                  type: "text"
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <label>Amount</label>
              <CustomInput
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (e) => this.setState({editTransactionAmount: e.target.value}),
                  defaultValue: this.state.editTransactionAmount,
                  style: {marginTop: '-25px'},
                  type: "text"
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <label>Category</label>
              <CategorySelect transaction={this.state.transactionToModify}/>
            </GridItem>
          </GridContainer>
        </SweetAlert>
      )
    });
  }
  hideAlert() {
    this.setState({
      alert: null
    });
  }

  showNotification(place) {
    if (!this.state[place]) {
      var x = [];
      x[place] = true;
      this.setState(x);
      setTimeout(
        function() {
          x[place] = false;
          this.setState(x);
        }.bind(this),
        1500
      );
    }
  }

  updateTransaction(row, event) {
      this.setState({
        transactionToModify: row.original,
        editTransactionDescription: row.original.description,
        editTransactionAmount: row.original.amount,
        editTransactionDate: row.original.date,
        editTransactionCategory: row.original.category_id
      }, this.inputAlert.bind(this));
  }
  deleteTransaction(row, event) {
    this.setState({
      transactionToModify: row.original
    });
    return this.warningWithConfirmMessage.bind(this)();
  }

  render() {
    return (
      <GridContainer>
        {this.state.alert}
        <Snackbar
          place="br"
          color="success"
          icon={Check}
          message={"Transaction " + (this.state.creatingTransaction ? "created." : "updated.")}
          open={this.state.br}
          closeNotification={() => this.setState({ br: false })}
          close
        />
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <CreditCard />
              </CardIcon>
            </CardHeader>
            <CardBody>
              <Button fullWidth color="info"
                onClick={(e) => {
                  this.setState({creatingTransaction: true});
                  this.updateTransaction({
                  original: {
                    description: "",
                    amount: "",
                    date: "",
                    category_id: null
                  }
                })}}
                > 
                <Add />Add New Transaction
              </Button>
              <ReactTable
                data={this.props.transactions}
                noDataText="No Transactions Found"
                filterable
                getTrProps={(state, rowInfo, column) => {
                  return {
                    onClick: (e) => {
                      if(window.innerWidth < 600) {
                        this.setState({creatingTransaction: false});
                        this.updateTransaction(rowInfo, e);
                      }
                    }
                  };
                }}
                columns={[
                  {
                    Header: "Date",
                    accessor: "date",
                    width: 90
                  },
                  {
                    Header: "Description",
                    accessor: "description",
                    filterMethod: (filter, row) => 
                      row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) >= 0
                  },
                  {
                    Header: "Amount",
                    accessor: "amount",
                    width: 90,
                    Cell: row => formatter.format(row.value)
                  },
                  {
                    Header: "Category",
                    accessor: "category_id",
                    style: {overflow: "visible"},
                    show: window.innerWidth > 600,
                    filterMethod: (filter, row) => {
                      const categoryName = this.props.categories.find((category) => category.id === row.category_id);
                      return categoryName && categoryName.title.toLowerCase().indexOf(filter.value.toLowerCase()) >= 0;
                    },
                    Cell: row => (
                      <div>
                        <CategorySelect key={row.original.id} transaction={row.original}/>
                      </div>
                    )
                  },
                  {
                    Header: "Actions",
                    sortable: false,
                    filterable: false,
                    width: 90,
                    show: window.innerWidth > 600,
                    Cell: row => (
                      <div className="actions-right">
                        <Button justIcon round size="sm" color="warning"
                          onClick={(e) => {
                            this.setState({creatingTransaction: false});
                            this.updateTransaction(row, e);
                            }}> 
                          <Edit />
                        </Button>
                        <Button justIcon round size="sm" color="danger"
                          value={row}
                          onClick={(e) => this.deleteTransaction(row, e)}
                          > 
                          <Close />
                        </Button>
                      </div>
                    )
                  }
                ]}
                defaultPageSize={10}
                showPaginationTop
                showPaginationBottom={false}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default connect(mapStateToProps, {createTransaction, updateTransaction, deleteTransaction})(withStyles(styles)(Transactions));
