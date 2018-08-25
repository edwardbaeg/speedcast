import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    $.ajax({
      url: '/items', 
      success: (data) => {
        this.setState({
          items: data,
        });
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  render () {
    return (
      <div>
        <h1>
          Speedcast
        </h1>
        <audio className="player" controls>
          <source src="Freakonomics - htbh.mp3" type="audio/mpeg"/>
          Your browser does not support playing this file.
        </audio>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
