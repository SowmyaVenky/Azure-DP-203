import React, { Component } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var updateInterval = 500;
class DynamicColumnChart extends Component {
	constructor() {
		super();
		this.updateChart = this.updateChart.bind(this);
		this.timer = null;
	}
	componentDidMount(){
		if(this.timer === null)
			setTimeout(this.updateChart, updateInterval);
	}
	updateChart() {
		if(this.chart) {
			var dpsColor, dpsTotal = 0, deltaY, yVal;
			var dps = this.chart.options.data[0].dataPoints;
			
			for (var i = 0; i < dps.length; i++) {
				deltaY = Math.round(2 + Math.random() *(-2-2));
				yVal = deltaY + dps[i].y > 0 ? (deltaY + dps[i].y < 100 ? dps[i].y + deltaY : 100) : 0;
				dpsColor = yVal >= 90 ? "#e40000" : yVal >= 70 ? "#ec7426" : yVal >= 50 ? "#81c2ea" : "#88df86 ";
				dps[i] = {label: "Sensor "+(i+1) , y: yVal, color: dpsColor};
				dpsTotal += yVal;
			}
			this.chart.options.data[0].dataPoints = dps;
			this.chart.options.title.text = "Overall Efficiency " + Math.round(dpsTotal / 16) + "%";
			this.chart.render();
			setTimeout(this.updateChart, updateInterval);
		}
	}
	render() {
		const options = {
			theme: "dark2",
			title: {
				text: ""
			},
			subtitles: [{
				text: "Multi-point Inspection System"
			}],
			axisY: {
				title: "Load (%)",
				suffix: "%",
			maximum: 100
			},
			data: [{
				type: "column",
				yValueFormatString: "#,###'%'",
				indexLabel: "{y}",
				dataPoints: [
					{ label: "Sensor 1", y: 68 },
					{ label: "Sensor 2", y: 32 },
					{ label: "Sensor 3", y: 18 },
					{ label: "Sensor 4", y: 87 },
					{ label: "Sensor 5", y: 32 },
					{ label: "Sensor 6", y: 12 },
					{ label: "Sensor 7", y: 14 },
					{ label: "Sensor 8", y: 26 },
					{ label: "Sensor 9", y: 46 },
					{ label: "Sensor 10", y: 46 },
					{ label: "Sensor 11", y: 62 },
					{ label: "Sensor 12", y: 22 },
					{ label: "Sensor 13", y: 64 },
					{ label: "Sensor 14", y: 26 },
					{ label: "Sensor 15", y: 36 },
					{ label: "Sensor 16", y: 86 }
				]
			}]
		}
		
		return (
		<div>
			<h1>Deloreans Auto Multi-point IoT Sensor</h1>
			<CanvasJSChart options = {options} 
				onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default DynamicColumnChart;