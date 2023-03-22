import { Steps } from 'antd';
import {
  InfoCircleOutlined,
  PictureOutlined,
  SendOutlined
} from '@ant-design/icons';

export default function Stepper({ step }) {
  return (
    <Steps
      labelPlacement="vertical"
      current={step}
      items={[
        {
          title: 'Détails',
          icon: <InfoCircleOutlined />
        },
        {
          title: 'Photos',
          icon: <PictureOutlined />
        },
        {
          title: 'Submission',
          icon: <SendOutlined />
        }
      ]}
    />
  );
}
