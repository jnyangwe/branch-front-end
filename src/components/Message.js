import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';

export default class Message extends React.Component {
    render(){
      return (<div className="container-fluid border border-primary">
        <p>customer name: 
          <b>{this.props.message.customerName} </b> 
        </p>
        <p>{this.props.message.urgent?(<b>Urgent </b>):null}customer issue: {this.props.message.message}</p>
        {this.props.message.answer?
          (<p>answer: {this.props.message.answer}</p>):
          (<button className={"btn btn-primary"} onClick={this.props.showMessage}>answer</button>)}
        
      </div>)
    }
  }