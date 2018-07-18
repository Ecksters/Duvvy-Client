import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

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
  inputAdornment: {
    position: "relative"
  }
};

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  isValidated() {
    return true;
  }
  sendState() {
    return this.state;
  }
  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>
            Save in a CSV format, with column headers for "date", "amount", "description" and optionally "category."<br /><br />
            Make sure your dates are formatted YYYY-MM-DD so we can read them properly.<br /><br />
            This software is for expenses only, all expense amounts should be positive.
          </h4>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(style)(Step1);
