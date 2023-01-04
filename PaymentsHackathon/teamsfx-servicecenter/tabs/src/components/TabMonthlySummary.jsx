import { useContext } from "react";
import { MonthlySummary } from "./sample/MonthlySummary";
import { TeamsFxContext } from "./Context";

import config from "./sample/lib/config";

const showFunction = Boolean(config.apiName);

export default function TabMonthlySummary() {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <div className={themeString === "default" ? "" : "dark"}>
      <MonthlySummary showFunction={showFunction} />
    </div>
  );
}
