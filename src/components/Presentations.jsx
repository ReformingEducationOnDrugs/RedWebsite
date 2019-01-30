import React, { Component } from 'react';
import { Row, Col, Grid, Panel, Table, NavItem } from 'react-bootstrap';
import Presentation from "../components/Presentation";
import '../styles/loaderStyle.css';
import netlifyIdentity from "netlify-identity-widget";

class Presentations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading:true,
      presentations: [],
    };

    this.sendPresentations = this.sendPresentations.bind(this);
    this.convertAndSavePresentation = this.convertAndSavePresentation.bind(this);
  }

  componentDidMount() {
    netlifyIdentity.init();
    this.generateHeaders().then((headers) =>
      fetch('/.netlify/functions/getPresentations', {
        headers,
        method: 'POST',
      }).then(response => this.updateUI(response)));
  }

  updateUI(response){
    response.text().then(
      body => {
        let presentations = JSON.parse(body);
        presentations.map(presentation => presentation.times.forEach(
          //time => time.selected = time.selected ? "Confirmed" : "Unselected"
          time => {if (time.selected) {
            time.selected = "Confirmed";
          } else if (time.enrolled == time.capacity) {
            time.selected = "Full";
          } else {
            time.selected = "Unselected";
          }}
        ));
        this.setState({ presentations: presentations, isLoading: false});
      }
    );
  }

  generateHeaders() {
    const headers = { "Content-Type": "application/json" };
    if (netlifyIdentity.currentUser()) {
      return netlifyIdentity.currentUser().jwt().then((token) => {
        return { ...headers, Authorization: `Bearer ${token}` };
      });
    }
    return Promise.resolve(headers);
  }

  sendPresentations(presentations){
    this.setState({isLoading:true});

    this.generateHeaders().then( headers =>
      fetch('/.netlify/functions/savePresentations', {
      body: JSON.stringify(presentations), // PASS IN JSON OBJECT
      method: 'POST',
      headers})
        .then(response => this.updateUI(response))
        .catch(error => console.log("JSON.stringify(error): " + JSON.stringify(error))
    ));

      // window.location.reload();
  }

  convertAndSavePresentation(){
    const { presentations, isLoading } = this.state;
    console.log("presentations.length: " + presentations.length);
    console.log("1. JSON.stringify(presentations): " + JSON.stringify(presentations));

    presentations.forEach(presentation => presentation.times.forEach(
      time =>{
        switch (time.selected) {
          case "Selected":
          case "Confirmed":
            time.selected = true;
            break;
          case "Full":
          case "Unselected":
            time.selected = false;
            break;
        }
      return time;
    }));

    console.log("2. JSON.stringify(presentations): " + JSON.stringify(presentations));
    this.sendPresentations(presentations);
  }

  render() {
    const { presentations,isLoading } = this.state;
    console.log("Presentation");
    console.log(presentations);

    return (
      <Row>
        <Row >
          <Col md={12} style={{height: '550px', overflowY: 'scroll'}}>
            {
              isLoading ? <div className="loader" /> : presentations.map(presentation => <Presentation key={presentation.sheetname} presentation={presentation}/>)
            }
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <button
              className="pull-right"
              style={{
                color: '#FFFFFF',
                backgroundColor: '#EF233C',
                padding: '15px 30px',
                borderRadius: '30px',
                fontSize: '16px',
                border: '0',
                marginTop: '30px',
              }}
              onClick={this.convertAndSavePresentation}>
                Sign up for presentations
            </button>
          </Col>
        </Row>
      </Row>
    );
  }

}

export default Presentations;
