import { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Space,
  Button,
  InputNumber,
  Typography,
  Steps
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { reset, update } from '../state/formSlice';
import { add } from '../state/watchesSlice';
import { WATCH_BRANDS } from '../utils';
import { InfoCircleOutlined, SendOutlined } from '@ant-design/icons';

const { Item } = Form;

export default function SellPage() {
  const [fileList, setFileList] = useState([]);
  const [step, setStep] = useState(0);
  const { address, isDisconnected } = useAccount();

  const watches = useSelector((state) => state.watches.watches);
  const sellForm = useSelector((state) => state.sellForm);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const navigate = useNavigate();

  function handlePrevious() {
    setStep(step - 1);
  }
  async function handleNext() {
    if (step == 0) {
      try {
        let validate = await form.validateFields();
        const { errorFields } = validate;
        if (!errorFields) {
          let values = form.getFieldsValue();
          dispatch(update(values));
          setStep(step + 1);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (step == 1) {
      try {
        dispatch(
          add({
            ...sellForm,
            address,
            id: watches.length
          })
        );
        dispatch(reset());
        return navigate('/');
      } catch (error) {
        console.log(error);
      }
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
                icon: <InfoCircleOutlined />
              },
              {
                title: 'Submission',
                icon: <SendOutlined />
              }
            ]}
          />
          <div className="container-content">
            <Row style={{ height: '50vh' }}>
              <Col xs={24}>
                {step == 0 && (
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
                      </Col>
                    </Row>
                  </Form>
                )}
                {step === 1 && (
                  <Row justify="center" style={{ fontSize: 32 }}>
                    <Typography style={{ fontSize: 22, textAlign: 'center' }}>
                      After approval you will receive instructions how send
                      safely and secure your watch to Certiwatch !
                    </Typography>
                  </Row>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={24}>
                <Space>
                  {step !== 0 && (
                    <Button type="primary" onClick={() => handlePrevious()}>
                      Previous
                    </Button>
                  )}
                  <Button type="primary" onClick={() => handleNext()}>
                    {step == 1 ? 'Submit' : 'Next'}
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
        </>
      )}
    </div>
  );
}
