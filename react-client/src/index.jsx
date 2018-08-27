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
    };
    this.incrementSpeed = this.incrementSpeed.bind(this);
    this.decrementSpeed = this.decrementSpeed.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    axios.get('/podcasts')
      .then(({ data }) => {
        this.setState({
          items: data,
          speed: data[this.state.currentItem].speed,
        });
      })
      .catch(error => console.log(error));

    window.addEventListener('beforeunload', (e) => {
      const { speed, currentItem } = this.state;
      e.preventDefault();
      axios.post('/settings', {
        speed,
        currentItem,
      })
        .then((response) => console.log(response))
        .catch((error) => console.log('POST error', error));
    });
  }

  renderPlayer() {
    return (
      <audio className="player" controls>
        <source src={this.state.items[this.state.currentItem]} type="audio/mpeg"/>
        Your browser does not support playing this file.
      </audio>
    );
  }

  incrementSpeed() {
    this.setState(prevState => ({ speed: +(prevState.speed + 0.1).toFixed(1) }));
  }

  decrementSpeed() {
    this.setState(prevState => ({ speed: +(prevState.speed - 0.1).toFixed(1) }));
  }

  updateState({ played, loaded }) {
    this.setState({
      played,
      loaded,
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
    const { speed, items, currentItem } = this.state;
    return (
      <div>
        <h1>
          Speedcast
        </h1>
        <ReactPlayer
          controls
          url={items[currentItem] !== undefined ? items[currentItem].url : '' }
          width='100%'
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
