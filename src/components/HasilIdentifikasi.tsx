import {
  SolutionOutlined,
  DotChartOutlined,
  PrinterOutlined,
  UndoOutlined,
  UserOutlined,
} from '@ant-design/icons';
import axios from '../configs/axios';
import { Card, Col, Row, Table, Typography } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import { IGejala } from '../screens/Gejala';
import theme from '../theme';
import Logo from '../assets/logo-pranata.png';

import React from 'react';

export const HasilIdentifikasi = React.forwardRef(
  ({ detail }: { detail: any }, ref: any) => {
    const columns = [
      {
        title: 'Kode',
        dataIndex: 'code',
        key: 'code',
        width: '20%',
      },
      {
        title: 'kriteria Terpilih',
        dataIndex: 'name',
        key: 'name',
        width: '80%',
      },
    ];

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '8px 12px',
          width: '100%',
        }}
      >
        <div>
          <div className="flex justify-center">
            <img src={Logo} alt="logo" className="h-[160px] w-[160px] my-8" />
          </div>
          <h1 className="text-2xl font-bold my-2">Hasil Identifikasi</h1>
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
                  <Row>
                    <Typography.Text strong>{item.name}: </Typography.Text>
                    <Typography.Text>{item.description}</Typography.Text>
                  </Row>
                ))}
              </CustomCard>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
);

const CustomCard = styled(Card)`
  .ant-card-head-title {
    color: #fff;
  }

  .ant-card-body {
    border: 1px solid ${theme.primary};
  }
`;
