import visualize from '../../lib/visualizer.js'
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
      showShortcuts: false,
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
      },
      H() {
        context.prevPodcast();
      },
      L() {
        context.nextPodcast();
      }
    };

    this.incrementSpeed = this.incrementSpeed.bind(this);
    this.decrementSpeed = this.decrementSpeed.bind(this);
    this.updateState = this.updateState.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.resumeTime = this.resumeTime.bind(this);
    this.toggleShortcuts = this.toggleShortcuts.bind(this);
    this.nextPodcast = this.nextPodcast.bind(this);
    this.prevPodcast = this.prevPodcast.bind(this);
  }

  componentDidMount() {
    // visualize(document.getElementById('canvas'), document.getElementById('audio'));
    // document.getElementById('audio').play();
    // console.log(document.querySelector('audio'));
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
    } else if (event.key === '?') {
      this.toggleShortcuts();
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

  nextPodcast() {
    const { items } = this.state;
    this.setState(prevState => {
      let nextIndex = prevState.currentItem + 1;
      if (nextIndex === items.length) {
        nextIndex = 0;
      }
      return { currentItem: nextIndex };
    });
  }

  prevPodcast() {
    const { items } = this.state;
    this.setState(prevState => {
      let nextIndex = prevState.currentItem - 1;
      if (nextIndex === -1) {
        nextIndex = items.length - 1;
      }
      return { currentItem: nextIndex };
    });
  }

  togglePlay() {
    this.setState(prevState => ({ playing: !prevState.playing }));
  }

  toggleShortcuts() {
    this.setState(prevState => ({ showShortcuts: !prevState.showShortcuts }));
  }

  resumeTime() {
    if (!this.state.isResumed) {
      const { startTime } = this.state;
      this.setState({ isResumed: true });
      this.player.seekTo(startTime);

      // console.log('initializing visualizer');
      // visualize(document.querySelector('canvas'), document.querySelector('audio'));
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
          <span className="highlight">{title}</span> by <span className="highlight">{channel}</span>!
        </div>
        <progress value={this.state.played} max='1'/>
        <div>
          at <span className="highlight">{speed}</span> times speed,
        </div>
        <div>
          currently <span className="highlight">{playingStatus}</span> at <span className="highlight">{currentTime}</span> / <span className="highlight">{duration}</span>
        </div>
      </div>
    )
  }

  renderShortcuts() {
    return (
      <div className="shortcuts">
        <div className="left-col">
          &lt;j&gt;
        </div>
        <div>
          speed down
        </div>
        <div className="left-col">
          &lt;k&gt;
        </div>
        <div>
          speed up
        </div>
        <div className="left-col">
          &lt;space&gt;
        </div>
        <div>
          play/pause
        </div>
        <div className="left-col">
          &lt;h&gt;
        </div>
        <div>
          seek forwards 5s
        </div>
        <div className="left-col">
          &lt;l&gt;
        </div>
        <div>
          seek forwards 5s
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
    const { speed, items, currentItem, playing, showShortcuts } = this.state;
    const canvasStyle = {
      padding: 0,
      margin: 0,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
    return (
      <div>
        {this.renderMessage()}
        <ReactPlayer
          ref={(player) => this.player = player}
          controls={false}
          playing={playing}
          url={items[currentItem] !== undefined ? items[currentItem].url : '' }
          width='100%'
          height='50px'
          playbackRate={speed}
          progressInterval={50}
          onProgress={this.updateState}
          onReady={this.resumeTime}
        />
        <canvas style={canvasStyle} id="canvas" width="920px" height="50px"></canvas>
        {showShortcuts && this.renderShortcuts()}
        <div id='footer'>
          Press ? for help
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
