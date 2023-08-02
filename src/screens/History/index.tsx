import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import ReactToPrint from 'react-to-print';
import { EditOutlined, DeleteFilled, PrinterOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import axios from '../../configs/axios';
import moment from 'moment';
import AppLayout from '../../components/AppLayout';
import { useGlobalContext } from '../../context/GlobalContext';
import { Link, useNavigate } from 'react-router-dom';
import { IGejala } from '../Gejala';
import { ColumnsType, TableProps } from 'antd/es/table';
import theme from '../../theme';

const History = () => {
  const [form] = Form.useForm();
  const [listHistory, setListHistory] = useState<any>([]);
  const { isMhs, currentUser, isSuperAdmin, isAdmin } = useGlobalContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetch, setIsFetch] = useState(true);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const [tmpHistory, setTmpHistory] = useState<any>();

  const columns = [
    {
      title: 'Nama Mahasiswa',
      dataIndex: 'mahasiswa',
      key: 'mahasiswa',
      render: (_: any, record: any) => (
        <Link
          style={{ color: theme.gray800, textDecoration: 'underline' }}
          to={`/hasil/${record._id}`}
        >
          {record.user.fullname}
        </Link>
      ),
    },
    {
      title: 'Kriteria Terpilih',
      dataIndex: 'gejala',
      key: 'gejala',
      render: (_: any, record: any) => (
        <div>
          {record.evidences.map((evidence: IGejala) => (
            <Tag color="blue">{evidence.name}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Hasil',
      dataIndex: 'hasil',
      key: 'hasil',
      render: (_: any, record: any) => (
        <div dangerouslySetInnerHTML={{ __html: record.payload }} />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: any) => (
        <div>{moment(date).format('DD MMMM YYYY HH:MM:DD')}</div>
      ),
    },
    isAdmin && {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <Space>
            <Button
              icon={<DeleteFilled />}
              type="primary"
              danger
              ghost
              onClick={() => {
                setTmpHistory(record);
                setIsModalDeleteVisible(true);
              }}
            >
              Hapus
            </Button>
          </Space>
        );
      },
    },
  ].filter(Boolean) as TableProps<any>['columns'];

  const getHistories = async () => {
    setIsLoading(true);
    let url = isMhs ? `/histories?userId=${currentUser?._id}` : '/histories';
    try {
      const resHistory = await axios.get(url);

      setListHistory(resHistory.data);
    } catch (error: any) {
      message.error('Something went wrong!');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFetch) {
      getHistories();
      setIsFetch(false);
    }
  }, [isFetch]);

  const hapusHistory = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`/histories/${tmpHistory?._id}`);

      setIsFetch(true);
      setIsModalDeleteVisible(false);
      message.success(res.data.message);
    } catch (error: any) {
      console.log(error);
      message.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Daftar Hasil Identifikasi">
      <Table dataSource={listHistory} columns={columns} loading={isLoading} />

      {/* Delete */}
      <Modal
        title="Hapus History"
        open={isModalDeleteVisible}
        onOk={hapusHistory}
        onCancel={() => {
          setIsModalDeleteVisible(false);
          setTmpHistory(null);
        }}
        confirmLoading={isLoading}
      >
        <Typography.Text
          style={{ fontSize: 16, display: 'block', margin: '20px 0px' }}
        >
          Apakah anda yakin ingin menghapus riwayat ini ?
        </Typography.Text>
      </Modal>
    </AppLayout>
  );
};

export default History;
