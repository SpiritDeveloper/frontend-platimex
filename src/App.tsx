import { Router, Switch, Route } from 'react-router-dom';
import history from './utils/history';

import { Auth } from './ui/Auth';
import { Dashboard } from './ui/Dashboard';

function App() {
  return (
    <Router history={history}>
      <div className="app">
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              history.push('/auth');
            }}
          />
          <Route exact path="/auth" component={Auth} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
