import { Steps } from 'antd';
import {
  FileDoneOutlined,
  PictureOutlined,
  ProfileOutlined
} from '@ant-design/icons';

export default function Stepper({ step }) {
  return (
    <Steps
      labelPlacement="vertical"
      current={step}
      items={[
        {
          title: 'Details',
          icon: <ProfileOutlined />
        },
        {
          title: 'Photos',
          icon: <PictureOutlined />
        },
        {
          title: 'Submitted !',
          icon: <FileDoneOutlined />
        }
      ]}
    />
  );
}
