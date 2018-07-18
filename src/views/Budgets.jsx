import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// material-ui icons
import Add from "@material-ui/icons/Add";
import AccountBalance from "@material-ui/icons/AccountBalance";

import { connect } from "react-redux";
import { mapStateToProps } from "store"
import { createBudget, updateBudget, deleteBudget } from "../actions/budgetActions";
import BudgetDisplay from "components/BudgetDisplay/BudgetDisplay.jsx";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx"

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

class Budgets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creatingBudget: false,
      budgetToModify: null,
      editBudgetTitle: null,
      editBudgetGoal: null,
      alert: null
    };
    this.hideAlert = this.hideAlert.bind(this);
    this.successDelete = this.successDelete.bind(this);
    this.budgetList = ""
  }

  updateBudgetList() {
    return this.props.budgets.length > 0 ? this.props.budgets.map((budget) => {
      return (<BudgetDisplay delete={this.deleteBudget.bind(this)} edit={this.updateExistingBudget.bind(this)} key={budget.id} budget={budget}/>)})
     : (<h3 style={{textAlign: "center", width: "100%"}}>No budgets found</h3>)
  }

  updateExistingBudget(budget) {
    this.setState({creatingBudget: false});
    this.updateBudget(budget);
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
          Deleting a budget will automatically remove all categories from that budget.
        </SweetAlert>
      )
    });
  }
  successDelete() {
    this.props.deleteBudget(this.state.budgetToModify);
    this.setState({
      budgetToModify: null,
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
          Budget deleted.
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
          title="Budget"
          onConfirm={() => {
            const newBudget = {
                id: this.state.budgetToModify.id,
                title: this.state.editBudgetTitle,
                goal: this.state.editBudgetGoal
              };
            if(newBudget.title) {
              if(this.state.creatingBudget) {
                this.props.createBudget(newBudget);
              } else {
                this.props.updateBudget(newBudget);
              }
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
                  onChange: (e) => this.setState({editBudgetTitle: e.target.value}),
                  defaultValue: this.state.editBudgetTitle,
                  style: {marginTop: '-25px'},
                  type: "text"
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <label>Monthly Budget Goal</label>
              <CustomInput
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: (e) => this.setState({editBudgetGoal: e.target.value}),
                  defaultValue: this.state.editBudgetGoal,
                  style: {marginTop: '-25px'},
                  type: "text"
                }}
              />
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

  updateBudget(budget, event) {
    this.setState({
      budgetToModify: budget,
      editBudgetTitle: budget.title,
      editBudgetGoal: budget.goal
    }, this.inputAlert.bind(this));
  }

  deleteBudget(budget, event) {
    this.setState({
      budgetToModify: budget
    });
    return this.warningWithConfirmMessage.bind(this)();
  }

  render() {
    return (
      <GridContainer>
        {this.state.alert}
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <AccountBalance />
              </CardIcon>
            </CardHeader>
            <CardBody>
              <Button fullWidth color="info"
                onClick={(e) => {
                  this.setState({creatingBudget: true});
                  this.updateBudget({
                    title: "",
                    goal: "",
                  })}}
                > 
                <Add />Add New Budget
              </Button>
            </CardBody>
          </Card>
        </GridItem>
        {this.updateBudgetList()}
      </GridContainer>
    );
  }
}

export default connect(mapStateToProps, {createBudget, updateBudget, deleteBudget})(withStyles(styles)(Budgets));
