import { Router, Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import history from './utils/history';

import { Auth } from './ui/Auth';
import { Dashboard } from './ui/Dashboard';
import { User } from './ui/User';

import storage from './utils/storage';

interface PrivateRouteProps extends RouteProps {
  component: any;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, ...rest } = props;
  const token = storage.getToken();
  let account: boolean | null = null;

  if (token) {
    account = true;
  }

  return account ? (
    <Route {...rest} render={(props) => <Component {...props} />} />
  ) : (
    <Redirect to="/auth" />
  );
};

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
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/user" component={User} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
