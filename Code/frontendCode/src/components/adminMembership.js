import React , { useState } from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Modal } from 'antd';
import moment from 'moment';
import Swal from 'sweetalert2';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import UserHeader from './userHeader';
import Footer from './footer';
import { modifyMembership } from "../services/modifyMembership";
import ReservationForm from './reservationForm';
import axios from 'axios';
import { Redirect } from 'react-router';

export const apiConfig = {
    endpointURL: "http://localhost:4002/api"
}

class AdminMembership extends React.Component {
    state = {
      searchText: '',
      searchedColumn: '',
      visible: false,
    //   filterRentalLocation:'',
    //   vehicleId:'',
      membershipId:'',
      reservationFormVisible: false
    };

    componentDidMount(){        
        // alert("In adminMembership.js");
        this.getAllMemberships(); //
    }    
        
    getAllMemberships() {
        modifyMembership.getAllMemberships().then(membershipData =>{ 
            this.setState({membershipData: membershipData})
            console.log(membershipData);
        });
    }
    
    // modify(record, e){
    //     var membershipId = record.membershipId;
    //     modifyMembership.postMembership(membershipId).then(membershipId =>{ 
    //         this.setState({membershipId: record.membershipId})
    //         console.log(membershipId);
    //     });
    //     // alert(" Terminated successfully !")
    // }

    modify(record, e) {
      e.preventDefault()
      const membershipObject = {
        membershipId: record.membershipId,
      };
      // alert(membershipObject.toString);
      const url=`${apiConfig.endpointURL}/modifyMembership`;
      // alert(" The url is: " + url);// The url is: http://localhost:4002/api/modifyMembership
      axios.post(url, {membershipId: record.userId})
          .then((res) => {
              console.log(res.data)
          }).catch((error) => {
              console.log(error)
          });

      // this.setState({ name: '', email: '' })

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
      const data = this.state.membershipData;
      this.setState({ membershipData: data });
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
    
    // ** Done
    
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

// Done**2

    render() {
      const fields = [
        // {
        //   name: ['vehicleType'],
        //   value: this.state.filterVehicleType,
        // },
        // {
        //   name: ['rentalLocation'],
        //   value: this.state.filterRentalLocation,
        // },
      ];
      const columns = [
        {
          title: 'User ID',
          dataIndex: 'userId',
          key: 'userId',
          // width: '30%',
          ...this.getColumnSearchProps('userId'),
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          ...this.getColumnSearchProps('name'),
        },
        {
          title: 'Email ID',
          dataIndex: 'emailid',
          key: 'emailid',
          width: '20%',
          ...this.getColumnSearchProps('emailid'),
        },
        {
          title: 'Expiry Month',
          dataIndex: 'expiryMonth',
          key: 'expiryMonth',
          ...this.getColumnSearchProps('expiryMonth'),
        },
        {
          title: 'Expiry Year',
          dataIndex: 'expiryYear',
          key: 'expiryYear',
          ...this.getColumnSearchProps('expiryYear'),
        },
        // 
        {
            title: 'Membership Start Date',
            dataIndex: 'memStartDate',
            key: 'memStartDate',
            ...this.getColumnSearchProps('memStartDate'),
        },
        {
            title: 'Membership End Date',
            dataIndex: 'memEndDate',
            key: 'memEndDate',
            ...this.getColumnSearchProps('memEndDate'),
        },
        // {
        //     title: 'User ID',
        //     dataIndex: 'userId',
        //     key: 'userId',
        //     ...this.getColumnSearchProps('userId'),
        // },

        // 
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

              size="small" style={{ width: 90 }}>
                  Terminate
              </Button>
            </span>
          ),
        },

      ];

// Done ** 3

    const onCreate = values => {          
        console.log("Received values of form: ", values);
        var member = this.state.membershipId;
        var startDate = moment(values.startDate).format('YYYY-MM-DD HH-mm');
        var endDate = moment(values.endDate).format('YYYY-MM-DD HH-mm');
        
        
        modifyMembership.getAllMemberships(member, startDate).then(membershipData =>{           
          this.setState({membershipData: membershipData});
          var data1 = this.state.membershipData;
          console.log(data1);
          

        });
        
        
    };
    
    let redirectPage = null;
    if (!localStorage.getItem("user_id") ||  localStorage.getItem("userType")!=='admin' ) {
        redirectPage = <Redirect to="/welcome/" />
    }
    
    return (
     
    <div>
      {redirectPage}
        <div>
            <UserHeader selectedKey={['1']} />
        </div>
        <br/><br/>
        <h2 style={{ textAlign: 'center', color: '#000077', font: 'bold', }}>
            Admin - Terminate Memberships
        </h2>
        <br/><br/>
        <Table pagination= { {pageSizeOptions: ['10', '20'], showSizeChanger: true}} columns={columns} dataSource={this.state.membershipData} />
        
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Sorry, the vehicle you are looking for is currently not available</p>
          <p>Do you want to check for same vehicle type at other locations?</p>
        </Modal>
        
        <ReservationForm
            visible={this.state.reservationFormVisible}
            onCancel={() => this.setState({reservationFormVisible:false})}
            onCreate={onCreate}
            fields={fields}
        />
        <div>
            <Footer />
        </div>

    </div>
    );
  }
}

export default AdminMembership;