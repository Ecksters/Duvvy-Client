import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

import CustomInput from "components/CustomInput/CustomInput.jsx"

import { connect } from "react-redux";
import { mapStateToProps } from "store"
import { createCategory, updateCategory, deleteCategory } from "../actions/categoryActions";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import DonutSmall from "@material-ui/icons/DonutSmall";
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
import BudgetSelect from "components/DatabaseSelect/BudgetSelect.jsx";
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

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: this.props.categories,
      transactions: this.props.transactions,
      br: false,
      alert: null,
      show: false,
      creatingCategory: false,
      categoryToModify: null,
      editCategoryTitle: null,
      editCategoryBudget: null
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
          Deleting a category will automatically remove all transactions from that category.
        </SweetAlert>
      )
    });
  }
  successDelete() {
    this.props.deleteCategory(this.state.categoryToModify);
    this.setState({
      categoryToModify: null,
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
          Category deleted.
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
          title="Category"
          onConfirm={() => {
            const budget = this.props.budgets.find((budget) => budget.title === this.state.editCategoryBudget)
            const newCategory = {
                id: this.state.categoryToModify.id,
                title: this.state.editCategoryTitle,
                budget_id: budget ? budget.id : null
              };
            if(newCategory.title) {
              if(this.state.creatingCategory) {
                this.props.createCategory(newCategory);
              } else {
                this.props.updateCategory(newCategory);
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
              <label>Title</label>
              <CustomInput
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (e) => this.setState({editCategoryTitle: e.target.value}),
                  defaultValue: this.state.editCategoryTitle,
                  style: {marginTop: '-25px'},
                  type: "text"
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <label>Budget</label>
              <BudgetSelect onChange={(change) => this.setState({editCategoryBudget: change})} category={this.state.categoryToModify} newCategory={this.state.creatingCategory}/>
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

  updateCategory(row, event) {
      this.setState({
        categoryToModify: row.original,
        editCategoryTitle: row.original.title,
        editCategoryBudget: row.original.budget_id
      }, this.inputAlert.bind(this));
  }
  deleteCategory(row, event) {
    this.setState({
      categoryToModify: row.original
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
          message={"Category " + (this.state.creatingCategory ? "created." : "updated.")}
          open={this.state.br}
          closeNotification={() => this.setState({ br: false })}
          close
        />
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <DonutSmall />
              </CardIcon>
            </CardHeader>
            <CardBody>
              <Button fullWidth color="info"
                onClick={(e) => {
                  this.setState({creatingCategory: true});
                  this.updateCategory({
                  original: {
                    description: "",
                    amount: "",
                    date: "",
                    category_id: null
                  }
                })}}
                > 
                <Add />Add New Category
              </Button>
              <ReactTable
                data={this.props.categories}
                noDataText="No Categories Found"
                filterable
                getTrProps={(state, rowInfo, column) => {
                  return {
                    onClick: (e) => {
                      if(window.innerWidth < 600) {
                        this.setState({creatingCategory: false});
                        this.updateCategory(rowInfo, e);
                      }
                    }
                  };
                }}
                columns={[
                  {
                    Header: "Category",
                    accessor: "title",
                    filterMethod: (filter, row) => 
                      row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) >= 0
                  },
                  {
                    Header: "Budget",
                    accessor: "budget_id",
                    style: {overflow: "visible"},
                    filterMethod: (filter, row) => {
                      const budgetName = this.props.budgets.find((budget) => budget.id === row.budget_id);
                      return budgetName && budgetName.title.toLowerCase().indexOf(filter.value.toLowerCase()) >= 0;
                    },
                    Cell: row => (
                      <div>
                        <BudgetSelect key={row.original.id} category={row.original}/>
                      </div>
                    )
                  },
                  {
                    Header: "Actions",
                    sortable: false,
                    filterable: false,
                    width: 90,
                    Cell: row => (
                      <div className="actions-right">
                        <Button justIcon round size="sm" color="warning"
                          onClick={(e) => {
                            this.setState({creatingCategory: false});
                            this.updateCategory(row, e);
                            }}> 
                          <Edit />
                        </Button>
                        <Button justIcon round size="sm" color="danger"
                          value={row}
                          onClick={(e) => this.deleteCategory(row, e)}
                          > 
                          <Close />
                        </Button>
                      </div>
                    )
                  }
                ]}
                defaultPageSize={10}
                defaultSorted={[
                  {
                    id: "title",
                    desc: false
                  }
                ]}
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

export default connect(mapStateToProps, {createCategory, updateCategory, deleteCategory})(withStyles(styles)(Categories));
