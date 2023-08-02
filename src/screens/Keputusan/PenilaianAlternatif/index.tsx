import axios from '../../../configs/axios';
import React, { useEffect, useMemo, useState } from 'react';
import AppLayout from '../../../components/AppLayout';
import { IAlternatif, IKriteria, IPenilaianAlternatif } from '../../../types';
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

function PenilaianAlternatif() {
  const [form] = Form.useForm();
  const params = useParams();
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listKriteria, setListKriteria] = useState<IKriteria[]>([]);
  const [listAlternatif, setListAlternatif] = useState<IAlternatif[]>([]);
  const [listPenilaianAlternatif, setListPenilaianAlternatif] = useState<
    IPenilaianAlternatif[]
  >([]);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [currentId, setCurrentId] = useState<any>(null);
  const [fetchTrue, setFetchTrue] = useState(true);

  const handleCloseModal = () => {
    setIsModalAdd(false);
    form.resetFields();
    setCurrentData(null);
  };

  const columns = useMemo(() => {
    let data: any = [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: '5%',
      },

      {
        title: 'Alternatif',
        dataIndex: 'alternatifId',
        key: 'alternatifId',
        render: (_: any, data: IPenilaianAlternatif) => (
          <>{data?.alternatifId.title}</>
        ),
      },
    ];
    listKriteria.map((item, idx) =>
      data.push({
        title: `${item.title} (${item.kode})`,
        dataIndex: item.title.toLocaleLowerCase(),
        key: item.title.toLocaleLowerCase(),
        render: (_: any, data: IPenilaianAlternatif) => (
          <>
            {data?.kriteriaTerpilih[idx].subKriteriaId.subKriteria} (
            {data?.kriteriaTerpilih[idx].subKriteriaId.nilai})
          </>
        ),
      })
    );

    data.push({
      title: 'Action',
      key: 'action',
      render: (_: any, data: any) => (
        <Row gutter={4}>
          <Col>
            <Button
              type="ghost"
              onClick={() => {
                setCurrentData(data);
                const objId = data.kriteriaTerpilih.reduce(
                  (item: any, val: any, idx: number) => {
                    item[`subKriteria ${idx + 1}`] = val._id;

                    return item;
                  },
                  {}
                );

                form.setFieldsValue({
                  alternatifId: data.alternatifId._id,
                  ...objId,
                });
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
    });
    return data;
  }, [listKriteria]);

  const optAlternatif = useMemo(
    () =>
      listAlternatif.map((item) => ({
        value: item._id,
        label: item.title,
        disabled: listPenilaianAlternatif.some(
          (list) => list.alternatifId.title === item.title
        ),
      })),
    [listAlternatif, listPenilaianAlternatif]
  );

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

    getListKriteria();
  }, []);

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

    getListAlternatif();
  }, []);

  useEffect(() => {
    const getListPenilaianAlternatif = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `/keputusan/${params?.id}/penilaian-alternatif`
        );
        setListPenilaianAlternatif(
          res.data.map((item: IPenilaianAlternatif, idx: number) => ({
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
      getListPenilaianAlternatif();
      setFetchTrue(false);
    }
  }, [fetchTrue]);

  console.log(listPenilaianAlternatif);

  const onFinish = async (values: any) => {
    const { alternatifId, ...subKriteria } = values;
    const subId = Object.values(subKriteria).map((id) => ({
      subKriteriaId: id,
    }));
    const data = {
      alternatifId,
      kriteriaTerpilih: subId,
    };

    try {
      let res;
      if (currentData) {
        res = await axios.put(
          `/keputusan/${params?.id}/penilaian-alternatif/${currentData?._id}`,
          data
        );
      } else {
        res = await axios.post(
          `/keputusan/${params?.id}/penilaian-alternatif`,
          data
        );
      }
      console.log(res);
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

  const deletePenilaianAlternatif = async (penAltId: string) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `/keputusan/${params?.id}/penilaian-alternatif/${penAltId}`
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
    <AppLayout title={`${localStorage.getItem('nama_keputusan')}`}>
      <TitleButtonWrapper>
        <h2>Daftar Penilaian Alternatif</h2>
        <Button
          type="primary"
          onClick={() => setIsModalAdd(true)}
          className="btn-action"
        >
          <PlusCircleOutlined style={{ fontSize: 20 }} />
          Tambah Penilaian Alternatif
        </Button>
      </TitleButtonWrapper>
      <Table
        loading={isLoading}
        bordered
        columns={columns}
        dataSource={listPenilaianAlternatif}
      />

      {/* Modal */}
      <ModalAdd footer={null} closable={false} open={isModalAdd}>
        <h3>{currentData ? 'Edit' : 'Tambah'} Penilaian Alternatif</h3>
        <Form
          name="basic"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Pilih Alternatif"
            name="alternatifId"
            rules={[{ required: true, message: 'Mohon pilih alternatif!' }]}
          >
            <Select options={optAlternatif} disabled={currentData} />
          </Form.Item>

          {listKriteria.map((item, idx) => (
            <Form.Item
              key={item._id}
              label={`${item.title} (${item.kode})`}
              name={`subKriteria ${idx + 1}`}
              rules={[{ required: true, message: 'Mohon pilih sub kriteria!' }]}
            >
              <Select
                options={item.subKriteria.map((item2) => ({
                  value: item2._id,
                  label: `${item2.subKriteria} (${item2.nilai})`,
                }))}
              />
            </Form.Item>
          ))}
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
        title="Hapus Penilaian Alternatif"
        isVisible={isModalDelete}
        setVisibility={setIsModalDelete}
        submitHandler={() => deletePenilaianAlternatif(currentId)}
      />
    </AppLayout>
  );
}

export default PenilaianAlternatif;
