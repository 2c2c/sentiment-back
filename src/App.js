import React, {Component} from 'react';
import logo from './logo.svg';
import axios from 'axios'
import * as V from 'victory'
import moment from 'moment'
import './App.css';
import HourlyChart from './HourlyChart'
import DayChartContainer from './DayChartContainer'
import WeekContainer from './WeekContainer'
import DailyAverageChart from './DailyAverageChart'
import Router from 'react-router/BrowserRouter'
import Match from 'react-router/Match'
import Link from 'react-router/Link'

const Test = () => <div>hi</div>
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: []
    }
  }
  componentDidMount() {
    axios
      .get('/api/hourlytweets')
      .then(resp => {
        this.setState({tweets: resp.data})
      })
  }
  render() {
    const dailyAverage = () => <DailyAverageChart tweets={this.state.tweets}/>
    const weekContainer = () => <WeekContainer tweets={this.state.tweets}/>
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h2>Welcome to React</h2>
          </div>
          <div style={{
            textAlign: 'left'
          }}>
            <div>
              <Link to={"/"}>Home</Link>
            </div>
            <div>
              <Link to={"/dailyaverage"}>Daily Average Sentiment</Link>
            </div>
            <div>
              <Link to={"/hourly"}>Hourly Sentiment</Link>
            </div>
          </div>

          <Match exactly pattern="/" component={Test}/>
          <Match pattern="/dailyaverage" component={dailyAverage}/>
          <Match pattern="/hourly" component={weekContainer}/>
        </div>
      </Router>
    );
  }
}

export default App;
