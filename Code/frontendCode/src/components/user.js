import React , { useState } from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Modal } from 'antd';
import moment from 'moment';
import Swal from 'sweetalert2';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import UserHeader from './userHeader';
import Footer from './footer';
import { vehicleServices } from "../services/vehicleServices";
import ReservationForm from './reservationForm';


class User extends React.Component {
    state = {
      searchText: '',
      searchedColumn: '',
      visible: false,
      filterRentalLocation:'',
      vehicleId:'',
      userId:'',
      reservationFormVisible: false
    };

    componentDidMount(){       
      this.state.userId = localStorage.getItem('user_id'); 
        this.getVehiclesData();
    }    
        
    getVehiclesData() {
        vehicleServices.getVehiclesData().then(vehiclesData =>{ 
            this.setState({vehiclesData: vehiclesData})
            console.log(vehiclesData);
        });
    }
    
    reserve(record, e){
        e.preventDefault();
        this.setState({
          filterVehicleType : record.vehicleType,
          filterRentalLocation: record.rentalLocationName,
          vehicleId: record.vehicleId,
          reservationFormVisible:true

        });
    }

    showModal = () => {
      this.setState({
        visible: true,
      });
    };

    handleOk = e => {
      console.log(e);
      const data = this.state.vehiclesData.filter(item => item.vehicleType === this.state.filterVehicleType);
      this.setState({ vehiclesData: data });
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

    render() {
      const fields = [
        {
          name: ['vehicleType'],
          value: this.state.filterVehicleType,
        },
        {
          name: ['rentalLocation'],
          value: this.state.filterRentalLocation,
        },
      ];
      const columns = [
        {
          title: 'Model',
          dataIndex: 'model',
          key: 'model',
          width: '12%',
          ...this.getColumnSearchProps('model'),
        },
        {
          title: 'Make',
          dataIndex: 'make',
          key: 'make',
          ...this.getColumnSearchProps('make'),
        },
        {
          title: 'Vehicle Type',
          dataIndex: 'vehicleType',
          key: 'vehicleType',
          ...this.getColumnSearchProps('vehicleType'),
        },
        {
          title: 'Mileage',
          dataIndex: 'currentMileage',
          key: 'currentMileage',
        },        
        {
          title: 'Hourly Price',
          dataIndex: 'hourlyPrice',
          key: 'hourlyPrice',
        },
        {
          title: 'Last Serviced On',
          dataIndex: 'lastServiceDate',
          key: 'lastServiceDate',
        },
        {
          title: 'Year',
          dataIndex: 'year',
          key: 'year',
        },
        {
          title: 'Condition',
          dataIndex: 'condition',
          key: 'condition',
        },
        
        {
          title: 'Registration Tag',
          dataIndex: 'registrationTag',
          key: 'registrationTag',
        },
        {
          title: 'Rental Location',
          dataIndex: 'rentalLocationName',
          key: 'rentalLocationName',
          ...this.getColumnSearchProps('rentalLocationName'),
        },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          render: (text, record) => (
            <span style={{ zIndex: '-1' }}>
              <Button type="primary"  onClick={(e) => { this.reserve(record, e); }}

              size="small" style={{ width: 90 }}>
                  Reserve
              </Button>
            </span>
          ),
        },

      ];

    const onCreate = values => {          
        console.log("Received values of form: ", values);
        var vehicle = this.state.vehicleId;
        //var rentDate = moment(values.rentalDate).format('YYYY-MM-DD');
        //var rentTime = moment(values.rentalDate).format('HH-mm');
        var rentDateTime = moment(values.rentalDate).format('YYYY-MM-DD HH-mm');
        var rentLength = parseInt(values.rentalLength);
        // var rentEndTime = parseInt(moment(values.rentalDate).format('HH')) + parseInt(rentLength);
        // rentEndTime = rentEndTime+'-'+ moment(values.rentalDate).format('mm');

        var rentEndDateTime = moment(values.rentalDate).add(rentLength, 'hours').format('YYYY-MM-DD HH-mm');
        
        //console.log(moment(rentDateTime,'YYYY-MM-DD HH-mm'));

        vehicleServices.getVehicleTransactions(vehicle, rentDateTime).then(vehicleTransactionData =>{           
          this.setState({vehicleTransactionData: vehicleTransactionData});
          var data1 = this.state.vehicleTransactionData.filter(data => {
            
            //return data.vehicleId === vehicle && data.rentedTime < rentTime && data.rentEndTime > rentTime && data.isReserved === true;
            //return (moment(data.rentedDateTime).isSameOrBefore(rentDateTime) && moment(data.rentEndDateTime).isSameOrAfter(rentEndDateTime)) && data.isReserved === true;
            //return (moment(rentDateTime).isBetween(moment(data.rentedDateTime),moment(data.rentEndDateTime)) || moment(rentEndDateTime).isBetween(moment(data.rentedDateTime),moment(data.rentEndDateTime)) || moment(data.rentedDateTime).isBetween(moment(rentDateTime),moment(rentEndDateTime))) && data.isReserved === true;
            //var left1 = moment(data.rentedDateTime).isSameOrAfter(moment(rentDateTime)) && moment(data.rentedDateTime).isSameOrAfter(rentEndDateTime);
            //var left2 = moment(data.rentEndDateTime).isSameOrAfter(moment(rentDateTime)) && moment(data.rentEndDateTime).isSameOrAfter(rentEndDateTime);

            var a = moment(rentDateTime,'YYYY-MM-DD HH-mm').isBetween(moment(data.rentedDateTime,'YYYY-MM-DD HH-mm'),moment(data.rentEndDateTime,'YYYY-MM-DD HH-mm'));
            var b = moment(rentEndDateTime,'YYYY-MM-DD HH-mm').isBetween(moment(data.rentedDateTime,'YYYY-MM-DD HH-mm'),moment(data.rentEndDateTime,'YYYY-MM-DD HH-mm'));
            var c = moment(data.rentedDateTime,'YYYY-MM-DD HH-mm').isBetween(moment(rentDateTime,'YYYY-MM-DD HH-mm'),moment(rentEndDateTime,'YYYY-MM-DD HH-mm'));
            // console.log(moment(rentDateTime,'YYYY-MM-DD HH-mm'));
            //  console.log(moment(rentEndDateTime,'YYYY-MM-DD HH-mm'));
            //  console.log(moment(data.rentedDateTime,'YYYY-MM-DD HH-mm'));
            //  console.log(moment(data.rentEndDateTime,'YYYY-MM-DD HH-mm'))
            console.log(a);
            console.log(b);
            console.log(c);
            return (a || b || c) && data.isReserved === true;
          });
          console.log(data1);

          if(data1.length > 0)
          {
            this.setState({reservationFormVisible:false});
            this.showModal();
          }
          else{
            vehicleServices.storeVehicleTransaction(vehicle, this.state.userId, true, false,rentDateTime ,rentLength, rentEndDateTime, rentDateTime) 
            .then(response => {
              console.log(response);

              this.setState({reservationFormVisible:false});        
              Swal.fire('Success', 'Reservation successful!', 'success');
          });
          }

        });
        
        
    };
    
    
    return (
    <div>
        <div>
            <UserHeader selectedKey={['1']} />
        </div>
        <div style={{ textAlign: 'center', marginBottom: "20px", }}>
            <h1>Vehicle and Vehicle Locations</h1>
        </div>
        
        <Table pagination= { {pageSizeOptions: ['10', '20'], showSizeChanger: true}} columns={columns} dataSource={this.state.vehiclesData} />
        
        <Modal
          title="Vehicle Reservation"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Sorry, the vehicle you are looking for is currently not available</p>
          <p>Do you want to check for same vehicle type at other locations and time?</p>
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

export default User;