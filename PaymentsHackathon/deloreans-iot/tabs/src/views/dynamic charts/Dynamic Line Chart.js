import React, { Component } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var dps = [
	{x: 1, y: 10}, 
	{x: 2, y: 13}, 
	{x: 3, y: 18}, 
	{x: 4, y: 20}, 
	{x: 5, y: 17},
	{x: 6, y: 10},
	{x: 7, y: 13}, 
	{x: 8, y: 18},
	{x: 9, y: 20}, 
	{x: 10, y: 27},
	{x: 11, y: 30}, 
	{x: 12, y: 43}, 
	{x: 13, y: 28}, 
	{x: 14, y: 40}, 
	{x: 15, y: 67},
	{x: 16, y: 50},
	{x: 17, y: 43}, 
	{x: 18, y: 58},
	{x: 19, y: 20}, 
	{x: 20, y: 17},
	{x: 21, y: 60}, 
	{x: 22, y: 73}, 
	{x: 23, y: 88}, 
	{x: 24, y: 60}, 
	{x: 25, y: 87},
	{x: 26, y: 90},
	{x: 27, y: 33}, 
	{x: 28, y: 58},
	{x: 29, y: 40}, 
	{x: 30, y: 67}
];   //dataPoints.
var xVal = dps.length + 1;
var yVal = 15;
var updateInterval = 1000;

class DynamicLineChart extends Component {
	constructor() {
		super();
		this.updateChart = this.updateChart.bind(this);
		this.timer = null;
	}
	componentDidMount() {
		if(this.timer == null)
			this.timer = setTimeout(this.updateChart, updateInterval);
	}
	updateChart() {
		if(this.chart) {
			yVal = yVal +  Math.round(5 + Math.random() *(-5-5));
			dps.push({x: xVal,y: yVal});
			xVal++;
			if (dps.length >  10 ) {
				dps.shift();
			}
			this.chart.render();
			setTimeout(this.updateChart, updateInterval);
		}
	}
	render() {
		const options = {
			title :{
				text: "Multi-Point Temperature Scans"
			},
			data: [{
				type: "spline",
				dataPoints : dps
			}]
		}
		
		return (
		<div>
			<CanvasJSChart options = {options} 
				onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default DynamicLineChart;