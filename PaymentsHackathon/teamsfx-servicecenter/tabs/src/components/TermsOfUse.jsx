import React from "react";
import { Video, Text, Flex, Label } from '@fluentui/react-northstar';
/**
 * This component is used to display the required
 * terms of use statement which can be found in a
 * link in the about tab.
 */
class TermsOfUse extends React.Component {
  render() {
    return (
      <div>
        <center><h1>Here are some videos to help you build teams apps!</h1></center>
        <table>
          <tr>
            <td><iframe width="560" height="315" src="https://www.youtube.com/embed/Z5Tu_98mkKQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></td>
            <td><iframe width="560" height="315" src="https://www.youtube.com/embed/9CdvBrYaFOI?list=PLfUOWCSAzqc_9Zp0GYUdH6gNTjQG6RUJ_" title="Bot for the auto dealership teams app." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></td>
          </tr>
          <tr>
            <td><iframe width="560" height="315" src="https://www.youtube.com/embed/iEwwsTZ_c5Y?list=PLfUOWCSAzqc_9Zp0GYUdH6gNTjQG6RUJ_" title="AppAndBotDemo Part1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></td>
            <td><iframe width="560" height="315" src="https://www.youtube.com/embed/9CdvBrYaFOI?list=PLfUOWCSAzqc_9Zp0GYUdH6gNTjQG6RUJ_" title="Bot for the auto dealership teams app." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></td>
          </tr>
          <tr>
            <td><iframe width="560" height="315" src="https://www.youtube.com/embed/uc9IcYKUpcI?list=PLfUOWCSAzqc_9Zp0GYUdH6gNTjQG6RUJ_" title="AppAndBotDemo Part2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></td>
            <td><iframe width="560" height="315" src="https://www.youtube.com/embed/m4eJpceTepk?list=PLfUOWCSAzqc_9Zp0GYUdH6gNTjQG6RUJ_" title="AppAndBotDemo Part3" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></td>
          </tr>
        </table>
      </div>
    );
  }
}

export default TermsOfUse;
