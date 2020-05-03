import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Modal, Row, Col, Collapse, Select } from 'antd';
import moment from 'moment';
import Swal from 'sweetalert2';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import UserHeader from './userHeader';
import Footer from './footer';
import valuesExport from '../config/config';
import { returnCancel } from "../services/returnCancel";
import ReservationForm from './reservationForm';
import axios from 'axios';
import { Redirect } from 'react-router';

export const apiConfig = {
  endpointURL: "http://localhost:4002/api"
}
const { Panel } = Collapse;
const { Option } = Select;

let user_id = localStorage.getItem('user_id');

class ReturnCancel extends React.Component {
  constructor() {
    super();
    this.state ={
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
      redirectPage: '',
      stateCC:false,
      hoursGtZero:false,
    };
    user_id = localStorage.getItem('user_id');
  }

  // state = {
  //   searchText: '',
  //   searchedColumn: '',
  //   visible: false,
  //   membershipId: '',


  // };

  async componentDidMount() {
    this.getAllReservations();
  }

  getAllReservations() {
    returnCancel.getAllReservations().then(reservationData => {
      this.setState({ reservationData: reservationData })
      // console.log(reservationData);

    });

  }

  calculateFee(record) {
    var sum=0;
    var expEndDate=moment(record.rentEndDateTime,'YYYY-MM-DD HH-mm');

    var rStDate = moment(record.rentedDateTime,'YYYY-MM-DD HH-mm');
    var now = moment(new Date(),'YYYY-MM-DD HH-mm');

    var expectedHours=Math.ceil(expEndDate.diff(rStDate)/(1000 * 3600));
    var commencedHours=Math.ceil(now.diff(rStDate)/(1000 * 3600));
    //if commencedHours is negative, future start. Positive if already started

    if(commencedHours<-1){
      // alert("Cancelled in advance");
      this.hours=0;
      return sum;
    }else if(commencedHours>expectedHours){
      // alert("Returned late");
      var penaltyHours=commencedHours-expectedHours;
      var realFee=this.calculateFeeByHours(expectedHours);
      var penaltyFee=this.calculateFeeByHours(penaltyHours);
      this.hours=commencedHours+expectedHours;
      var totalSum=realFee+(penaltyFee*2);
      return totalSum;
    }else{
      var inbetweenHours=Math.ceil(now.diff(expEndDate)/(1000 * 3600));
      // alert(inbetweenHours);
      // alert("Returned in time");
      this.hours=expectedHours;
      var realFee=this.calculateFeeByHours(expectedHours);
      return realFee;
    }
    
    // return commencedHours;
  }

  calculateFeeByHours(Difference_In_Hours) {
    var sum = 0;
    var multiplier = 0.99;
    var price = 100;
    while (Difference_In_Hours > 0 && price > 0) {
      sum += price;
      Difference_In_Hours -= 10;
      price = multiplier * price;
    }
    sum = Math.ceil(sum);
    return sum;
  }

  modify(record, e) {
    var selectedComment = document.getElementById("commentReturn").value;
    if(selectedComment=="" || selectedComment==null){
      selectedComment="No comment";
    }

    e.preventDefault()
    const url = `${apiConfig.endpointURL}/returnCancel`;
    axios.post(url, { vehicleTransactionId: record.vehicleTransactionId, comment: selectedComment })
      .then((res) => {
        this.getAllReservations();
        console.log(res.data)
      }).catch((error) => {
        console.log(error)
      });

  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  checkModal = (record, e) => {
    this.selectedRecord = record;
    this.billSum = this.calculateFee(record);
    this.setState({
      visible: true,

    })
    // this.modify(record, e);
  }

  showCCLoading = () =>{
    alert();
    this.setState({
      stateCC: true,

    })
  }


  handleOk = e => {
    console.log(e);
    const data = this.state.reservationData;
    this.setState({ reservationData: data });
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleComment(e) {
    this.setState({
      commentReturn: e.target.value
    });
  }

  // ** Part - 2 =====================================================================================

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
          </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
          </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  // ** Part - 3 =====================================================================================

  render() {
    const fields = [
    ];
    const columns = [
      {
        title: 'Transaction ID',
        dataIndex: 'vehicleTransactionId',
        key: 'vehicleTransactionId',
        width: '15%',
        ...this.getColumnSearchProps('vehicleTransactionId'),
      },
      {
        title: 'Vehicle ID',
        dataIndex: 'vehicleId',
        key: 'vehicleId',
        width: '10%',
        ...this.getColumnSearchProps('vehicleId'),
      },
      {
        title: 'Rent Duration',
        dataIndex: 'rentedLength',
        key: 'rentedLength',
        width: '20%',
        ...this.getColumnSearchProps('rentedLength'),
      },
      {
        title: 'Start Date',
        dataIndex: 'rentedDateTime',
        key: 'rentedDateTime',
        ...this.getColumnSearchProps('rentedDateTime'),
      },
      {
        title: 'End Date',
        dataIndex: 'rentEndDateTime',
        key: 'rentEndDateTime',
        ...this.getColumnSearchProps('rentEndDateTime'),
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <span style={{ zIndex: '-1' }}>
            <Button type="primary" onClick={(e) => {
              //alert(" To terminate ");
              this.checkModal(record, e);
              // this.modify(record, e);
            }}

              size="small" style={{ width: '100%' }}>
              Cancel/Return
              </Button>
          </span>
        ),
      },
      {
        title: 'Comment',
        dataIndex: '',
        key: 'x',
        ...this.getColumnSearchProps('commentReturn'),
        render: (text, record) => (
          <input type="text" name="commentReturn" id="commentReturn" onMouseLeave={e => this.handleComment(e)} />
        ),
      },


    ];

    // ** Part - 4 =====================================================================================

    const onCreate = values => {
      console.log("Received values of form: ", values);
      // var userId = this.state.userId;
      /* Hard coding user Id - Start */
      var userId = 5;
      /* Hard coding user Id - End */
      // var startDate = moment(values.startDate).format('YYYY-MM-DD HH-mm');
      // var endDate = moment(values.endDate).format('YYYY-MM-DD HH-mm');

      var startDate = moment(values.startDate).format('YYYY-MM-DD HH-mm');
      var endDate = moment(values.endDate).format('YYYY-MM-DD HH-mm');

      returnCancel.getAllReservations().then(reservationData => {
        this.setState({ reservationData: reservationData });
        var data1 = this.state.reservationData;
        console.log(data1);
      });


    };

    // ** Part - 5 =====================================================================================
    let redirectPage = null;
    if (!localStorage.getItem("user_id") || localStorage.getItem("userType") !== 'user') {
      redirectPage = <Redirect to="/welcome/" />
    }


    return (
      <div>
        {redirectPage}

        <div>
          <UserHeader selectedKey={['3']} />
        </div>
        <br /><br />
        <div>
          <h2 style={{ textAlign: 'center' }}>
            Return and Cancel Reservations
        </h2>
          <br /><br />
          <Table pagination={{ pageSizeOptions: ['10', '20'], showSizeChanger: true }} columns={columns} dataSource={this.state.reservationData} />

          {/* <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Sorry, no reservations available</p>
        </Modal> */}
          {/* <Modal
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
                  <Input value={this.state.userinfo[0].ownerName} style={{
                    backgroundColor: 'white', fontWeight: '500',
                    fontFamily: 'inherit',
                    color: 'rgba(0, 0, 0, 0.75)'
                  }} disabled />
                </Col>
                <Col span={2}></Col>
                <Col span={8}>
                  <Input value={this.state.userinfo[0].cvv} style={{
                    backgroundColor: 'white', fontWeight: '500',
                    fontFamily: 'inherit',
                    color: 'rgba(0, 0, 0, 0.75)'
                  }} disabled />

                </Col>
              </Row>
              <br></br>
              <Row>
                <Col span={14}>
                  <label>Card Number</label>
                </Col>
              </Row>
              <Row>
                <Input value={this.state.userinfo[0].CCNumber} style={{
                  backgroundColor: 'white',
                  fontWeight: '500',
                  fontFamily: 'inherit',
                  color: 'rgba(0, 0, 0, 0.75)'
                }} disabled />

              </Row>
              <br></br>
              <Row>
                <Col span={14}>
                  <label>Expiry Details</label>
                </Col>
              </Row>

              <Row>
                <Button>{this.state.userinfo[0].expiryMonth}</Button>
                <Button style={{ marginLeft: '2%' }}>{this.state.userinfo[0].expiryYear}</Button>
              </Row>
            </div>}
          </Modal> */}
          <Modal
            title="Billing based your usage"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Return
                </Button>,
              // <Button key="submit" type="primary" onClick={this.handleOk}>
                // Submit
              // </Button>
            ]}>
            <Row>
              <Col span={14}>
                <label>Usage hours </label>
              </Col>
              <Col span={2}></Col>
              <Col span={8}>
                <label>Bill amount</label>

              </Col>
            </Row>
            <Row>
              <Col span={14}>
                <Input value={this.hours} style={{
                  backgroundColor: 'white', fontWeight: '500',
                  fontFamily: 'inherit',
                  color: 'rgba(0, 0, 0, 0.75)'
                }} disabled />
              </Col>
              <Col span={2}></Col>
              <Col span={8}>
                <Input value={this.billSum + "$"} style={{
                  backgroundColor: 'white', fontWeight: '500',
                  fontFamily: 'inherit',
                  color: 'rgba(0, 0, 0, 0.75)'
                }} disabled />

              </Col>
            </Row>
            <br></br>
            <br></br><br></br>
            <Row>
              <Col span={14}>
                {/* <label>Pay now?</label> */}
              </Col>
            </Row>

            <Row>
              <Button 
              onClick={(e) => {
                this.modify(this.selectedRecord, e);
                this.handleOk();
                // this.checkModal;
              }}
                size="medium" style={{ width: '100%', backgroundColor: 'green', color:'white', marginLeft:'35%', marginRight:'35%' }}>
                Pay now </Button>
              <br></br><br></br> 
              {/* <Button onClick={(e) => {
                    // window.location.reload(false);
                    this.componentDidMount();
              }}
                size="medium" style={{ width: '100%' }}>
                No, I will Pay later </Button> */}
            </Row>
            <br></br>
            <Row>
              <Col span={14}>
                <u><b><label>Billing Details:</label></b></u>
              </Col>
            </Row>
            <Row>
              <p style={{
                backgroundColor: 'white', fontWeight: '500',
                fontFamily: 'inherit',
                color: 'brown'
              }}>
                
                                        1) For the first 10 hours, it is 100$. <br /> 
                                        2) For every subsequent usage of 10 hours, the price reduces by 1%
                                        <br>
                                        </br>
                                        3) If cancelled atleast one hour prior, no penalty. <br></br>
                4) If returned late, charges double every extra hour.
                                        </p>
            </Row>
            <br></br>
              <p size="6"> * Your registered card will be used for payment. </p>
          </Modal>

          {/* <Button onClick={this.checkModal}></Button> */}

          <Modal
            title="Credit Card Details"
            visible={this.state.stateCC}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Return
                                        </Button>,
              <Button key="submit" type="primary" onClick={this.handleOk}>
                Submit
                                        </Button>
            ]}>



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
                <Input  />
              </Col>
              <Col span={2}></Col>
              <Col span={8}>
                <Input  />

              </Col>
            </Row>
            <br></br>
            <Row>
              <Col span={14}>
                <label>Card Number</label>
              </Col>
            </Row>
            <Row>
              <Input  />

            </Row>
            <br></br>
            <Row>
              <Col span={14}>
                <label>Expiry Details</label>
              </Col>
            </Row>

            <Row>
              <Input></Input>
              <Input style={{ marginLeft: '2%' }}></Input>
            </Row>

          </Modal>



        </div>
        <div>
          <Footer />
        </div>

      </div>
    );
  }
}

export default ReturnCancel;