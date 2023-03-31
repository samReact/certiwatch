import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  InputNumber,
  Typography,
  Steps,
  Result
} from 'antd';
import { useAccount } from 'wagmi';
import {
  FileDoneOutlined,
  ProfileOutlined,
  SmileOutlined
} from '@ant-design/icons';

import { add } from '../state/watchesSlice';
import { WATCH_BRANDS } from '../utils';
import { addNotification } from '../state/notificationSlice';

const { Item } = Form;

export default function SellPage() {
  const [step, setStep] = useState(0);
  const { address, isDisconnected } = useAccount();

  const watches = useSelector((state) => state.watches.watches);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const navigate = useNavigate();

  async function handleNext() {
    if (step === 0) {
      try {
        let validate = await form.validateFields();
        const { errorFields } = validate;
        if (!errorFields) {
          let values = form.getFieldsValue();
          dispatch(
            add({
              ...values,
              address,
              id: watches.length
            })
          );
          setStep(step + 1);
        }
      } catch (error) {
        dispatch(
          addNotification({
            message: 'Error',
            description: error.message,
            type: 'error'
          })
        );
      }
    } else if (step === 1) {
    }
  }

  const layout = {
    wrapperCol: {
      span: 18
    }
  };

  return (
    <div className="container">
      {isDisconnected ? (
        <Row justify={'center'}>
          <Typography>
            To have access to this functionality you must be connected{' '}
          </Typography>
        </Row>
      ) : (
        <>
          <Steps
            labelPlacement="vertical"
            current={step}
            items={[
              {
                title: 'Détails',
                icon: <ProfileOutlined />
              },
              {
                title: 'Submitted !',
                icon: <FileDoneOutlined />
              }
            ]}
          />
          <div className="container-content">
            <Row style={{ height: '50vh' }}>
              <Col xs={24}>
                {step === 0 && (
                  <Form
                    name="form_item_path"
                    layout="vertical"
                    form={form}
                    {...layout}
                  >
                    <Row>
                      <Col xs={24} md={12}>
                        <Item
                          name="brand"
                          label="Brand"
                          rules={[
                            {
                              required: true,
                              message: 'Please fill watch brand !'
                            }
                          ]}
                        >
                          <Select>
                            {WATCH_BRANDS.map((brand) => (
                              <Select.Option key={brand} value={brand}>
                                {brand}
                              </Select.Option>
                            ))}
                          </Select>
                        </Item>
                        <Item
                          name="model"
                          label="Model"
                          rules={[
                            {
                              required: true,
                              message: 'Please fill watch model !'
                            }
                          ]}
                        >
                          <Input />
                        </Item>
                        <Item name="description" label="Description">
                          <Input.TextArea />
                        </Item>
                        <Item
                          name="serial"
                          label="Serial number"
                          rules={[
                            {
                              required: true,
                              message: 'Please fill serial number !'
                            }
                          ]}
                        >
                          <InputNumber />
                        </Item>
                        <Item
                          name="price"
                          label="Selling price"
                          rules={[
                            {
                              required: true,
                              message: 'Please fill selling price !'
                            }
                          ]}
                        >
                          <InputNumber addonAfter="ETH" min={0} />
                        </Item>
                        <Button type="primary" onClick={() => handleNext()}>
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
                {step === 1 && (
                  <Result
                    icon={<SmileOutlined />}
                    title="Great, Certiwatch will contact you shortly !"
                    extra={
                      <Button type="primary" onClick={() => navigate('/')}>
                        Go to Home
                      </Button>
                    }
                  />
                )}
              </Col>
            </Row>
          </div>
        </>
      )}
    </div>
  );
}
