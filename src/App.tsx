import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Auth } from "./ui/Auth";
import { User } from "./ui/User";
import { Front } from "./ui/Front";

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/user" component={User} />
          <Route path="/" component={Auth} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
