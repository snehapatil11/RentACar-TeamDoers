import React from 'react';
import { Route } from 'react-router-dom';
import WelcomePage from './welcomePage';
import LoginForm from './login';
import Home from './home';
import App1 from './test';

// Main Component
class Main extends React.Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}
        <Route exact path="/" component={WelcomePage} />
        <Route path="/welcome/" component={WelcomePage} />
        <Route path="/signin/" component={LoginForm} />
        <Route path="/home/" component={Home} />
        <Route path="/app1/" component={App1} />

      </div>
    );
  }
}

// Export The Main Component
export default Main;
