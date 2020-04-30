import React, { Component } from 'react';
import { Button, Card, Row, Select, Collapse, Modal, Col, Input } from 'antd';
import UserHeader from './userHeader';
import Footer from './footer';
import Swal from 'sweetalert2';
import valuesExport from '../config/config';
import moment from 'moment';
import axios from 'axios';
import { Redirect } from 'react-router';


const { Panel } = Collapse;
const { Option } = Select;
 

let user_id = localStorage.getItem('user_id');
class UserProfile extends Component {

    constructor() {
        super();
        this.state = {
            visible: false,
            creditCard: [],
            startDate: '',
            endDate: '',
            userinfo: [],
            name: '',
            price: 0,
            userID: '',
            months: 0,
            ready: false,
            redirectPage:'',

        }
        user_id = localStorage.getItem('user_id');
    }

    async componentDidMount() {

        if(user_id){
        await axios.get(valuesExport.url + 'api/user/info/' + user_id)
            .then((response) => {


                if (response.data) {
                    this.setState({
                        userinfo: response.data,
                        
                        startDate: moment(response.data[0].memStartDate, 'DD/MM/YYYY'),
                        endDate: moment(response.data[0].memEndDate, 'DD/MM/YYYY'),
                        userID: response.data[0].userId,
                        name: response.data[0].name,
                        ready: true

                    })
                }

            })
            .catch((error) => {

                console.log(error);
            })

        }

    }

    cancelMembership = () => {
        Swal.fire({
            title: 'Cancel your membership?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText:'No',
            confirmButtonText: 'Yes!'
        }).then((result) => {

            if (result.value) {
                let endValue = moment().format('DD/MM/YYYY');
                this.setState({
                    endDate: moment(),
                   
                })

                axios.post(valuesExport.url + 'api/user/cancelMem/', JSON.stringify({ userID: this.state.userID, endDate:endValue }), {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
        
                })
                    .then((response) => {
                      //  console.log(response)
                        localStorage.setItem("isMember", 0);

                        Swal.fire(
                            'Cancelled successfully!',
                            'We are sorry to see you go!',
                            'success'
                        )
                    })
                    .catch((e) => {
        
                    })
            }
          
            })
            .catch((e)=>{

            })

     
    }

    extendMembership = () => {
        this.setState({
            visible: true,

        })

    }

    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    onMembershipChange = (e) => {
        if (!e) {
            this.setState({
                price: 0,
                months: 0
            })
        }
        if (e === 1 || e === '1') {
            this.setState({
                price: valuesExport.price["1"],
                months: 6
            })
        }
        else if (e === 2 || e === '2') {
            this.setState({
                price: valuesExport.price["2"],
                months: 12
            })
        }
        else {
            this.setState({
                price: valuesExport.price["3"],
                months: 24
            })
        }
    }

    handleOk = () => {


        Swal.fire({
            title: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            
        }).then((result) => {

            if (result.value) {

                let endValue = moment(this.state.endDate).add(this.state.months, 'months').format('DD/MM/YYYY');
                console.log(endValue)
                this.setState({
                    endDate: moment(this.state.endDate).add(this.state.months, 'months'),
                   
                })

                var extendValues = { userID: this.state.userID, endDate: endValue }
                axios.post(valuesExport.url + 'user/extendMem/', JSON.stringify(extendValues), {
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    }
          
                    })
                    .then((response)=>{
                        console.log(response)
                         localStorage.setItem("isMember", 1);

                    })
                    .catch((e)=>{
        
                    })
                    Swal.fire(
                            'Extended!',
                             'Successfully',
                             'success'
                         )
                    this.setState({
                        visible:false
                    })
               
            }
        })
    }


    render() {
        let redirectPage = null;
        if (!localStorage.getItem("user_id") ||  localStorage.getItem("userType")!=='user' ) {
            redirectPage = <Redirect to="/welcome/" />
        }
        return (
            <div>
                <div>
{redirectPage}
                </div>
                {this.state.ready && <div>
                    <div>
                        <UserHeader selectedKey={['2']} />
                        <br></br>
                        <br></br>
                        <div style={{paddingTop:'2%', textAlign:'center'}}>
                            <h1>{"Welcome " + this.state.name}</h1>
                            <h2>Your Current Membership with us</h2>
                            <Row style={{paddingLeft:'40%'}}>
                            <h3>Start Date: </h3>
                            <h4 style={{paddingLeft:'1%'}}>{moment(this.state.startDate).format('DD') + ' ' + moment(this.state.startDate).format('MMMM') + ', ' +
                                moment(this.state.startDate).format('YYYY')}</h4>
</Row>
<Row style={{paddingLeft:'40%'}}>
                            <h3>End Date: </h3>
                            <h4 style={{paddingLeft:'1%'}}>{moment(this.state.endDate).format('DD') + ' ' + moment(this.state.endDate).format('MMMM') + ', ' +
                                moment(this.state.endDate).format('YYYY')}</h4>

</Row>
                            <br></br>
                            <br></br>
                            <br></br>
                            <Row style={{paddingLeft:'25%'}}>
                               <Card 
                               title="Modify Membership"
                               style={{width:'70%'}}>
                                   <Row>
                                   <Col span={6}>
                                   <Button type="primary" style={{backgroundColor:'green'}}>
                                            Extend
                                        </Button>
                                       </Col>
                                            <Col span={6}>
                                        <Select
                                            placeholder="Select duration"
                                            onChange={this.onMembershipChange}
                                        >
                                            <Option value="1">By 6 months</Option>
                                            <Option value="2">By 1 Year</Option>
                                            <Option value="3">By 2 Years</Option>
                                        </Select>
                                        </Col>
                                        <Col span={6}>
                                        <p>Price($): {this.state.price}</p>
                                        </Col>
                                        <Col span={6}>
                                        <Button type="primary" onClick={this.extendMembership} disabled={!this.state.price}>
                                            Make payment
                                        </Button>
                                        </Col>
                                        </Row>
                                        <Row>
                                        <Col span={6}>
                                        <Button type="primary" danger onClick={this.cancelMembership}>
                                    Cancel 
                                </Button>
                                </Col>
                                        </Row>
                                        </Card>
                                <Modal
                                    title="Credit Card Details"
                                    visible={this.state.visible}
                                    onCancel={this.handleCancel}
                                    footer={[
                                        <Button key="back" onClick={this.handleCancel}>
                                            Return
                                        </Button>,
                                        <Button key="submit" type="primary" onClick={this.handleOk}>
                                            Submit
                                        </Button>
                                    ]}        >

                                    {this.state.userinfo && <div>

                                            <Row>
                                            <Col span={14}>
                                                <label>Owner Name</label>
                                                </Col>
                                                <Col span={2}></Col>
                                                <Col span={8}>
                                                <label>CVV</label>

                                            </Col>
                                            </Row>
                                            <Row>
                                            <Col span={14}>
                                                <Input value={this.state.userinfo[0].ownerName} style={{backgroundColor:'white',fontWeight: '500',
                                        fontFamily: 'inherit',
                                        color: 'rgba(0, 0, 0, 0.75)'}} disabled />
                                            </Col>
                                            <Col span={2}></Col>
                                            <Col span={8}>
                                                <Input value={this.state.userinfo[0].cvv} style={{backgroundColor:'white',fontWeight: '500',
                                        fontFamily: 'inherit',
                                        color: 'rgba(0, 0, 0, 0.75)'}}  disabled />

                                            </Col>
                                        </Row>
                                        <br></br>
                                        <Row>
                                            <Col span={14}>
                                                <label>Card Number</label>
                                                </Col>
                                                </Row>
                                        <Row>
                                            <Input value={this.state.userinfo[0].CCNumber} style={{backgroundColor:'white',
                                        fontWeight: '500',
                                        fontFamily: 'inherit',
                                        color: 'rgba(0, 0, 0, 0.75)'}} disabled />

                                        </Row>
                                        <br></br>
                                        <Row>
                                            <Col span={14}>
                                                <label>Expiry Details</label>
                                                </Col>
                                                </Row>
                                        
                                        <Row>
                                            <Button>{this.state.userinfo[0].expiryMonth}</Button>
                                            <Button style={{marginLeft:'2%'}}>{this.state.userinfo[0].expiryYear}</Button>
                                        </Row>
                                    </div>}
                                </Modal>
                            </Row>
                            <br></br>
                            <br></br>
                            <Row>

                              
                            </Row>

                        </div>
                    </div>
                </div>
                }
                <div>
                    <Footer />
                </div>

            </div>
        )
    }
}

export default UserProfile;
