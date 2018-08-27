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
      isResumed: false,
    };

    const context = this;
    this.shortcuts = {
      j() {
        context.decrementSpeed();
      },

      k() {
        context.incrementSpeed();
      },

      h() {
        context.skipBackward();
      },

      l() {
        context.skipForward();
      }
    };

    this.incrementSpeed = this.incrementSpeed.bind(this);
    this.decrementSpeed = this.decrementSpeed.bind(this);
    this.updateState = this.updateState.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.resumeTime = this.resumeTime.bind(this);
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
      this.shortcuts[event.key]();
    } else if (event.key === ' ') {
      this.togglePlay();
    }
  }

  incrementSpeed() {
    this.setState(prevState => ({ speed: +(prevState.speed + 0.1).toFixed(1) }));
  }

  decrementSpeed() {
    this.setState(prevState => ({ speed: +(prevState.speed - 0.1).toFixed(1) }));
  }

  skipForward() {
    const { playedSeconds } = this.state;
    this.player.seekTo(playedSeconds + 5);
  }

  skipBackward() {
    const { playedSeconds } = this.state;
    this.player.seekTo(playedSeconds - 5);
  }

  togglePlay() {
    this.setState(prevState => ({ playing: !prevState.playing }));
  }

  resumeTime() {
    if (!this.state.isResumed) {
      const { startTime } = this.state;
      this.setState({ isResumed: true });
      this.player.seekTo(startTime);
    }
  }

  updateState({ played, loaded, playedSeconds }) {
    this.setState({
      played,
      loaded,
      playedSeconds,
    });
  }

  convertSecondsToMin(s) {
    return(s-(s%=60))/60+(9<s?':':':0')+s.toFixed(0);
  }

  renderMessage() {
    const { items, currentItem, speed, playing, playedSeconds} = this.state;
    const title = items[currentItem] !== undefined ? items[currentItem].title : 'loading...';
    const channel = items[currentItem] !== undefined ? items[currentItem].channel : 'loading...';
    const playingStatus = playing ? 'playing' : 'paused';
    const currentTime = playedSeconds ? this.convertSecondsToMin(playedSeconds) : 'loading...';
    const duration = this.player ? this.convertSecondsToMin(this.player.getDuration()) : 'loading...';
    return (
      <div>
        <div>
          {`Hi! You are listening to ${title} by ${channel},`}
        </div>
        <div>
          {`at ${speed} times speed,`}
        </div>
        <div>
          {`currently ${playingStatus} at ${currentTime} / ${duration}`}
        </div>
      </div>
    )
  }

  renderShortcuts() {
    return (
      <div>
        <div>
          &lt;j&gt; speed down
        </div>
        <div>
          &lt;k&gt; speed up
        </div>
        <div>
          &lt;space&gt; speed up
        </div>
      </div>
    );
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

  render() {
    const { speed, items, currentItem, playing } = this.state;
    return (
      <div>
        <h1>
          Speedcast!
        </h1>
        {this.renderMessage()}
        <ReactPlayer
          ref={(player) => this.player = player}
          controls
          playing={playing}
          url={items[currentItem] !== undefined ? items[currentItem].url : '' }
          width='100%'
          height='50px'
          playbackRate={speed}
          progressInterval={100}
          onProgress={this.updateState}
          onReady={this.resumeTime}
        />
        <progress value={this.state.played} max='1'/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
