import React, { Component } from 'react';
import Footer from './footer';
import Headers from './header';
import { Layout, Row, Col } from 'antd';
import "antd/dist/antd.css";
import "../css/Admin.css"


const { Content } = Layout;

class AdminForm extends Component {
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
                <div>
                    <Row >
                        <Layout className="layout">
                            <Headers selectedKey={['5']} />
                            <Content>  {/* Admin page starts here */}
                            <div class="container">
                            <table class="adminTable" border='0' width='480px' cellpadding='0' cellspacing='0' align='left'>
                                <center><tr>
                                <td><h1>Enter a new vehicle</h1></td>
                                </tr></center>
                                
                                <table border='0' width='480px' cellpadding='0' cellspacing='0' align='left'>
                                <tr>
                                    <td align='left'>Vehicle Make:</td>
                                    <td><input type='text' name='vmake'></input></td>
                                </tr>
                                <tr> <td>&nbsp;</td> </tr>
                                <tr>
                                    <td align='left'>Model:</td>
                                    <td><input type='text' name='model'></input></td>
                                </tr>
                                <tr> <td>&nbsp;</td> </tr>
                                <tr>
                                    <td align='left'>Rental Location:</td>
                                    <td><input type='text' name='rlocation'></input></td>
                                </tr>
                                <tr> <td>&nbsp;</td> </tr>
                                <tr>
                                    <td align='left'>Vehicle Type:</td>
                                    <td><input type='text' name='vtype'></input></td>
                                </tr>
                                <tr> <td>&nbsp;</td> </tr>
                                <tr>
                                    <td align='left'>Condition:</td>
                                    <td><input type='text' name='condition'></input></td>
                                </tr>
                                <tr> <td>&nbsp;</td> </tr>
                                <tr>
                                    <td align='left'>Current Mileage:</td>
                                    <td><input type='text' name='cmile'></input></td>
                                </tr>
                                <tr> <td>&nbsp;</td> </tr>
                                <tr>
                                    <td align='left'>Last Service Date:</td>
                                    <td><input type='date' name='lsdate'></input></td>
                                </tr>
                                <tr> <td>&nbsp;</td> </tr>
                                <tr>
                                    <td align='left'>Registration Tag:</td>
                                    <td><input type='text' name='rtag'></input></td>
                                </tr>
                                <tr> <td>&nbsp;</td> </tr>
                                <tr>
                                    <td align='left'>Year:</td>
                                    <td><input type='text' name='year'></input></td>
                                </tr>
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

export default AdminForm;
