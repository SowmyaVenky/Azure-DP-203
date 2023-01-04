import { useContext } from "react";
import { Summary } from "./sample/Summary";
import { TeamsFxContext } from "./Context";
import config from "./sample/lib/config";

const showFunction = Boolean(config.apiName);

export default function TabSummary() {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <div className={themeString === "default" ? "" : "dark"}>
      <Summary showFunction={showFunction} />
    </div>
  );
}
