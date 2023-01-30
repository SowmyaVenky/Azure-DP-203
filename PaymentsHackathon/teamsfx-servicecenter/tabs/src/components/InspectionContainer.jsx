import { useContext } from "react";
import { Inspection } from "./sample/Inspection";
import { TeamsFxContext } from "./Context";
import config from "./sample/lib/config";

const showFunction = Boolean(config.apiName);

export default function InspectionContainer() {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <div className={themeString === "default" ? "" : "dark"}>
      <Inspection showFunction={showFunction} />
    </div>
  );
}
