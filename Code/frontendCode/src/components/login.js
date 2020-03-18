import React, { Component } from 'react';
import { Form, Input, Button, Alert, Select } from 'antd';
import "antd/dist/antd.css";
import Headers from './header';
import Footer from './footer';

const { Option } = Select;


class Login extends Component {
    constructor() {
        super();
        this.state = {

            redirectPage: '',
            showError: false,
        };
    }

    componentDidMount() {

    }

    handleSubmit = values => {
        console.log(values)
    };

    failedSubmit = (error) => {
        console.log(error)
    }

    render() {
        const frontFormLayout = {
            labelCol: {
                span: 8,
            },
            wrapperCol: {
                span: 8,
            },
        };
        const tailFormLayout = {
            wrapperCol: {
                offset: 8,
                span: 8,
            },
        };


        return (
            <div>
                {this.state.redirectPage}
                <div>
                    <Headers selectedKey={['3']} />
                </div>
                <div>

                    <Form
                        {...frontFormLayout}
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.handleSubmit}
                        onFinishFailed={this.failedSubmit}
                        style={{ paddingTop: '2%' }}
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="User Type"
                            name="userType"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select user type!',
                                },
                            ]}
                        >
                            <Select
                            >
                                <Option value="user">User</Option>
                                <Option value="admin">Admin</Option>
                                <Option value="other">other</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item {...tailFormLayout}>
                            <Button type="primary" htmlType="submit">
                                Submit
        </Button>
                        </Form.Item>
                    </Form>
                </div>
                {this.state.showError && <div>
                    <Alert message="Invalid credentials" type="error" />

                </div>
                }
                <div>
                    <Footer />
                </div>

            </div>
        );
    }
}

export default Login;
