import React, { Component } from 'react';
import ReactGlobe from 'react-globe';
import axios from 'axios';
import { Collapse } from 'antd';
import 'antd/dist/antd.css';
import { EyeOutlined, UpSquareOutlined, DownSquareOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

class App extends Component {

  state = {
    markers: [],
    animations: [],
    collapse: true
  }

  async componentDidMount() {
    const { data } = await axios.get('https://corona-wrapper.herokuapp.com/api/data');
    // console.log(data);
    const markers = data.areas.reduce((acc, curr) => {
      // const mark = curr.areas.length ? curr.areas.map(x => { return { id: x.id, coordinates: [x.lat, x.long], value: 5 } }) : [{ id: curr.id, coordinates: [curr.lat, curr.long], value: 15 }];
      // acc.push(...mark);
      acc.push({ 
        id: curr.id,
        animationDuration: 2000, 
        coordinates: [curr.lat, curr.long], 
        value: curr.totalDeaths || 0, 
        totalConfirmed: curr.totalConfirmed || 0, 
        totalDeaths: curr.totalDeaths || 0, 
        totalRecovered: curr.totalRecovered || 0, 
        displayName: curr.displayName,
        color: curr.totalConfirmed > 10000 ? '#450000' : (curr.totalConfirmed > 1000 ? '#ff0000' : (curr.totalConfirmed < 50 ? '#ff9900' : '#ff5c5c')), 
        distanceRadiusScale: 1.5,
        easingFunction: ['Cubic', 'InOut']
      });
      return acc;
    }, []);
    // console.log(markers);
    this.setState({ markers});
  }

  render() {
    return(
      <div style={{ width: '100vw', height: '100vh' }}>
      <ReactGlobe
        markers={this.state.markers}
        markerOptions={{
          activeScale: 1,
          enableTooltip: true,
          enterAnimationDuration: 3000,
          enterEasingFunction: ['Bounce', 'InOut'],
          exitAnimationDuration: 3000,
          exitEasingFunction: ['Cubic', 'Out'],
          getTooltipContent: marker => `${marker.displayName} <br/> Total Confirmed: ${marker.totalConfirmed} <br/> Total Recovered: ${marker.totalRecovered} <br/> Total Deaths: ${marker.totalDeaths}`,
          radiusScaleRange: [0.005, 0.01],
        }}
        animations={this.state.animations}
        />
        <div style={{ width: '15rem', maxHeight: '12rem', overflowY:'auto', position: 'fixed', bottom: '0', left: '0' }}>
          {this.state.collapse ? <DownSquareOutlined style={{ color: '#fff', display: 'block', fontSize: '1.5rem' }} onClick={() => this.setState({ collapse: !this.state.collapse })} /> : <UpSquareOutlined style={{ color: '#fff', display: 'block', fontSize: '1.5rem' }} onClick={() => this.setState({ collapse: !this.state.collapse })}/>}
          <Collapse style={{ display: this.state.collapse ? 'block' : 'none' }} accordion>
            {this.state.markers.map((x,i)  => {
              return (
                <Panel header={x.displayName} key={`${x.id}_${i}`} extra={<EyeOutlined onClick={() => this.setState({ animations: [x] })}/>}>
                  <p>Total Confirmed: {x.totalConfirmed}</p>
                  <p>Total Active: {x.totalConfirmed - x.totalRecovered - x.totalDeaths}</p>
                  <p>Total Recovered: {x.totalRecovered}</p>
                  <p>Total Deaths: {x.totalDeaths}</p>
                </Panel>
              );
            })}
          </Collapse>
        </div>
      </div>
    );
  }
}

export default App;
