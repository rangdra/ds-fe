import axios from '../../../configs/axios';
import React, { useEffect, useState } from 'react';
import AppLayout from '../../../components/AppLayout';
import { IAlternatif, IKriteria } from '../../../types';
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

function Alternatif() {
  const [form] = Form.useForm();
  const params = useParams();
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listAlternatif, setListAlternatif] = useState<IAlternatif[]>([]);
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
      title: 'Nama Alternatif',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Kode',
      dataIndex: 'kode',
      key: 'kode',
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
    const getListAlternatif = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/keputusan/${params?.id}/alternatif`);
        setListAlternatif(
          res.data.map((item: IAlternatif, idx: number) => ({
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
      getListAlternatif();
      setFetchTrue(false);
    }
  }, [fetchTrue]);

  console.log(listAlternatif);

  const onFinish = async (values: any) => {
    setIsLoading(true);

    try {
      let res;
      if (currentData) {
        res = await axios.put(
          `/keputusan/${params?.id}/alternatif/${currentData?._id}`,
          {
            ...values,
          }
        );
      } else {
        res = await axios.post(`/keputusan/${params?.id}/alternatif`, {
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

  const deleteAlternatif = async (kritId: string) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `/keputusan/${params?.id}/alternatif/${kritId}`
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
        <h2>Daftar Alternatif</h2>
        <Button
          type="primary"
          onClick={() => setIsModalAdd(true)}
          className="btn-action"
        >
          <PlusCircleOutlined style={{ fontSize: 20 }} />
          Tambah Alternatif
        </Button>
      </TitleButtonWrapper>
      <Table
        loading={isLoading}
        bordered
        columns={columns}
        // dataSource={listAlternatif}
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
            label="Nama Alternatuf"
            name="title"
            rules={[
              { required: true, message: 'Mohon masukan nama alternatif!' },
            ]}
          >
            <Input placeholder="Masukan nama alternatuf..." />
          </Form.Item>
          <Form.Item
            label="Kode"
            name="kode"
            rules={[
              { required: true, message: 'Mohon masukan kode alternatif!' },
            ]}
          >
            <Input placeholder="Masukan kode alternatif..." />
          </Form.Item>

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
        title="Hapus Alternatif"
        isVisible={isModalDelete}
        setVisibility={setIsModalDelete}
        submitHandler={() => deleteAlternatif(currentId)}
      />
    </AppLayout>
  );
}

export default Alternatif;
