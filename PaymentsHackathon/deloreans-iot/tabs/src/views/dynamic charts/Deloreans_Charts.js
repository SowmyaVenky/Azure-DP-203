import React from 'react';
import DynamicColumnChart from "../dynamic charts/Dynamic Column Chart";
import DynamicLineChart from "../dynamic charts/Dynamic Line Chart";

const Deloreans_Charts = () => {
  return (
    <table width='100%'>
        <tr><td><DynamicColumnChart /></td></tr>
        <tr><td><DynamicLineChart /></td></tr>
    </table>
  );
};

export default Deloreans_Charts;