import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
import { connect } from "react-redux";
import { readTransactions, createTransaction } from "../actions/transactionActions"
import { mapStateToProps } from "store"

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import CreditCard from "@material-ui/icons/CreditCard";
import Store from "@material-ui/icons/Store";
import InfoOutline from "@material-ui/icons/InfoOutline";
import List from "@material-ui/icons/List";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import AccessTime from "@material-ui/icons/AccessTime";
import DonutSmall from "@material-ui/icons/DonutSmall";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import {
  emailsSubscriptionChart
} from "variables/charts";

import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

class Dashboard extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  generateBarData = () => {
    const transactions = this.props.transactions;
    let months = [];
    let totals = [];
    for(let i = 11; i >= 0; i--) {
      const time = moment().date(0).subtract(i, 'months')
      months[i] = time.format('MMM');
      totals[i] = transactions.reduce((total, transaction) => {
        if(moment(transaction.date).isSame(time, 'month')) {
          total += Number(transaction.amount);
        }
        return total;
      }, 0);
    }
    return {labels: months, series: [totals]};
  }

  generatePieData = () => {
    const transactions = this.props.transactions;
    let categoryTotals = [];
    const monthTotal = transactions.reduce((total, transaction) => {
      if(moment(transaction.date).isSame(moment().date(0), 'month')) {
        if(!categoryTotals[transaction.category_id]) {
          categoryTotals[transaction.category_id] = {sum: Number(transaction.amount), category: transaction.category_id};
        } else {
          categoryTotals[transaction.category_id].sum += Number(transaction.amount);
        }
        total += Number(transaction.amount);
      }
      return total;
    }, 0);
    categoryTotals = categoryTotals.sort((a,b) => b.sum-a.sum).filter(String);
    let series = [];
    const legend = [];
    for(let i = 0; i < 4 && categoryTotals[i]; i++) {
      series[i] = categoryTotals[i].sum / monthTotal * 100
      legend[i] = categoryTotals[i].category ? this.props.categories.find((category) => categoryTotals[i].category === category.id).title : 'Uncategorized'
    }
    series[4] = 0;
    legend[4] = "Other";
    for(let i = 4; i < categoryTotals.length; i++) {
      series[4] += categoryTotals[i].sum / monthTotal * 100
    }
    series = series.filter(String).map((value, index) => Math.round(value))
    return {series,
            name: legend,
            labels: series.map((value, index) => legend[index] + ": " + value + "%")};
  }

  render() {
    const pieData = this.props.transactions.length > 0 ? this.generatePieData() : {}
    const barData = this.props.transactions.length > 0 ? this.generateBarData() : {}
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <CreditCard />
                </CardIcon>
                <p className={classes.cardCategory}>{moment().format('MMMM')} Transactions</p>
                <h3 className={classes.cardTitle}>
                  {this.props.transactions.filter((transaction) => moment(transaction.date).isSame(moment(), 'month')).length}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <List />
                  {this.props.transactions.length} transactions total
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Store />
                </CardIcon>
                <p className={classes.cardCategory}>{moment().format('MMMM')} Expenses</p>
                <h3 className={classes.cardTitle}>
                  {formatter.format(this.props.transactions.reduce(
                    (total, transaction) =>
                      moment(transaction.date).isSame(moment(), 'month') ? total + Number(transaction.amount) : total, 0))}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  {formatter.format(this.props.transactions.reduce((total, transaction) => total + Number(transaction.amount), 0))} Overall
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <InfoOutline />
                </CardIcon>
                <p className={classes.cardCategory}>Uncategorized Transactions</p>
                <h3 className={classes.cardTitle}>
                  {this.props.transactions.reduce((total, transaction) => transaction.category_id === null ? total + 1 : total, 0)}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <LocalOffer />
                  Sort by Category on the Transactions Page to find them
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <DonutSmall />
                </CardIcon>
                <p className={classes.cardCategory}>Categories</p>
                <h3 className={classes.cardTitle}>{this.props.categories.length}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  With {this.props.budgets.length} Budgets
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card chart>
              <CardHeader color="info" className={classes.cardHeaderHover}>
              <ChartistGraph
                  className="ct-chart-white-colors"
                  data={barData}
                  type="Bar"
                  options={{
                    axisX: {
                      showGrid: false
                    },
                    height: '230px',
                    low: 0,
                    chartPadding: {
                      top: 0,
                      right: 5,
                      bottom: 0,
                      left: 0
                    }
                  }}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Monthly Expenses</h4>
                <p className={classes.cardCategory}>
                  You've spent {barData.series ? formatter.format(barData.series[0].reduce(function(a, b) { return a + b; }) / 12) : '$0.00'} per month on average in the past year.
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> updated each month
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card chart>
              <CardHeader color="warning" className={classes.cardHeaderHover}>
                { <ChartistGraph
                  className="ct-chart-white-colors"
                  data={pieData}
                  type="Pie"
                  options={{height: "230px"}}
                  responsiveOptions={[
                    ['screen and (min-width: 640px)', {
                      chartPadding: 30,
                      labelOffset: 20,
                      labelDirection: 'explode'
                    }],
                    ['screen and (min-width: 1024px)', {
                      labelOffset: 30,
                      chartPadding: 20
                    }]]}
                  listener={emailsSubscriptionChart.animation}
                /> }
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>{moment().date(0).format("MMMM")} Expenses Category Breakdown</h4>
                <p className={classes.cardCategory}>
                  Percent of expenses in the top 4 categories from the previous month.
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> updated each month
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

const styledDashboard = withStyles(dashboardStyle)(Dashboard);
export default connect(mapStateToProps, {readTransactions, createTransaction})(styledDashboard);
