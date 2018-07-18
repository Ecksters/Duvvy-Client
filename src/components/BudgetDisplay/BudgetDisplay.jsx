import React from "react";
import store from "store"
import moment from "moment"
import { updateCategory } from "actions/categoryActions"

import Button from "components/CustomButtons/Button.jsx";

import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Select from "react-select";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.jsx";

import AccountBalanceWallet from "@material-ui/icons/AccountBalanceWallet";
import Close from "@material-ui/icons/Close";
import Edit from "@material-ui/icons/Edit";


const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

const budgetSort = (a,b) => ((a.label < b.label) ? -1 : ((a.label > b.label) ? 1 : 0))

function getMonthlyTotals(budgetId) {
  let budgetMonthTotal = 0;
  let budgetPreviousMonthTotal = 0;

  const budgetCategories = store.getState().categories.filter((category) => category.budget_id === budgetId);
  
  const budgetTransactions = store.getState().transactions.filter((transaction) => 
    budgetCategories.find((category) => category.id === transaction.category_id) !== undefined);
  budgetTransactions.forEach((transaction) => {
    const transactionDate = moment(transaction.date);
    if(transactionDate.isSame(moment(), 'month')) {
      budgetMonthTotal += Number(transaction.amount);
    } else
    if (transactionDate.isSame(moment().date(0), 'month')) {
      budgetPreviousMonthTotal += Number(transaction.amount);
    }
  });

  return {budgetMonthTotal, budgetPreviousMonthTotal}
}

function listCategories(budgetId) {
  let budgetCategories = [];
  const categories = store.getState().categories;
  let renderedCategories = categories.reduce((categoryOptions, category, index, self) => {
    budgetCategories.push({
      value: 'cat' + category.id,
      label: category.title,
      disabled: category.budget_id !== null
    })
    if(category.budget_id === budgetId) {
      
      return categoryOptions.concat(budgetCategories[index])
    }
    return categoryOptions;
  }, []);

  function categoryModified(value, action) {
    switch(action.action) {
      case "remove-value":
        store.dispatch(updateCategory({id: action.removedValue.value.slice(3), budget_id: null}));
        break;
      case "select-option":
        store.dispatch(updateCategory({id: action.option.value.slice(3), budget_id: budgetId}));
        break;
      default: break;
    }
  }

  budgetCategories = budgetCategories.sort(budgetSort);
  renderedCategories = renderedCategories.sort(budgetSort);
  return (
    <Select
      defaultValue={renderedCategories}
      isMulti
      isClearable={false}
      name="colors"
      onChange={categoryModified}
      options={budgetCategories}
      className="basic-multi-select"
      classNamePrefix="select"
      isOptionDisabled={(option) => option.disabled}
    />
  );
}

function BudgetDisplay({ ...props }) {
  const budget = props.budget;
  const editHandler = props.edit;
  const deleteHandler = props.delete;
  const totals = getMonthlyTotals(budget.id);
  return (
    <GridItem xs={12} lg={6}>
      <Card>
        <CardHeader color="info">
          <CardIcon color="success">
            <AccountBalanceWallet />
          </CardIcon>
          <h4 style={{float: 'left'}}>{budget.title}</h4>
          <h5 style={{float: 'right'}}>{'Limit: ' + formatter.format(budget.goal) + ' / Month'}{" "}
              <Button justIcon round size="sm" color="warning"
                onClick={(e) => {
                  editHandler(budget);
                  }}> 
                <Edit />
              </Button>
              <Button justIcon round size="sm" color="danger"
                onClick={(e) => deleteHandler(budget)}> 
                <Close />
              </Button>
            </h5>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={6}>
              {listCategories(budget.id)}
            </GridItem>
            <GridItem xs={6}>
                {moment().format('MMMM YYYY')}: {formatter.format(totals.budgetMonthTotal)} to date
                <CustomLinearProgress
                      variant="determinate"
                      color={(totals.budgetMonthTotal/budget.goal)*100 >= 100 ? 'rose' : 'info'}
                      value={totals.budgetMonthTotal/budget.goal*100}
                />
                {moment().date(0).format('MMMM YYYY')}: {formatter.format(totals.budgetPreviousMonthTotal)}
                <CustomLinearProgress
                      variant="determinate"
                      color={(totals.budgetPreviousMonthTotal/budget.goal)*100 >= 100 ? 'rose' : 'success'}
                      value={totals.budgetPreviousMonthTotal/budget.goal*100}
                />
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    </GridItem>
  );
}

export default BudgetDisplay;