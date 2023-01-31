import React, { useState } from "react";
import { Image, Menu } from "@fluentui/react-northstar";
import "./Welcome.css";
import Photos from "./Photos";


export function Welcome(props) {
  const { environment } = {
    environment: window.location.hostname === "localhost" ? "local" : "azure",
    ...props,
  };
  const friendlyEnvironmentName =
    {
      local: "local environment",
      azure: "Azure environment",
    }[environment] || "local environment";

  const steps = ["local", "azure", "publish"];
  const friendlyStepsName = {
    local: "1. Build your app locally",
    azure: "2. Provision and Deploy to the Cloud",
    publish: "3. Publish to Teams",
  };
  const [selectedMenuItem, setSelectedMenuItem] = useState("local");
  const items = steps.map((step) => {
    return {
      key: step,
      content: friendlyStepsName[step] || "",
      onClick: () => setSelectedMenuItem(step),
    };
  });

  return (
    <div className="welcome page">
      <div className="narrow page-padding">
        <Photos />
        {/* <Image src="hello.png" />
        <h1 className="center">Congratulations Todd!</h1>
        <p className="center">Your app is running in your {friendlyEnvironmentName}</p> */}
      </div>
    </div>
  );
}
