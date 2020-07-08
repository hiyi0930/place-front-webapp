import React from "react";
import "./App.css";
import { BrowserRouter as Router ,Route, Switch } from "react-router-dom";
import Login from "./Login"
import Place from "./Place"
import AuthRoute from "./AuthRoute"

interface AppProps {
}
interface AppState {
  accessToken: string,
  refreshToken: string,
}
class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      accessToken: "",
      refreshToken: "",
    }
  }
  setNewToken = (accessToken, refreshToken = this.state.refreshToken) => this.setState({accessToken, refreshToken})

  render() {
    return (
      <Router>
        <Switch>
          <Route 
            path="/login"
            render={props => (
              <Login
                accessToken={this.state.accessToken}
                setLoginToken={(accessToken, refreshToken) => this.setState({accessToken, refreshToken})}
                {...props}
              />
            )}
          />
          <AuthRoute
              accessToken={this.state.accessToken}
              path="/"
              render={props => <Place accessToken={this.state.accessToken} refreshToken={this.state.refreshToken} setNewToken={this.setNewToken} {...props} />}
            />
        </Switch>
      </Router>
    )
    }
}

export default App;
