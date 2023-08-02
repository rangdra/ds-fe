import axios from '../../../configs/axios';
import React, { useEffect, useMemo, useState } from 'react';
import AppLayout from '../../../components/AppLayout';
import { IAlternatif, IKriteria, IPenilaianAlternatif } from '../../../types';
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
  Typography,
} from 'antd';
import {
  PlusCircleOutlined,
  EyeOutlined,
  EditFilled,
  DeleteFilled,
  LoadingOutlined,
} from '@ant-design/icons';
import theme from '../../../theme';
import { Title } from '../styles';
import { ModalAdd, TitleButtonWrapper } from '../../Dashboard/styles';
import ModalConfirmation from '../../../components/ModalConfirmation';
import { transformMatrix } from '../../../helpers';
import TableMatrixKeputusan from '../../../components/Perhitungan/TableMatrixKeputusan';
import TableBobotKriteria from '../../../components/Perhitungan/TableBobotKriteria';
import TableNormalisasi from '../../../components/Perhitungan/TableNormalisasi';
import TableUtility from '../../../components/Perhitungan/TableUtility';
import TableNilaiAkhir from '../../../components/Perhitungan/TableNilaiAkhir';
import TablePerankingan from '../../../components/Perhitungan/TablePerankingan';

const { Text } = Typography;

function Perhitungan() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [listKriteria, setListKriteria] = useState<IKriteria[]>([]);
  const [listAlternatif, setListAlternatif] = useState<IAlternatif[]>([]);
  const [listPenilaianAlternatif, setListPenilaianAlternatif] = useState<
    IPenilaianAlternatif[]
  >([]);
  const [fetchTrue, setFetchTrue] = useState(true);

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

  return (
    <AppLayout title={`${localStorage.getItem('nama_keputusan')}`}>
      {isLoading && <LoadingOutlined />}
      {!isLoading && listPenilaianAlternatif.length > 0 && (
        <>
          <TitleButtonWrapper>
            <h2>Perhitungan</h2>
          </TitleButtonWrapper>
          <TableMatrixKeputusan
            listKriteria={listKriteria}
            listPenilaianAlternatif={listPenilaianAlternatif}
            isLoading={isLoading}
          />
          <TableBobotKriteria listKriteria={listKriteria} />
          <TableNormalisasi listKriteria={listKriteria} />
          <TableUtility
            kepId={params?.id}
            listKriteria={listKriteria}
            listPenilaianAlternatif={listPenilaianAlternatif}
          />
          <TableNilaiAkhir
            listKriteria={listKriteria}
            listPenilaianAlternatif={listPenilaianAlternatif}
            kepId={params?.id}
          />
          <TablePerankingan
            listKriteria={listKriteria}
            listPenilaianAlternatif={listPenilaianAlternatif.sort(
              (a, b) => b.total_nilai - a.total_nilai
            )}
          />
        </>
      )}
      {!isLoading && !listPenilaianAlternatif && (
        <Alert
          message="Tidak ada perhitungan. Pastkan anda sudah mengisi penilaian alternatif."
          type="error"
          style={{ width: '100%' }}
          showIcon
        />
      )}
    </AppLayout>
  );
}

export default Perhitungan;
