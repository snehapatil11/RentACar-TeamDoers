import React from 'react';
import { Route } from 'react-router-dom';
/* Added by Ambika*/
import UserProfile from './userProfile';
import RegistrationForm from './joinus';
import WelcomePage from './welcomePage';
import LoginForm from './login';
import User from './user';
import App1 from './test';
/* Added by Manasa for Admin module. log: 13 April 2020 */
// import AdminLogin from './adminLogin'
import AdminForm from './admin'
import AdminMembership from './adminMembership'
import ReturnCancel from './userReturnCancel'
// Main Component
class Main extends React.Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}
        <Route exact path="/" component={WelcomePage} />
        <Route path="/welcome/" component={WelcomePage} />
        <Route path="/signin/" component={LoginForm} />
        <Route path="/user/" component={User} />
        <Route path="/joinus/" component={RegistrationForm} />
        <Route path="/app1/" component={App1} />
        <Route path="/profile/" component={UserProfile} />

        {/* Added by Manasa for Admin module. log: 13 April 2020 */}
        {/* <Route path="/admin/" component={AdminLogin} /> */}
        <Route path="/admin/" component={AdminForm} />
        <Route path="/adminMembership/" component={AdminMembership} />
        <Route path="/ReturnCancel/" component={ReturnCancel} />

      </div>
    );
  }
}

// Export The Main Component
export default Main;
