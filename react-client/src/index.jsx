import React from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      speed: 1,
    };
    this.incrementSpeed = this.incrementSpeed.bind(this);
    this.decrementSpeed = this.decrementSpeed.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/items', 
      success: (data) => {
        console.log(data);
        this.setState({
          items: data,
        });
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  renderPlayer() {
    return (
      <audio className="player" controls>
        <source src="Freakonomics - htbh.mp3" type="audio/mpeg"/>
        Your browser does not support playing this file.
      </audio>
    );
  }

  incrementSpeed() {
    this.setState(prevState => ({ speed: prevState.speed + 0.1 }));
  }

  decrementSpeed() {
    this.setState(prevState => ({ speed: prevState.speed - 0.1 }));
  }

  updateState({ played, loaded }) {
    this.setState({
      played,
      loaded,
    })
  }

  renderSpeedControls() {
    return (
      <div>
        <button type="button" onClick={this.incrementSpeed}>+</button>
        <div>{this.state.speed}</div>
        <button type="button" onClick={this.decrementSpeed}>-</button>
      </div>
    );
  }

  render () {
    return (
      <div>
        <h1>
          Speedcast
        </h1>
        <ReactPlayer
          url="https://content.production.cdn.art19.com/episodes/e379802b-e812-4148-bafc-ef338379d0f7/1eff18a0c2eb8828ce9865b63fa6edfda6381b4c0cff924745e7c0c622e7046cd7c5ea23fc980e54f93cd0680ef67bdcae761acd4cb7c39dc2285ffd38d4db70/PC%20HAPPINESS%20MIX%20GR%20180815%20R1.mp3"
          controls
          width='100%'
          playbackRate={this.state.speed}
          onProgress={this.updateState}
        />
        {this.renderSpeedControls()}
        <progress value={this.state.played} max='1'/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
