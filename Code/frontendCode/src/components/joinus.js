
import React from 'react';
import "antd/dist/antd.css";
import { validate } from 'driver-license-validator';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import moment from 'moment';
import Headers from './header';
import Footer from './footer';
import Swal from 'sweetalert2';
import valuesExport from '../config/config';
import axios from 'axios';
import { Redirect } from 'react-router';


import {
    Form,
    Input,
    Select,
    Button,
    DatePicker
} from 'antd';

const { MonthPicker } = DatePicker;

const { Option } = Select;

const validNumbers = ['4646122071443224', '5372077185231328', '5372073116245321', '349380337213215', '349890774468866', '6011387583206383'
    , '3556638723817887', '4020374654722013', '4065698700805687', '349758136031484', '349965856628270']

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 20,
        },
        sm: {
            span: 10,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

class RegistrationForm extends React.Component {
    formRef = React.createRef();

    constructor() {
        super();
        this.state = {
            stateValue: '',
            showSubmit: false,
            cvc: '',
            expiry: '',
            focus: '',
            name: '',
            number: '',
            showIt: true,
            price:300,
            months:6,
            redirectPage:'',
        }
    }

    componentDidMount(){
       
    }

    onStateChange = (value) => {
        this.setState({
            stateValue: value
        })

    }

    onFinish = values => {
        Swal.fire('Welcome', 'Payment successful!', 'success')
        let userId = 0;
        for(let i =0 ;i <values.username.length;i++){
            userId+=values.username[i].charCodeAt();
        }
        
        var insertUser={
            userId:userId,            
            name:values.username,
            emailid:values.email,
            password:values.password,
            licenseState: values.licenseState,
            licenseNum:values.licenseNum,
            address:values.address,
            CCNumber:values.creditCard,
            ownerName:values.name,
            cvv:values.cvv,
            expiryMonth: moment(values.monthPicker).format('MMMM'),
            expiryYear:moment(values.monthPicker).format('YYYY'),
            memStartDate: moment().format('DD/MM/YYYY'),
            memEndDate:moment().add(this.state.months, 'months').format('DD/MM/YYYY'),
            pricePaid: this.state.price,
            isMember:'1',

        }

        axios.post(valuesExport.endpointURL + '/user/add/', JSON.stringify(insertUser), {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
  
            }
          })
          .then(res => {
            if (res.status >= 400) {
           //   console.log(res)
            }
            else {
         
                this.setState({
                    redirectPage: <Redirect to={{ pathname: '/signin/' }} />
                    })
            }
          })
          .catch(err => {
           console.log(err)
          })


   

       

    };


    checkLicenseNum = (rule, value) => {
        if (this.state.stateValue) {
            let validateVal = validate(value, this.state.stateValue);
            if (!validateVal) {
                return Promise.reject('Invalid License Number according to state')
            }
            return Promise.resolve()
           

        }
        else {

            return Promise.reject('Please select state first');
        }
    }

  
    handleInputFocus = (e) => {
        this.setState({ focus: e.target.name });
    }


    handleInputChange = (e) => {
        const { name, value } = e.target;

        this.setState({ [name]: value })
        }




    handleInputChangeNumber = (e) => {
        const { value } = e.target;
        this.setState({ number: value });
    }

    checkCreditCard = (rule, value) => {
        if(value){
        let newValue = value.toString()
        this.setState({
            number: value
        })
        if (validNumbers.includes((newValue))) {
            this.setState({
                showSubmit:true
            })
            return Promise.resolve()

        }
    else{
        this.setState({
            showSubmit: false
        })
        return Promise.reject('Invalid Credit card Number');
    }
        }
        else{
            this.setState({
                showSubmit: false
            })
        return Promise.reject()
        }

    }

    checkName = (rule, value) => {
        this.setState({
            name: value
        })
        return Promise.resolve()
    }

    checkValidity = (rule, value) => {
        let month = moment(value).format('MM');
        let year = moment(value).format('YY')
        let valueO = month + year
        this.setState({
            expiry: valueO
        })
        return Promise.resolve()

    }

    checkCVV = (rule, value) => {
        if (!/^[0-9]+$/.test(value)) {
            return Promise.reject('Only numbers allowed')
        }

        else if (value.length !== 3) {
            return Promise.reject('Invalid CVV')
        }

        else {

        }
        this.setState({
            cvc: value
        })
        return Promise.resolve()


    }


    disabledDate = (current) => {
        return current && current.valueOf() < Date.now();

    }

    onMembershipChange = (e) => {
        if(e === 1 || e === '1'){
           this.setState({
               price:valuesExport.price["1"],
               months:6
           })
        }
        else if(e === 2 || e === '2'){
            this.setState({
                price:valuesExport.price["2"],
                months:12
            })
        }
        else{
            this.setState({
                price:valuesExport.price["3"],
                months:24
            })
        }
    }

    render() {

        return (
            <div>
                                {this.state.redirectPage}
                <div>
                    <Headers selectedKey={['2']} />
                </div>
                <div>
                    <Form
                        {...formItemLayout}
                        ref={this.formRef}
                        name="register"
                        onFinish={this.onFinish}
                        scrollToFirstError
                        style={{ paddingTop: '2%', marginBottom:'10%' }}
                       
                    >
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                {

                                },
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject('The two passwords that you entered do not match!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="licenseState"
                            label="Driver license state"
                            rules={[
                                {
                                    required: true,
                                    message:'Please select state'
                                },
                            ]}
                        >
                            <Select

                                onChange={this.onStateChange}
                                allowClear
                            >
                                <Option value="AL">Alabama</Option>
                                <Option value="AK">Alaska</Option>
                                <Option value="AZ">Arizona</Option>
                                <Option value="CA">California</Option>
                                <Option value="CO">Colorado</Option>
                                <Option value="FL">Florida</Option>
                                <Option value="GA">Georgia</Option>
                                <Option value="HI">Hawaii</Option>
                                <Option value="IL">Illinois</Option>
                                <Option value="IN">Indiana</Option>
                                <Option value="NY">New York</Option>
                                <Option value="TX">Texas</Option>
                                <Option value="WA">Washington</Option>
                                <Option value="WI">Wisconsin</Option>

                            </Select>
                        </Form.Item>


                        <Form.Item
                            name="licenseNum"
                            label="License Number"
                            rules={[
                                {
                                    validator: this.checkLicenseNum,
                                },
                                {
                                    required: true,
                                    message: 'Please input your driver license number!',
                                }
                            ]}
                        >
                            <Input style={{ width: '100%' }} />

                            {/* <Cascader options={residences} /> */}
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your address!',
                                },
                            ]}
                        >
                            <Input.TextArea />

                        </Form.Item>

                        <Form.Item
                            label="credit card"
                        >
                            <Cards
                                cvc={this.state.cvc}
                                expiry={this.state.expiry}
                                focus={this.state.focus}
                                name={this.state.name}
                                number={this.state.number}
                            />
                        </Form.Item>

                        <Form.Item
                            name="creditCard"
                            label="Credit Card Details"
                            rules={[
                                {
                                    validator: this.checkCreditCard,
                                },
                                {
                                    required: true,
                                    message: 'Please input your credit card number!',
                                },
                            ]}
                        >
                            <Input
                                type="tel"
                                name="number"
                                placeholder="Card Number"

                            />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Owner Name"
                            rules={[
                                {
                                    validator: this.checkName
                                },

                                {
                                    required: true,
                                    message: 'Please enter owner name!',
                                },
                            ]}
                        >
                            <Input
                                type="text"
                                name="name"
                                placeholder="Name"

                            />
                        </Form.Item>
                        <Form.Item name="monthPicker" label="Expiry"
                            rules={[
                                {
                                    validator: this.checkValidity
                                },

                                {
                                    required: true,
                                    message: 'Please select expiration date!',
                                },]}>
                            <MonthPicker placeholder="Valid through" disabledDate={this.disabledDate}
                             />
                        </Form.Item>


                        <Form.Item
                            name="cvv"
                            label="CVV"
                            rules={[
                                {
                                    validator: this.checkCVV,
                                },
                                {
                                    required: true,
                                    message: 'Please input cvv value!',
                                }
                            ]}
                        >
                            <Input
                                type="text"
                                name="cvc"
                                placeholder="CVV"
                                onChange={this.handleInputChange}
                                onFocus={this.handleInputFocus}
                            />
                        </Form.Item>

                        <Form.Item
                            name="membership"
                            label="Membership"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select

                                onChange={this.onMembershipChange}
                                allowClear
                            >
                                <Option value="1">6 Months</Option>
                                <Option value="2">1 Year</Option>
                                <Option value="3">2 Years</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Price($)"
                            
                        >
    <span>{this.state.price}</span>
                        </Form.Item>

                        <Form.Item
                            {...tailFormItemLayout}
                        >
                            <Button type="primary" htmlType="submit" disabled={!this.state.showSubmit}>
                                Pay & Register
        </Button>
                        </Form.Item>

                        {/* {this.state.showIt && <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" disabled={!this.state.showSubmit}>
                                Register
        </Button>
                        </Form.Item>} */}

                    </Form>
                </div>
                <div>
                    <Footer/>
                </div>


            </div>
        );
    }
};

export default RegistrationForm;
