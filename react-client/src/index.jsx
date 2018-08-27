import React from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      currentItem: 0,
      speed: 1,
      played: 0,
      loaded: 0,
      playing: false,
    };

    this.shortcuts = {
      j: true,
      k: true,
    };

    this.incrementSpeed = this.incrementSpeed.bind(this);
    this.decrementSpeed = this.decrementSpeed.bind(this);
    this.updateState = this.updateState.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const { currentItem } = this.state;
    axios.get('/podcasts')
      .then(({ data }) => {
        this.setState({
          items: data,
          speed: data[currentItem].speed,
          startTime: data[currentItem].playedSeconds,
        });
      })
      .catch(error => console.log(error));

    window.addEventListener('beforeunload', (e) => {
      const { speed, currentItem, playedSeconds } = this.state;
      e.preventDefault();
      axios.post('/settings', {
        currentItem,
        speed,
        playedSeconds,
      })
        .then((response) => console.log(response))
        .catch((error) => console.log('POST error', error));
    });

    document.addEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.key in this.shortcuts) {
      console.log('key pressed!');
    }
  }

  incrementSpeed() {
    this.setState(prevState => ({ speed: +(prevState.speed + 0.1).toFixed(1) }));
  }

  decrementSpeed() {
    this.setState(prevState => ({ speed: +(prevState.speed - 0.1).toFixed(1) }));
  }

  updateState({ played, loaded, playedSeconds }) {
    this.setState({
      played,
      loaded,
      playedSeconds,
    });
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
    const { speed, items, currentItem, playing } = this.state;
    return (
      <div>
        <h1>
          Speedcast!
        </h1>
        <ReactPlayer
          controls
          playing={playing}
          url={items[currentItem] !== undefined ? items[currentItem].url : '' }
          width='100%'
          height='50px'
          playbackRate={speed}
          onProgress={this.updateState}
        />
        {this.renderSpeedControls()}
        <progress value={this.state.played} max='1'/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
