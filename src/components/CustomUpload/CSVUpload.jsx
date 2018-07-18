import React from "react";
import csv from "csvtojson/v2";

class CSVUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      contents: "",
      csvPreviewText: "No CSV file selected",
      uploadDescription: this.props.description || "Choose CSV File"
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleFileChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    let contents = "";
    reader.onload = (event) => {
        contents = event.target.result;
        this.setState({uploadDescription: 'Selected'})
    };

    reader.onloadend = () => {
      this.setState({
        file: file,
        csvPreviewText: file.name
      });
      csv()
      .fromString(contents)
      .then((jsonObj)=>{
        this.props.dataHandler(jsonObj);
      })
    };
    reader.readAsText(file);
  }
  handleSubmit(e) {
    e.preventDefault();
    // this.state.file is the file/image uploaded
    // in this function you can save the image (this.state.file) on form submit
    // you have to call it yourself
  }
  render() {
    return (
      <div className="picture-container">
        <div className="csvFile" style={{marginTop: "15px"}}>
          {this.state.csvPreviewText}
          <input type="file" accept=".csv" onChange={e => this.handleFileChange(e)} />
        </div>
        <h6 className="description">{this.state.uploadDescription}</h6>
      </div>
    );
  }
}

export default CSVUpload;
