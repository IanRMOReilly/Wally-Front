import React, { Component } from 'react';
import Gallery from 'react-photo-gallery';
import Timer from 'react-timer-component';
import PropTypes from 'prop-types';
import p1 from './images/1.jpg';
import p2 from './images/2.jpg';
import p3 from './images/3.jpg';
import './App.css';

let images = [
  p1,
  p2,
  p3
];


class App extends Component {
  constructor(props) {
  super(props);
  this.state = {human_correct: 0, AI_correct: 0};
  this.HumanCorrectHandler = this.HumanCorrectHandler.bind(this);
}

componentDidMount(){
  window.setInterval(() => {
      var req = new XMLHttpRequest();
      req.addEventListener('load', () => {
          this.setState({AI_correct:req.responseText});
      });
      req.addEventListener('error', () => {
          console.log(req.responseText);
      });
      req.addEventListener('abort', () => {
          console.log(req.responseText);
      });
      req.open('GET', 'http://localhost:5000/AI_Correct');
      req.send();
  }, 500);
}

  HumanCorrectHandler(){
    this.setState(prevState =>({
      human_correct: prevState.human_correct + 1
    }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Where's Waldo?</h1>
        </header>
        <label className="Score">{this.state.human_correct} : {this.state.AI_correct}</label>
        <StartGame/>
        <div className='side-by-side'>
        <div className='half'>
        <ImageBox id = "w_img"  images={images} HumanCorrectHandler = {this.HumanCorrectHandler}/>
        </div>
        <div className='AI-box'>
        </div>
        </div>
      </div>
    );
  }
}

class ImageBox extends Component{
  constructor(props) {
      super(props);
      this.state = {
        currentId: 0
      };
      this.setCurrent = this.setCurrent.bind(this);
      this.addCurrent = this.addCurrent.bind(this);
      this.subCurrent = this.subCurrent.bind(this);
  }
  addCurrent(){
    this.props.HumanCorrectHandler();
    this.setCurrent( this.state.currentId + 1);
  }
  subCurrent(){
    this.setCurrent( this.state.currentId - 1);
  }
  setCurrent(id){
    let images = this.props.images || [];
    if (this.props.loop){
      id = (id + images.length) % images.length;
    }else{
      id = (id < 0)? 0: ((id >= images.length)? images.length - 1 : id);
    }
    this.setState({ currentId: id});
  }
  render(){
    let images = this.props.images || [];
    let cImage = images[this.state.currentId];
    return (
      <div className="carousel">
        <img src={cImage} key={cImage} className="human_game"/>
        <button className="next" onClick={this.addCurrent}>Found Him!</button>
      </div>
    );
  }
}

class StartGame extends React.Component {
  constructor(props) {
    super(props);
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleEndClick = this.handleEndClick.bind(this);
    this.state = {isStarted: false};
  }

  handleStartClick() {
    this.setState({isStarted: true});
  }

  handleEndClick() {
    this.setState({isStarted: false});
  }

  render() {
    const isStarted = this.state.isStarted;
    let button;

    if (isStarted) {
      button = <StartButton onClick={this.handleEndClick} />;
    } else {
      button = <EndButton onClick={this.handleStartClick} />;
    }

    return (
      <div>
        <Greeting isStarted={isStarted} />
        {button}
      </div>
    );
  }
}

const Countdown = (props, context) => {
  const d = new Date(context.remaining); // auto passed context.remaining
  const { seconds, milliseconds } = {
    seconds: d.getUTCSeconds(),
    milliseconds: d.getUTCMilliseconds(),
  };
  return (
    <p>{`${seconds}.${milliseconds}`}</p>
  );
}

Countdown.contextTypes = {
  remaining: PropTypes.number,
}

function UserStarted(props) {
  return <h1>Game Has Not Started Yet</h1>;
}

function UserEnded(props) {
  return <h1>Game is Started</h1>;
}

function Greeting(props) {
  const isStarted = props.isStarted;
  if (isStarted) {
    return(
    <div>
    <Timer remaining={60000} interval={20}><Countdown/></Timer>
    <img className = "vid" id = "w_img" src="http://127.0.0.1:5000/wally_feed"/>
    </div>
    );
  }
  return <h1>60</h1>;
}

function StartButton(props) {
  return (
    <button onClick={props.onClick}>
      End
    </button>
  );
}

function EndButton(props) {
  return (
    <button onClick={props.onClick}>
      Start
    </button>
  );
}


export default App;
