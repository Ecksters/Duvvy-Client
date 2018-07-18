import React from "react";

// core components
import Wizard from "components/Wizard/Wizard.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import Step1 from "./BulkImportSteps/Step1";
import Step2 from "./BulkImportSteps/Step2";
import Step3 from "./BulkImportSteps/Step3";

class BulkImportView extends React.Component {
  finishButtonClick = () => {
    this.props.history.push(`/transactions`)
  }

  render() {
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={8}>
          <Wizard
            validate
            steps={[
              { stepName: "Data Prep", stepComponent: Step1, stepId: "data" },
              { stepName: "Upload", stepComponent: Step2, stepId: "upload" },
              { stepName: "Import", stepComponent: Step3, stepId: "import" }
            ]}
            title="Bulk Transaction Import"
            subtitle="Upload hundreds or thousands of transactions all at once"
            finishButtonClick={this.finishButtonClick}
            finishButtonText="See Transactions"
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default BulkImportView;
