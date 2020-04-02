import React ,{useState} from "react";
import { Modal, Form, Input, DatePicker,InputNumber } from "antd";


const ReservationForm = ({ visible, onCancel, onCreate, fields,}) => {
    const [form] = Form.useForm();
    
  return (
    <Modal
      visible={visible}
      title="Vehicle Reservation"
      okText="Submit"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }
      }
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onCreate(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        fields={fields}
        initialValues={{
          rentalLength:1
        }}
      >
        <Form.Item name="vehicleType" label="Vehicle Type" style={{ marginBottom: "0px" }} >
          <Input />
        </Form.Item>
        <Form.Item name="rentalLocation" label="Rental Location" style={{ marginBottom: "0px" }}>
          <Input />
        </Form.Item>
        <Form.Item name="rentalDate" label="Pickup Date" style={{ marginBottom: "0px" }}>
          <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm"/>
        </Form.Item>
        <Form.Item name="rentalLength" label="Length of Rental By Hour (Max 72hrs)" className="collection-create-form_last-form-item">
          <InputNumber min={1} max={72} defaultValue={1}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

//const ReservationForm = Form.create({ name: "modal_form" })(ReservationFormComponent);

export default ReservationForm;
