import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Popup from './components/Popup';
import Message from './components/Message';
import openSocket from 'socket.io-client';
const url = "https://secret-sea-18750.herokuapp.com";
const socket = openSocket(url);

class App extends Component {
  constructor() {
    super();
    this.state = {
      showAgentLogin: true,
      agentName:"",
      agentSignUpError: "",
      messageError:"",
      messages:[],
      messagesDict:{},
      activeMessage:null,
      activeMessageAnswer: "",
      showMessage:false
    };
  }

  componentDidMount(){
    socket.on('message', this.addMessages.bind(this));
    socket.on('answer', this.updateMessage.bind(this));
    this.loadMessages();
  }

  /** Loads all messages, answered and not answered */
  loadMessages(){
    fetch(url + "/messages").
    then( res => {
      return res.json()
    })
    .then((data) => {      
      const messageDict = {}
      data.forEach(msg => {
        messageDict[msg._id] = msg
      });
      this.setState({messages:data, messageDict});

    })
    .catch(error => console.log(error));
  }

  /** Updates this.state.messageDict with new values of message */
  updateMessage(message){  
    if (message._id in this.state.messagesDict){
      this.state.messagesDict[message._id].answer = message.answer;
      this.state.messagesDict[message._id].agentName = message.agentName;
      this.setState({messsages: this.state.messages.concat([])});   
    }
  }

  /** creates new messages */
  addMessages(message){
    this.state.messagesDict[message._id] = message;
    this.setState((prevState) => ({
      ...prevState,
      messages: prevState.messages.concat([message])
    }));
  }

  updateAgentName(event){
    this.setState({agentName: event.target.value });
  }

  submitAgentNameForm(event){
    event.preventDefault();
    if (this.state.agentName.length > 0){
      this.setState({ showAgentLogin:false, agentSignUpError:""});
    }else{
      this.setState({agentSignUpError: "Agent name field cannot be empty"})
    }
  }

  answerMessage(message){
    if (this.state.activeMessageAnswer.length > 0){
      message.answer = this.state.activeMessageAnswer;
      message.agentName = this.state.agentName;
      fetch(url + "/answer", {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then(res => {
        if (res.status === 200){
          this.setState({activeMessage:null, activeMessageAnswer:"", showMessage:false})
        }else{
          this.setState({messageError: "Error submitting message"});
        }
      })
      .catch(error => {
        console.log(error);
      })
    }else{
      this.setState({messageError:"The answer cannot be empty"});
    }   
  }

  updateAnswer(event){
    event.preventDefault();
    this.setState({activeMessageAnswer: event.target.value});
  }

  showMessage(message, event){
    event.preventDefault();
    this.setState({activeMessage:message, showMessage:true, messageError:"", activeMessageAnswer:""});
  }

  hideMessage(event){
    event.preventDefault();
    this.setState({activeMessage:null, showMessage:false, messageError:"", activeMessageAnswer:"" });
  }

  renderAgentLogin(){
    return (<Popup>
      {this.state.agentSignUpError.length > 0 && (<p>
        {this.state.agentSignUpError}
      </p>)}
      <form onSubmit={this.submitAgentNameForm.bind(this)}>
        <p>Please login by giving us your username</p>
        <label>Username: 
          <input value={this.state.agentName} onChange={this.updateAgentName.bind(this)} type="text" name="agentName"/>
        </label>
        <br/>
        <br/>
        <input type="submit" value="login"/>
      </form>
    </Popup>)
  }

  renderMessageDialog(){
    return (
      <Popup>
      {this.state.messageError.length > 0 && (<p>
        {this.state.messageError}
      </p>)}
      <div>
        <p>customer id: <b>{this.state.activeMessage.customerName}</b></p>
        <p>customer issue: {this.state.activeMessage.message}</p>
        <label> 
          <textarea value={this.state.activeMessageAnswer} onChange={this.updateAnswer.bind(this)} type="text" name="answer"/>
        </label>
        <br/>
        <br/>
        <button 
          onClick={() => this.answerMessage(this.state.activeMessage)} 
          value="answer">Answer</button>
        <button 
          onClick={(event) => this.hideMessage(event)} 
          value="cancel">Cancel</button>
      </div>
      </Popup>
    );
  }
  
  render() {
    return (
      <div className="App">
        {this.state.showAgentLogin? this.renderAgentLogin():null}
        {this.state.showMessage? this.renderMessageDialog(): null}
         <p>Agent Name: {this.state.agentName}</p>
         {this.state.messages.map((message, index) => (<Message showMessage={this.showMessage.bind(this, message)} message={message} key={message.name+message.message + index}/>))}
        
      </div>
    );
  }
}

export default App;
