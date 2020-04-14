import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Footer from './footer';
import Headers from './header';
import { Layout, Row, Col } from 'antd';
import "antd/dist/antd.css";
import "../css/Admin.css"
import AdminForm from './admin'

const { Content } = Layout;

class AdminLogin extends Component {
    constructor() {
        super();
        this.state = {
            redirect: ''
        };
    }

    componentDidMount() {
    }


    render() {

        return (
            <div>
                {this.state.redirect}
                <Route path="/adminregister/" component={AdminForm} />
                <div>
                    <Row >
                        <Layout className="layout">
                            <Headers selectedKey={['5']} />
                            <Content>  {/* Admin page starts here */}
                            <div class="container">
                            <table class="adminTable" border='0' width='480px' cellpadding='0' cellspacing='0' align='left'>
                                <center><tr>
                                <td><h1>Login First</h1></td>
                                </tr></center>
                                
                                <table border='0' width='480px' cellpadding='0' cellspacing='0' align='left'>
                                <tr>
                                    <td align='left'>Login ID:</td>
                                    <td><input type='text' name='loginID' placeholder='Enter your login ID'></input></td>
                                </tr>
                                <tr>
                                    <td align='left'>Password:</td>
                                    <td><input type='password' name='password'></input></td>
                                </tr>
                                <tr> <td>&nbsp;</td> </tr>
                                <tr> <td>&nbsp;</td> </tr>
                                <table border='0' cellpadding='0' cellspacing='0' width='480px' align='left'>
                                <tr>
                                    <td align='center'><input type='submit' name='register' value="Register Vehicle"></input></td>
                                </tr>
                                </table>
                                </table>
                                </table>
                                
                            </div>
                            </Content> 
                            <Footer />
                        </Layout>
                    </Row>
                </div>
            </div>
        );
    }
}

export default AdminLogin;
