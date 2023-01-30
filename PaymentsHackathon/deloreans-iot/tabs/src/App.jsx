import { HashRouter as Router, Redirect, Route } from "react-router-dom";

// https://fluentsite.z22.web.core.windows.net/quick-start
import {
  FluentProvider,
  Spinner,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  tokens,
} from "@fluentui/react-components";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "./internal/context";
import DeloreansCharts from "./views/dynamic charts/Deloreans_Charts";
import TabConfig from "./TabConfig";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const { loading, themeString, teamsUserCredential } = useTeamsUserCredential({
    initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL,
    clientId: process.env.REACT_APP_CLIENT_ID,
  });
  return (
    <TeamsFxContext.Provider value={{ themeString, teamsUserCredential }}>
      <FluentProvider
        theme={
          themeString === "dark"
            ? teamsDarkTheme
            : themeString === "contrast"
            ? teamsHighContrastTheme
            : teamsLightTheme
        }
        style={{
          height: "100vh",
          background: tokens.colorNeutralBackground3,
        }}
      >
        <Router>
          <Route exact path="/">
            <Redirect to="/tab" />
          </Route>
          {loading ? (
            <Spinner style={{ margin: 100 }} />
          ) : (
            <>
              <Route exact path="/tab" component={DeloreansCharts} />
              <Route exact path="/config" component={TabConfig} />
            </>
          )}
        </Router>
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}
