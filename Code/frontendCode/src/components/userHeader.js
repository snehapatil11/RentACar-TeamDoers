import React, { Component } from 'react';
import { Menu} from 'antd';
import { Redirect } from 'react-router';


class UserHeader extends Component{

    constructor(props) {
        super(props);
        this.state = {
          redirectPage:''
        };
      }
    
   clickedProfile = () => {
    this.setState({
      redirectPage: <Redirect to = {{pathname:'/user/profile'}} />
    }) 
  }
  clickedHome = () => {
    this.setState({
      redirectPage: <Redirect to = {{pathname:'/user/'}} />
    }) 
  }

  clickedLogout = () => {
    this.setState({
      redirectPage: <Redirect to = {{pathname:'/welcome/'}} />
    }) 
  }
  // Added by Manasa for user Cancel and Return - start
  clickedReturn = () => {
    this.setState({
      redirectPage: <Redirect to = {{pathname:'/returnCancel/'}} />
    }) 
  }
  // Added by Manasa for user Cancel and Return - end
render(){
return ( 

    <div>
        {this.state.redirectPage}
        <div style={{background:'grey'}}>
  
    <Menu
    theme="dark"
    mode="horizontal"
      defaultSelectedKeys={this.props.selectedKey}
      style={{  fontWeight:'bold' }}
    >
      <Menu.Item key="4" onClick={this.clickedLogout} style={{color:'white', float:'right'}}>Logout</Menu.Item>
      {/* Added by Manasa for User - Return and Cancel - Start */}

      <Menu.Item key="3" onClick={this.clickedReturn} style={{color:'white', float:'right'}}>Return - Cancel</Menu.Item>

      {/* Added by Manasa for User - Return and Cancel - End */}
      <Menu.Item key="2" onClick={this.clickedProfile} style={{color:'white', float:'right'}}>Profile</Menu.Item>
      <Menu.Item key="1" onClick={this.clickedHome} style={{color:'white', float:'right'}}>Home</Menu.Item>
     
    </Menu>
  
  </div>
  
  </div>
  
  )
}



}

export default UserHeader;