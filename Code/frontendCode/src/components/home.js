import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Table, Input, Button, Modal } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import Headers from './header';
import Footer from './footer';
import { vehicleServices } from "../services/vehicleServices";


class Home extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    visible: false,
    filterVehicleType: ''
  };


    componentDidMount(){        
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
        this.setState({ filterVehicleType : record.vehicleType});
        this.showModal();
        //console.log(record);
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
    const columns = [
      {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
        width: '30%',
        ...this.getColumnSearchProps('model'),
      },
      {
        title: 'Make',
        dataIndex: 'make',
        key: 'make',
        width: '20%',
        ...this.getColumnSearchProps('make'),
      },
      {
        title: 'Vehicle Type',
        dataIndex: 'vehicleType',
        key: 'vehicleType',
        ...this.getColumnSearchProps('vehicleType'),
      },
      {
        title: 'Rental Location Name',
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
    return (
        <div>
        <div>
            <Headers selectedKey={['3']} />
        </div>
        <div style={{ textAlign: 'center'}}>
            Vehicle and Vehicle Locations
        </div>
        <Table pagination= { {pageSizeOptions: ['10', '20'], showSizeChanger: true}} columns={columns} dataSource={this.state.vehiclesData} />
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Sorry, the vehicle you are looking for is currently not available</p>
          <p>Do you want to check for same vehicle type at other locations?</p>
        </Modal>
        <div>
            <Footer />
        </div>

        </div>
    );
  }
}

  export default Home;