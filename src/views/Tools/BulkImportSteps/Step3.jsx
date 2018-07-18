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
  }
}

class Step3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleSelect: "",
      desgin: false,
      code: false,
      develop: false
    };
  }
  sendState() {
    return this.state;
  }
  handleSimple = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  isValidated() {
    return true;
  }
  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h1 className={classes.infoText}>Success!</h1>
          <h3 className={classes.infoText}>Finished importing new items, switch to the Transactions page to see how it looks!</h3>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(style)(Step3);
