import React, { useEffect, useRef, useState } from 'react';
import useEntryStore, { Entry } from './stores/useUserStore';
import { Button, Form, Input, Space, Table, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { cityRules, emailRules, genderRules, nameRules, phoneRules, streetRules } from './inputValidation/inputValidation';
import Pie from './Pie/Pie';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


interface types {
  id: number;
  name: string;
  email: string;
  gender: string;
  street: string;
  city: string;
  phone: string;
  address?: any;
}

const App: React.FC = () => {

  const entries: Entry[] = useEntryStore(state => state.entries);
  const fetchEntries = useEntryStore(state => state.fetchEntries);
  const createEntry = useEntryStore(state => state.createEntry);
  const updateEntry = useEntryStore(state => state.updateEntry);
  const deleteEntry = useEntryStore(state => state.deleteEntry);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valuesChanged, setValuesChanged] = useState<Entry>();
  const [formValues, setFormValues] = useState<types | undefined>(undefined);
  const [form] = Form.useForm();
  const [onCreateValuesChanged, setOnCreateValuesChanged] = useState<Entry>();
  const [createForm] = Form.useForm();

  const handleDoubleClick = (info: Entry) => {
    const defaultValues:types = {
      id: info.id,
      name: `${info.name}`,
      email: `${info.email}`,
      gender: `${info.gender}`,
      street: `${info.address?.street}`,
      city: `${info.address?.city}`,
      phone: `${info.phone}`,
    };
    setFormValues(defaultValues)
    setIsModalOpen(true);
  };


  useEffect(() => {
    form.setFieldsValue(formValues);
  }, [form, formValues]);


  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleCreate = () => {
    createForm.validateFields().then(values => {
      const newEntry = { name: `${onCreateValuesChanged?.name}`, email: `${onCreateValuesChanged?.email}`, gender: `${onCreateValuesChanged?.gender}`, address: {city: `${onCreateValuesChanged?.city}`, street: `${onCreateValuesChanged?.street}`}, phone: `${onCreateValuesChanged?.phone}` }
    createEntry(newEntry)
    createForm.setFieldsValue({name: '', email: '', gender: '', street: '', city: '', phone: ''});
    }).catch(err => {
      console.log('Form validation failed');
    });
    
  };
 

  const handleDelete = (id: number) => {
    deleteEntry(id);
  };

  useEffect(() => {
    if (entries && entries.length > 0) {
    }
  }, [entries]);

  if (entries.length === 0) {
    return <div>please open /server in terminal and run nodemon server.js and then create new terminal to start react</div>;
  }

  const openModalHandler = (name: any,  info: any) => {
    setIsModalOpen(true);
    const defaultValues:types = {
      id: info.id,
      name: `${info.name}`,
      email: `${info.email}`,
      gender: `${info.gender}`,
      street: `${info.address?.street}`,
      city: `${info.address?.city}`,
      phone: `${info.phone}`,
    };
    setFormValues(defaultValues)
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      setIsModalOpen(false);
      const updatedEntry: Partial<Entry> = { name: `${valuesChanged?.name ? valuesChanged?.name : formValues && formValues.name}`, email: `${valuesChanged?.email ? valuesChanged?.email : formValues && formValues.email}`, gender: `${valuesChanged?.gender ? valuesChanged?.gender : formValues && formValues.gender}`, address: {city: `${valuesChanged?.city ? valuesChanged?.city : formValues && formValues.city}`, street: `${valuesChanged?.street ? valuesChanged?.street : formValues && formValues.street}`}, phone: `${valuesChanged?.phone ? valuesChanged?.phone : formValues && formValues.phone}` };
      if(formValues){
        var id = formValues.id
        updateEntry(id, updatedEntry)
      }
    }).catch(err => {
      console.log('eror validate');
    })
    

  };

  const handleCancel = (e:any) => {
    e.preventDefault()
    setIsModalOpen(false);
    form.resetFields();
  };


  const columns: ColumnsType<Entry> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: "email", key:'name'},
    { title: 'gender', dataIndex: "gender", key:'name'},
    { title: 'city', key:'name', render: ((record) => record.address?.city || 'city not found')},
    { title: 'street', key:'name', render: ((record) => record.address?.street || 'street not found')},
    { title: 'phone', dataIndex: "phone", key:'name'},
    { title: 'Action', key: 'action', render: (_, record) => (
      <Space>
        <Button type="primary" onClick={() => openModalHandler(record.id, record)}>ADD</Button>
        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
      </Space>
)},
  ];

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    if(allValues){
      setValuesChanged(allValues)
    }
  };

  const onCreateHandler = (changedValues: any, allvalues: any) => {
    if(allvalues){
      setOnCreateValuesChanged(allvalues)
    }
  }


  const openNewTab = () => {
    const newTabUrl = '/pie';
    window.open(newTabUrl, '_blank');
  };

  return (
    <Router>
    <div>
      <Routes>
        <Route path='/pie' Component={Pie}/>
      </Routes>
      <Table dataSource={entries} columns={columns} rowKey="id" onRow={(record) => ({
          onDoubleClick: () => handleDoubleClick(record),
        })}/>
      <button onClick={openNewTab} style={{fontSize: '20px'}}>Open Pie Chart</button>
      <h2>Create New Entry</h2>
      <Modal  forceRender title="Create New Entry" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} initialValues={formValues} onValuesChange={handleFormValuesChange}>
        <Form.Item label="Name" name="name" rules={nameRules}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={emailRules}>
            <Input />
          </Form.Item>
          <Form.Item label="Gender" name="gender" rules={genderRules}>
            <select>
              
              <option value={`male` || `Male`}>male</option>
              <option value='female'>female</option>
            </select>
          </Form.Item>
          <Form.Item label="Street" name="street" rules={streetRules}>
            <Input />
          </Form.Item>
          <Form.Item label="City" name="city" rules={cityRules}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={phoneRules}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Form form={createForm} onValuesChange={onCreateHandler}>
          <Form.Item label="Name" name="name" rules={nameRules}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={emailRules}>
            <Input />
          </Form.Item>
          <Form.Item label="Gender" name="gender" rules={genderRules}>
            <select>
            <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value='female'>Female</option>
            </select>
          </Form.Item>
          <Form.Item label="Street" name="street" rules={streetRules}>
            <Input />
          </Form.Item>
          <Form.Item label="City" name="city" rules={cityRules}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={phoneRules}>
            <Input />
          </Form.Item>
        </Form>
      
      <Button onClick={handleCreate}>Create</Button>
    </div>
    </Router>

  );
};

export default App;