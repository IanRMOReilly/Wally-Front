import React, { Component } from 'react';
import Gallery from 'react-photo-gallery';
import Timer from 'react-timer-component';
import PropTypes from 'prop-types';
import p1 from './images/1.jpg';
import p2 from './images/2.jpg';
import p3 from './images/3.jpg';
// import p4 from './images/4.jpg';
import EY from './images/EY_logo_Plain.png';
import example from './images/example.gif';
import './App.css';

let images = [
  p1,
  p2,
  p3
];

let found_images = [
p1,
p2,
p3
];

class App extends Component {
  constructor(props) {
  super(props);
  this.state = {Human_Final:0, AI_Final: 0, GameRunning:true};
  this.EndGame = this.EndGame.bind(this);
}


EndGame(x,y){
  this.setState({Human_Final:x});
  this.setState({AI_Final:y});
  this.setState({GameRunning:false});
}

  render() {
    let Page;
    const GameRunning = this.state.GameRunning;

    if (GameRunning){
      Page = <GamePage EndGame={this.EndGame} HumanCorrectHandler={this.HumanCorrectHandler} human_correct={this.state.human_correct} AI_correct={this.state.AI_correct}/>
    } else {
      Page = <EndPage Human_Final={this.state.Human_Final} AI_Final={this.state.AI_Final}/>
    }
    return (<div>{Page}</div>);
}
}

class GamePage extends Component {
  constructor(props) {
  super(props);
  this.HumanCorrectHandler = this.HumanCorrectHandler.bind(this);
  this.state = {human_correct: 0, AI_correct: 0};
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
      req.open('GET', "http://127.0.0.1:5000/AI_Correct");
      req.send();
  }, 500);
}

  HumanCorrectHandler(){
    this.setState(prevState =>({
      human_correct: prevState.human_correct + 1
    }));
  }

render() {
   return(
      <div className="App">
        <header className="App-header">
        <img className="App-logo" src={EY}/>
          <h1 className="App-title">Where's Waldo?</h1>
        </header>
        <div>
        <label className="Score-Label">EXECUTIVES vs. AI</label>
        </div>
        <div>
        <label className="Score">{this.state.human_correct} : {this.state.AI_correct}</label>
        </div>
        <div className='side-by-side'>
        <div id = 'left_block' className='left_half'>
        <ImageBox id = "w_img"  images={images} HumanCorrectHandler = {this.HumanCorrectHandler}/>
        </div>
        <div id = 'right_block' className='right_half'>
        <StartGame  EndGame={this.props.EndGame} human_correct={this.state.human_correct} AI_correct={this.state.AI_correct}/>
        </div>
        </div>
      </div>
      );
 }
 }

   class EndPage extends Component {
      constructor(props) {
      super(props);
      }

      render() {
      return(
            <div className="App">
        <header className="App-header">
        <img className="App-logo" src={EY}/>
          <h1 className="App-title">Where's Waldo?</h1>
        </header>
      <h1>Time is up!</h1>
      <p>You Scored: {this.props.Human_Final} Points... :(</p>
      <h1>The AI Scored: {this.props.AI_Final}!</h1>
      <img src={example}/>
      <Gallery photos={found_images} />
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
        <div className='side-by-side'>
        <button className='green_button' id = 'found_button' onClick={this.addCurrent}>Found Him!</button>
        <img src={cImage} key={cImage} className="human_game" id = "human_game"/>
        </div>
      </div>
    );
  }
}

class StartGame extends Component {
  constructor(props) {
    super(props);
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleEndClick = this.handleEndClick.bind(this);
    this.state = {isStarted: false};
  }

  handleStartClick() {
    this.setState({isStarted: false});
  }

  handleEndClick() {
    this.setState({isStarted: true});
  }

  render() {
    const isStarted = this.state.isStarted;
    let button;

    if (isStarted) {
      button = null;
    } else {
      button = <EndButton onClick={this.handleEndClick} />;
    }

    return (
      <div>
        <StartBox isStarted={isStarted}  EndGame={this.props.EndGame} human_correct={this.props.human_correct} AI_correct={this.props.AI_correct}/>
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
    <h1  id='countdown'>Time Left:{`${seconds}`}!</h1>
  );
}

Countdown.contextTypes = {
  remaining: PropTypes.number,
}

class StartBox extends React.Component {
    constructor(props) {
    super(props);
    this.EndBuffer = this.EndBuffer.bind(this);
  }

  EndBuffer(){
    this.props.EndGame(this.props.human_correct,this.props.AI_correct);
  }


  render() {
    const isStarted = this.props.isStarted;
    let Page;

    if (isStarted){
      Page = 
      <div className="Vert" >
      <div className="top">
      <Timer id = 'timer' remaining={60000} interval={1000} afterComplete={this.EndBuffer}>
      <Countdown/>
      </Timer>
      </div>
      <p id = 'ai_feed_label'>AI FEED</p>
      <img className = "vid" id = "w_img" src="http://127.0.0.1:5000/wally_feed"/>
      </div>
    } else {
      Page = <h1 id = 'countdown'>60</h1>
    }
    return (<div>{Page}</div>);
}
}

function EndButton(props) {
  return (
    <button onClick={props.onClick} className='green_button' id = 'found_button'>
      Start
    </button>
  );
}

export default App;
