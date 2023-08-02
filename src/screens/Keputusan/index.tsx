import { Button, Card, Col, Form, Input, message, Modal, Row } from 'antd';
import {
  ClusterOutlined,
  ControlOutlined,
  ApartmentOutlined,
  RightOutlined,
} from '@ant-design/icons';
import AppLayout from '../../components/AppLayout';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IconWrapper, Title, CustomCard } from './styles';

const Keputusan: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  console.log(location);
  return (
    <AppLayout title={`SIMD`}>
      {/* <Title>{localStorage.getItem('nama_keputusan')}</Title> */}
      <Row gutter={8}>
        <Col span={8}>
          <CustomCard
            onClick={() => navigate(`/keputusan/${params.id}/kriteria`)}
          >
            <div className="left">
              <IconWrapper>
                <ApartmentOutlined />
              </IconWrapper>
              <div className="title">
                <h4>Kriteria</h4>
                <p>6 Kriteria</p>
              </div>
            </div>
            <div className="right">
              <Button
                icon={<RightOutlined />}
                onClick={() => navigate(`/keputusan/${params.id}/kriteria`)}
              />
            </div>
          </CustomCard>
        </Col>
        <Col span={8}>
          <CustomCard
            onClick={() => navigate(`/keputusan/${params.id}/alternatif`)}
          >
            <div className="left">
              <IconWrapper>
                <ClusterOutlined />
              </IconWrapper>
              <div className="title">
                <h4>Alternatif</h4>
                <p>6 alternatif</p>
              </div>
            </div>
            <div className="right">
              <Button
                icon={<RightOutlined />}
                onClick={() => navigate(`/keputusan/${params.id}/alternatif`)}
              />
            </div>
          </CustomCard>
        </Col>
        <Col span={8}>
          <CustomCard
            onClick={() => navigate(`/keputusan/${params.id}/sub-kriteria`)}
          >
            <div className="left">
              <IconWrapper>
                <ControlOutlined />
              </IconWrapper>
              <div className="title">
                <h4>Sub Kriteria</h4>
                <p>6 sub kriteria</p>
              </div>
            </div>
            <div className="right">
              <Button
                icon={<RightOutlined />}
                onClick={() => navigate(`/keputusan/${params.id}/sub-kriteria`)}
              />
            </div>
          </CustomCard>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default Keputusan;
