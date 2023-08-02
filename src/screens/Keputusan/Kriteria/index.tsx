import axios from '../../../configs/axios';
import React, { useEffect, useState } from 'react';
import AppLayout from '../../../components/AppLayout';
import { IKriteria } from '../../../types';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Table,
  Tag,
} from 'antd';
import {
  PlusCircleOutlined,
  EyeOutlined,
  EditFilled,
  DeleteFilled,
} from '@ant-design/icons';
import theme from '../../../theme';
import { Title } from '../styles';
import { ModalAdd, TitleButtonWrapper } from '../../Dashboard/styles';
import ModalConfirmation from '../../../components/ModalConfirmation';

function Kriteria() {
  const [form] = Form.useForm();
  const params = useParams();
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listKriteria, setListKriteria] = useState<IKriteria[]>([]);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [currentId, setCurrentId] = useState<any>(null);
  const [fetchTrue, setFetchTrue] = useState(true);

  const handleCloseModal = () => {
    setIsModalAdd(false);
    form.resetFields();
    setCurrentData(null);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },

    {
      title: 'Nama Kriteria',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Kode',
      dataIndex: 'kode',
      key: 'kode',
    },
    {
      title: 'Bobot',
      dataIndex: 'bobot',
      key: 'bobot',
    },
    {
      title: 'Tipe',
      dataIndex: 'tipe',
      key: 'tipe',
      render: (item: string) => (
        <>
          <Tag color={`${item === 'benefit' ? 'blue' : 'red'}`}>{item}</Tag>
        </>
      ),
    },

    {
      title: 'Action',
      key: 'action',
      render: (_: any, data: any) => (
        <Row gutter={4}>
          <Col>
            <Button
              type="ghost"
              onClick={() => {
                setCurrentData(data);
                form.setFieldsValue(data);
                setIsModalAdd(true);
              }}
              icon={<EditFilled style={{ color: theme.link }} />}
              style={{ border: 'none' }}
            />
          </Col>
          <Col>
            <Button
              type="ghost"
              icon={<DeleteFilled style={{ color: theme.red }} />}
              onClick={() => {
                setIsModalDelete(true);
                setCurrentId(data?._id);
              }}
              style={{ border: 'none' }}
            />
          </Col>
        </Row>
      ),
    },
  ];

  useEffect(() => {
    const getListKriteria = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/keputusan/${params?.id}/kriteria`);
        setListKriteria(
          res.data.map((item: IKriteria, idx: number) => ({
            no: idx + 1,
            ...item,
          }))
        );
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    if (fetchTrue) {
      getListKriteria();
      setFetchTrue(false);
    }
  }, [fetchTrue]);

  console.log(listKriteria);

  const onFinish = async (values: any) => {
    setIsLoading(true);

    try {
      let res;
      if (currentData) {
        res = await axios.put(
          `/keputusan/${params?.id}/kriteria/${currentData?._id}`,
          {
            ...values,
          }
        );
      } else {
        res = await axios.post(`/keputusan/${params?.id}/kriteria`, {
          ...values,
        });
      }
      message.success(res?.data?.message);
      setFetchTrue(true);
      setIsLoading(false);
      form.resetFields();
      setCurrentData(null);
      setIsModalAdd(false);
    } catch (error: any) {
      setIsLoading(false);
      message.error(error?.response?.data?.message || 'error');
    }
  };

  const deleteKriteria = async (kritId: string) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `/keputusan/${params?.id}/kriteria/${kritId}`
      );
      message.success(res?.data?.message);
      setFetchTrue(true);
      setIsLoading(false);
      setIsModalDelete(false);
      setCurrentId(null);
    } catch (error: any) {
      setIsLoading(false);
      message.error(error?.response?.data?.message || 'error');
    }
  };

  return (
    <AppLayout title={`Kriteria: ${localStorage.getItem('nama_keputusan')}`}>
      <TitleButtonWrapper>
        <h2>Daftar Kriteria</h2>
        <Button
          type="primary"
          onClick={() => setIsModalAdd(true)}
          className="btn-action"
        >
          <PlusCircleOutlined style={{ fontSize: 20 }} />
          Tambah Kriteria
        </Button>
      </TitleButtonWrapper>
      <Table
        loading={isLoading}
        bordered
        columns={columns}
        // dataSource={listKriteria}
        dataSource={[]}
      />

      {/* Modal */}
      <ModalAdd footer={null} closable={false} open={isModalAdd}>
        <h3>{currentData ? 'Edit' : 'Tambah'} Kriteria</h3>
        <Form
          name="basic"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Nama Kriteria"
            name="title"
            rules={[
              { required: true, message: 'Mohon masukan nama kriteria!' },
            ]}
          >
            <Input placeholder="Masukan nama kriteria..." />
          </Form.Item>

          <Row gutter={10}>
            <Col span={8}>
              <Form.Item
                label="Kode"
                name="kode"
                rules={[
                  { required: true, message: 'Mohon masukan kode kriteria!' },
                ]}
              >
                <Input placeholder="Masukan kode kriteria..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              {' '}
              <Form.Item
                label="Bobot"
                name="bobot"
                rules={[
                  { required: true, message: 'Mohon masukan bobot kriteria!' },
                ]}
              >
                <InputNumber
                  placeholder="0 - 100"
                  min={0}
                  max={100}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Tipe"
                name="tipe"
                rules={[
                  { required: true, message: 'Mohon masukan tipe kriteria!' },
                ]}
              >
                <Select
                  placeholder="Benefit or Cost"
                  options={[
                    {
                      value: 'benefit',
                      label: 'Benefit',
                    },
                    {
                      value: 'cost',
                      label: 'Cost',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Button
                  type="text"
                  onClick={handleCloseModal}
                  className="close"
                >
                  Close
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  loading={isLoading}
                  type="primary"
                  htmlType="submit"
                  className="action"
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </ModalAdd>
      <ModalConfirmation
        title="Hapus Kriteria"
        isVisible={isModalDelete}
        setVisibility={setIsModalDelete}
        submitHandler={() => deleteKriteria(currentId)}
      />
    </AppLayout>
  );
}

export default Kriteria;
