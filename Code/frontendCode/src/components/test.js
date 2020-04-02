import React from 'react';
import 'antd/dist/antd.css';
//import './index.css';
import { Table, Input, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { vehicleServices } from "../services/vehicleServices";

class App1 extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
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
        title: 'Rental Location Name',
        dataIndex: 'rentalLocationName',
        key: 'rentalLocationName',
        ...this.getColumnSearchProps('rentalLocationName'),
      },
    ];
    return <Table columns={columns} dataSource={this.state.vehiclesData} />;
  }
}

  export default App1;