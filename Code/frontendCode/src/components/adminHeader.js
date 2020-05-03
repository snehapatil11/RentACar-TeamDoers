import React, { Component } from 'react';
import { Menu} from 'antd';
import { Redirect } from 'react-router';

class AdminHeader extends Component{

    constructor(props) {
        super(props);
        this.state = {
          redirectPage:''
        };
      }

  clickedAdd = () => {
    this.setState({
      redirectPage: <Redirect to = {{pathname:'/admin/profile/'}} />
    }) 
  }

  clickedLogout = () => {
    this.setState({
      redirectPage: <Redirect to = {{pathname:'/welcome/'}} />
    }) 
    localStorage.clear();
  }
  // Added by Manasa for user Cancel and Return - start
  clickedTerminateMem = () => {
    this.setState({
      redirectPage: <Redirect to = {{pathname:'/adminMembership/'}} />
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

      <Menu.Item key="3" onClick={this.clickedAdd} style={{color:'white', float:'right'}}>Home</Menu.Item>

      <Menu.Item key="1" onClick={this.clickedTerminateMem} style={{color:'white', float:'right'}}>Add a new vehicle</Menu.Item>
     
    </Menu>
  
  </div>
  
  </div>
  
  )
}



}

export default AdminHeader;