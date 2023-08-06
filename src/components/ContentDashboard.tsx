import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { RightOutlined } from '@ant-design/icons';
import { useGlobalContext } from '../context/GlobalContext';

export default function ContentDashboard() {
  return (
    <Content>
      <div className="inner">
        <h1>Selamat Datang di Sistem Identifikasi Dini Mahasiswa Drop Out!</h1>
        <p>
          Sistem Identifikasi Dini Mahasiswa Drop Out adalah platform yang
          dirancang khusus untuk membantu lembaga pendidikan mengenali dan
          membeikan perhatian pada mahasiswa yang berpotensi drop out sebelum
          terlambat.
        </p>
        <Link to={'/identifikasi'}>
          <Button type="primary">
            Identifikasi <RightOutlined />
          </Button>
        </Link>
      </div>
    </Content>
  );
}

const Content = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .inner {
    h1,
    p {
      text-align: center;
    }

    h1 {
      font-weight: 700;
      font-size: 24px;
    }

    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 8px;
  }

  @media only screen and (min-width: 992px) {
    .inner {
      width: 60%;
    }
  }
`;
