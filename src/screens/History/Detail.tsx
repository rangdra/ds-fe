import { Button, Card, Col, Row, Table, Typography, message } from 'antd';
import axios from '../../configs/axios';
import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import moment from 'moment';
import {
  SolutionOutlined,
  DotChartOutlined,
  PrinterOutlined,
  UndoOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ReactToPrint from 'react-to-print';
import theme from '../../theme';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import LoadingComp from '../../components/LoadingComp';
import { IGejala } from '../Gejala';
import { HasilIdentifikasi } from '../../components/HasilIdentifikasi';
import { useGlobalContext } from '../../context/GlobalContext';

export default function Detail() {
  const { isMhs } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState<any>();
  const params = useParams();
  const componentRef = useRef<any>();

  const getDetail = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/histories/${params.historyId}`);
      setDetail(res.data);
    } catch (error: any) {
      message.error('Something went wrong!');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  const columns = [
    {
      title: 'Kode',
      dataIndex: 'code',
      key: 'code',
      width: '20%',
    },
    {
      title: 'Kriteria Terpilih',
      dataIndex: 'name',
      key: 'name',
      width: '80%',
    },
  ];

  console.log(detail);

  return (
    <AppLayout title={`Detail Hasil Identifikasi`}>
      {isLoading && <LoadingComp />}
      {!isLoading && (
        <>
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold mb-2">Hasil Identifikasi</h1>{' '}
            {isMhs ? (
              <></>
            ) : (
              <ReactToPrint
                documentTitle="hasil"
                trigger={() => (
                  <Button icon={<PrinterOutlined />} type="primary">
                    Cetak
                  </Button>
                )}
                content={() => componentRef.current}
              />
            )}
          </div>

          <p className="text-red-500 text-sm">
            Berikut hasil identifikasi mahasiswa
          </p>
          <div className="flex items-center gap-2 mb-2">
            <UserOutlined />
            <p className="mb-0">
              <span className="font-medium mr-2">{detail?.user?.fullname}</span>
              {moment(detail?.createdAt).format('DD MMM YYYY HH:MM:DD')}
            </p>
          </div>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Table
                dataSource={detail?.evidences}
                columns={columns}
                pagination={false}
              />
            </Col>
            <Col span={24}>
              <CustomCard
                title="Kesimpulan"
                headStyle={{ background: theme.primary }}
              >
                <div dangerouslySetInnerHTML={{ __html: detail?.payload }} />
              </CustomCard>
            </Col>
            <Col span={24}>
              <CustomCard
                title="Berdasarkan kriteria yang dipilih ada beberapa rekomendasi yang bisa dilakukan : "
                headStyle={{ background: theme.primary }}
              >
                {/* {detail?.problem.map((item: IGejala) => (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item?.description || '',
                    }}
                  />
                ))} */}
                {detail?.evidences.map((item: IGejala) => (
                  <Row style={{ gap: 8 }}>
                    <Typography.Text strong>{item.name}: </Typography.Text>
                    <Typography.Text>{item.description}</Typography.Text>
                  </Row>
                ))}
              </CustomCard>
            </Col>
          </Row>
          <div style={{ display: 'none' }}>
            <HasilIdentifikasi detail={detail} ref={componentRef} />
          </div>
        </>
      )}
    </AppLayout>
  );
}

const CustomCard = styled(Card)`
  .ant-card-head-title {
    color: #fff;
  }

  .ant-card-body {
    border: 1px solid ${theme.primary};
  }
`;
