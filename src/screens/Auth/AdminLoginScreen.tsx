import { Button, Form, Input } from 'antd';
import IllustLogin from '../../assets/illust-admin.png';
import GoogleIcon from '../../assets/google-icon.png';
import { useGlobalContext } from '../../context/GlobalContext';
import Logo from '../../assets/logo-pranata.png';

import {
  AuthContainer,
  ButtonGoogle,
  ButtonSubmit,
  FormContainer,
  FormWrapper,
  ImageContainer,
  TextLink,
  TextQuestion,
} from './styles';
import { useLocation } from 'react-router-dom';

export default function AdminLoginScreen() {
  const { login, loading, loginWithGoogle } = useGlobalContext();
  const onFinish = (values: any) => {
    login(values);
  };

  return (
    <AuthContainer>
      <FormContainer>
        <FormWrapper
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <div className="flex justify-center">
            <img src={Logo} alt="logo" className="h-[90px] w-[90px] mb-4" />
          </div>
          {/* <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Silahkan masukan email anda!' },
              {
                type: 'email',
                message: 'Email anda tidak valid!',
              },
            ]}
          >
            <Input size="large" />
          </Form.Item> */}

          <Form.Item
            label="Nama Pengguna"
            name="username"
            rules={[
              {
                required: true,
                message: 'Silahkan masukan nama pengguna anda!',
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Silahkan masukan password anda!' },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 8 }}>
            <ButtonSubmit
              type="primary"
              htmlType="submit"
              // size="large"
              loading={loading}
            >
              Submit
            </ButtonSubmit>
          </Form.Item>
          {/* <p className="or">atau</p>
          <ButtonGoogle onClick={loginWithGoogle}>
            <img src={GoogleIcon} alt="google-icon" /> Masuk dengan Google
          </ButtonGoogle> */}
          {/* <TextQuestion>
            Belum punya akun? <TextLink to="/register">Daftar</TextLink>
          </TextQuestion> */}
        </FormWrapper>
      </FormContainer>

      <ImageContainer>
        <img src={IllustLogin} alt="" />
      </ImageContainer>
    </AuthContainer>
  );
}
