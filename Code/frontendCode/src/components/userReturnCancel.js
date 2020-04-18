import React , { useState } from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Modal } from 'antd';
import moment from 'moment';
import Swal from 'sweetalert2';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import UserHeader from './userHeader';
import Footer from './footer';
import { returnCancel } from "../services/returnCancel";
import ReservationForm from './reservationForm';
import axios from 'axios';

export const apiConfig = {
    endpointURL: "http://localhost:4002/api"
}

class ReturnCancel extends React.Component {
    state = {
      searchText: '',
      searchedColumn: '',
      visible: false,
      membershipId:'',
    };

    componentDidMount(){        
        this.getAllReservations(); 
    }    
        
    getAllReservations() {
        returnCancel.getAllReservations().then(reservationData =>{ 
            this.setState({reservationData: reservationData})
            console.log(reservationData);
        });

    }

    modify(record, e) {
// Calculate the fee
// 

    var rStDate= record.rentedDateTime;
    var rEndDate=new Date();
    var rStDate_format = moment(rStDate).toDate();
    var rEndDate_format = moment(rEndDate).toDate();
    //alert("The give dates are: " + rStDate + " "+rEndDate);    
    var Difference_In_Time = rEndDate_format - rStDate_format; 
    var Difference_In_Hours = Math.ceil(Difference_In_Time / (1000 * 3600)); 
    /** Dynamic pricing */
    var totalHours = Difference_In_Hours;  
    var sum=0;
    var multiplier=0.99;
    var price=100;
    while(Difference_In_Hours>0 && price>0){
      sum += price;
      Difference_In_Hours-= 10;
      price = multiplier*price;
    }
    sum = Math.ceil(sum);
    alert("It was " + totalHours + " hours you spent. \nYour bill is: " + sum + "$");
    // alert(rEndDate_format + " " + rStDate_format + ":" + (rEndDate_format - rStDate_format));
    e.preventDefault()
      const url=`${apiConfig.endpointURL}/returnCancel`;
      axios.post(url, {vehicleTransactionId: record.vehicleTransactionId})
          .then((res) => {
              console.log(res.data)
          }).catch((error) => {
              console.log(error)
          });

      //Refresh the page again
      window.location.reload(false);
    }

    showModal = () => {
      this.setState({
        visible: true,
      });
    };

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
              <Button type="primary"  onClick={(e) => { 
                  //alert(" To terminate ");
                  this.modify(record, e); 
                }}

              size="small" style={{ width: '100%' }}>
                  Cancel/Return
              </Button>
            </span>
          ),
        },

      ];

    // ** Part - 4 =====================================================================================

    const onCreate = values => {          
        console.log("Received values of form: ", values);
        // var userId = this.state.userId;
        /* Hard coding user Id - Start */
        var userId=5;
        /* Hard coding user Id - End */
        // var startDate = moment(values.startDate).format('YYYY-MM-DD HH-mm');
        // var endDate = moment(values.endDate).format('YYYY-MM-DD HH-mm');
        
        var startDate = moment(values.startDate).format('YYYY-MM-DD HH-mm');
        var endDate = moment(values.endDate).format('YYYY-MM-DD HH-mm');

        returnCancel.getAllReservations(userId).then(reservationData =>{           
          this.setState({reservationData: reservationData});
          var data1 = this.state.reservationData;
          console.log(data1);
        });
        
        
    };
    
    // ** Part - 5 =====================================================================================

    return (
    <div>
        <div>
            <UserHeader selectedKey={['3']} />
        </div>
        <br/><br/>
        <h2 style={{ textAlign: 'center', color: '#000077', }}>
            Return and Cancel Reservations
        </h2>
        <br/><br/>
        <Table pagination= { {pageSizeOptions: ['10', '20'], showSizeChanger: true}} columns={columns} dataSource={this.state.reservationData} />
        
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Sorry, no reservations available</p>
        </Modal>
        <div>
            <Footer />
        </div>

    </div>
    );
  }
}

export default ReturnCancel;