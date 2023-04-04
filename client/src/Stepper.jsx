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
          icon: <ProfileOutlined className="step-icon" />
        },
        {
          title: 'Photos',
          icon: <PictureOutlined className="step-icon" />
        },
        {
          title: 'Submitted !',
          icon: <FileDoneOutlined className="step-icon" />
        }
      ]}
    />
  );
}
