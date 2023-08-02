import axios from '../../../configs/axios';
import React, { useEffect, useState } from 'react';
import AppLayout from '../../../components/AppLayout';
import { IKriteria } from '../../../types';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Alert,
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
  LoadingOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import theme from '../../../theme';
import { Title } from '../styles';
import { ModalAdd, TitleButtonWrapper } from '../../Dashboard/styles';
import ModalConfirmation from '../../../components/ModalConfirmation';

function SubKriteria() {
  const [form] = Form.useForm();
  const params = useParams();
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listKriteria, setListKriteria] = useState<IKriteria[]>([]);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [currentId, setCurrentId] = useState<any>(null);
  const [fetchTrue, setFetchTrue] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const handleCloseModal = () => {
    setIsModalAdd(false);
    form.resetFields();
    setCurrentData(null);
    setIsEdit(false);
  };

  const columns = [
    {
      title: 'Nama Sub Kriteria',
      dataIndex: 'subKriteria',
      key: 'subKriteria',
    },

    {
      title: 'Nilai',
      dataIndex: 'nilai',
      key: 'nilai',
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
                setIsEdit(true);
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
                setCurrentId({ kritId: data?.kriteriaId, subId: data?._id });
              }}
              style={{ border: 'none' }}
            />
          </Col>
        </Row>
      ),
    },
  ];

  useEffect(() => {
    const getListSubKriteria = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/keputusan/${params?.id}/kriteria/`);
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
      getListSubKriteria();
      setFetchTrue(false);
    }
  }, [fetchTrue]);

  console.log(listKriteria);

  const onFinish = async (values: any) => {
    setIsLoading(true);
    if (!currentData) {
      message.error('missing data!');
      return;
    }

    try {
      let res;
      if (isEdit) {
        res = await axios.put(
          `/keputusan/${params?.id}/kriteria/${currentData?.kriteriaId}/sub/${currentData?._id}`,
          {
            ...values,
          }
        );
      } else {
        res = await axios.post(
          `/keputusan/${params?.id}/kriteria/${currentData?._id}/sub`,
          {
            ...values,
          }
        );
      }

      message.success(res?.data?.message);
      setFetchTrue(true);
      setIsLoading(false);
      form.resetFields();
      setCurrentData(null);
      setIsModalAdd(false);
      setIsEdit(false);
    } catch (error: any) {
      setIsLoading(false);
      message.error(error?.response?.data?.message || 'error');
    }
  };

  const deleteSubKriteria = async (listId: {
    kritId: string;
    subId: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `/keputusan/${params?.id}/kriteria/${listId?.kritId}/sub/${listId?.subId}`
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
    <AppLayout
      title={`Sub Kriteria: ${localStorage.getItem('nama_keputusan')}`}
    >
      <Row>
        {isLoading && <LoadingOutlined />}
        {!isLoading && !listKriteria && (
          <Alert
            message="Sub Kriteria kosong. Silahkan isi kriteria terlebih dahulu"
            type="error"
            style={{ width: '100%' }}
            showIcon
          />
        )}

        {!isLoading &&
          listKriteria.length > 0 &&
          listKriteria?.map((item) => (
            <Col span={24} style={{ marginBottom: 24 }}>
              <TitleButtonWrapper sub>
                <h2>
                  {item?.title} ({item.kode}
                </h2>
                <Button
                  type="primary"
                  onClick={() => {
                    setIsModalAdd(true);
                    setCurrentData(item);
                  }}
                  className="btn-action"
                >
                  <PlusCircleOutlined style={{ fontSize: 20 }} />
                  Tambah Sub Kriteria
                </Button>
              </TitleButtonWrapper>
              <Table
                loading={isLoading}
                bordered
                columns={columns}
                dataSource={item?.subKriteria}
              />
            </Col>
          ))}
      </Row>
      {/* Modal */}
      <ModalAdd footer={null} closable={false} open={isModalAdd}>
        <h3>{isEdit ? 'Edit' : 'Tambah'} Sub Kriteria</h3>
        <Form
          name="basic"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Nama Sub Kriteria"
            name="subKriteria"
            rules={[
              { required: true, message: 'Mohon masukan nama sub kriteria!' },
            ]}
          >
            <Input placeholder="Masukan nama sub kriteria..." />
          </Form.Item>
          <Form.Item
            label="Nilai"
            name="nilai"
            rules={[
              { required: true, message: 'Mohon masukan nilai sub kriteria!' },
            ]}
          >
            <InputNumber
              placeholder="0 - 100"
              min={0}
              max={100}
              style={{ width: '100%' }}
            />
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
        title="Hapus Sub Kriteria"
        isVisible={isModalDelete}
        setVisibility={setIsModalDelete}
        submitHandler={() => deleteSubKriteria(currentId)}
      />
    </AppLayout>
  );
}

export default SubKriteria;
