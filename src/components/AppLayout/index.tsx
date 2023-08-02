import React, { ReactNode, useState } from 'react';
import {
  ClusterOutlined,
  ApartmentOutlined,
  TeamOutlined,
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  CalculatorOutlined,
  ArrowLeftOutlined,
  BarChartOutlined,
  BorderBottomOutlined,
  HistoryOutlined,
  QuestionOutlined,
  RiseOutlined,
} from '@ant-design/icons';

import { Button, Divider, MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Logo from '../../assets/logo-pranata.png';
import { useGlobalContext } from '../../context/GlobalContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SiderCustom, SiderHeader, Header, Content } from './styles';
import UserAvatar from '../UserAvatar';

const { Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const AppLayout = ({
  title = 'Dashboard',
  children,
}: {
  children: ReactNode;
  title?: string;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, isAdmin, isSuperAdmin } = useGlobalContext();

  function checkTimeOfDay() {
    let currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Pagi';
    } else if (currentHour < 18) {
      return 'Sore';
    } else {
      return 'Malam';
    }
  }

  const items = [
    getItem(
      'Admin Area',
      'grp',
      <UserOutlined />,
      [
        getItem('Dashboard', '/dashboard', <DashboardOutlined />),
        isAdmin ? getItem('Data Admin', '/data-admin', <UserOutlined />) : null,
        getItem('Mahasiswa', '/mahasiswa', <TeamOutlined />),
        isAdmin ? getItem('Daftar Login', '/log', <RiseOutlined />) : null,
      ],
      'group'
    ),
    getItem(
      'SPK Area',
      'grp-spk',
      <CalculatorOutlined />,
      [
        getItem('Kategori', '/kategori', <ClusterOutlined />),
        getItem('Kriteria', '/kriteria', <ApartmentOutlined />),
        getItem('Rule', '/rules', <BorderBottomOutlined />),
        // getItem('Pertanyaan', '/pertanyaan', <QuestionOutlined />),
        getItem('Identifikasi', '/identifikasi', <BarChartOutlined />),
        getItem('Hasil Identifikasi', '/hasil', <HistoryOutlined />),
      ],
      'group'
    ),
    getItem(
      'Lainnya',
      'lainnya',
      <CalculatorOutlined />,
      [getItem('Logout', 'logout', <LogoutOutlined />)],
      'group'
    ),
  ];

  const itemsMhs = [
    getItem(
      'Menu',
      'grp',
      <UserOutlined />,
      [
        getItem('Dashboard', '/dashboard', <DashboardOutlined />),
        getItem('Identifikasi', '/identifikasi', <BarChartOutlined />),
        getItem('Hasil Identifikasi', '/hasil', <HistoryOutlined />),
        getItem('Logout', 'logout', <LogoutOutlined />),
      ],
      'group'
    ),
  ];

  const handleClickMenu = ({ key }: { key: any }) => {
    if (key === 'logout') {
      logout();
      return;
    }
    navigate(`${key}`);
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderCustom
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        // style={{
        //   overflow: 'auto',
        //   height: '100vh',
        //   position: 'fixed',
        //   left: 0,
        //   top: 0,
        //   bottom: 0,
        // }}
        // trigger={null}
      >
        <SiderHeader>
          <img src={Logo} alt="logo" />
        </SiderHeader>
        <Divider style={{ margin: '16px 0px' }} />
        <Menu
          theme="light"
          defaultSelectedKeys={[location?.pathname]}
          mode="inline"
          items={isAdmin || isSuperAdmin ? items : itemsMhs}
          onClick={handleClickMenu}
        />
      </SiderCustom>
      {/* <Layout style={{ marginLeft: !collapsed ? 200 : 80 }}> */}
      <Layout>
        <Header>
          <div className="header-menu">
            <div className="left">
              {location.pathname !== '/dashboard' && (
                <Button
                  type="ghost"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(-1)}
                  style={{ marginRight: 8 }}
                />
              )}

              <h2>{title || 'Dashboard'}</h2>
            </div>

            {currentUser ? (
              <UserAvatar isDashboard />
            ) : (
              <div>
                <Button type="primary" style={{ marginRight: 8 }}>
                  Login
                </Button>
              </div>
            )}
          </div>
        </Header>
        <Content>{children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          Sistem Identifikasi Dini Mahasiswa Drop Out
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
