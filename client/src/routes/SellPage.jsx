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
  Result,
  Card,
  Space
} from 'antd';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import {
  FileDoneOutlined,
  ProfileOutlined,
  SmileOutlined
} from '@ant-design/icons';

import { WATCH_BRANDS } from '../utils';
import { addNotification } from '../state/notificationSlice';
import { ethers } from 'ethers';

const { Item } = Form;

export default function SellPage() {
  const { isDisconnected } = useAccount();
  const { marketplaceAbi, marketplaceAddress } = useSelector(
    (state) => state.eth
  );

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const brand = Form.useWatch('brand', form);
  const model = Form.useWatch('model', form);
  const description = Form.useWatch('description', form);
  const serial = Form.useWatch('serial', form);
  let price = Form.useWatch('price', form);

  const navigate = useNavigate();
  const { config } = usePrepareContractWrite({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'addItem',
    enabled:
      Boolean(brand) &&
      Boolean(description) &&
      Boolean(model) &&
      Boolean(price),
    args: [
      brand,
      model,
      description,
      serial,
      price && ethers.utils.parseEther(price.toString())
    ]
  });
  const { write, isSuccess } = useContractWrite({
    ...config,
    onError(error) {
      dispatch(
        addNotification({
          message: 'Error',
          description: error.message,
          type: 'error'
        })
      );
    }
  });

  async function handleNext() {
    try {
      let validate = await form.validateFields();
      const { errorFields } = validate;
      if (!errorFields) {
        write();
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
  }

  const layout = {
    wrapperCol: {
      span: 24
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
            current={isSuccess ? 1 : 0}
            items={[
              {
                title: 'Details',
                icon: <ProfileOutlined className="step-icon" />
              },
              {
                title: 'Submitted !',
                icon: <FileDoneOutlined className="step-icon" />
              }
            ]}
          />
          <div className="container-content">
            {isSuccess ? (
              <Result
                icon={<SmileOutlined className="success-icon" />}
                title="Great, Certiwatch will contact you shortly !"
                extra={
                  <Button type="primary" onClick={() => navigate('/')}>
                    Go to Home
                  </Button>
                }
              />
            ) : (
              <>
                <Row gutter={[58, 24]}>
                  <Col sm={24} md={12}>
                    <Form
                      name="form_item_path"
                      layout="vertical"
                      form={form}
                      {...layout}
                    >
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
                      <Item
                        name="description"
                        label="Description"
                        rules={[
                          {
                            required: true,
                            message: 'Please fill description !'
                          }
                        ]}
                      >
                        <Input.TextArea maxLength={80} showCount />
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
                        <Input />
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
                      <Button
                        type="primary"
                        onClick={() => handleNext()}
                        disabled={!write}
                      >
                        Submit
                      </Button>
                    </Form>
                  </Col>
                  <Col sm={24} md={12}>
                    <Card className="info-card">
                      <Space direction="vertical">
                        <Typography.Title level={3} italic>
                          Hi Certilovers !
                        </Typography.Title>
                        <Typography.Text italic type="secondary">
                          Please here indicate your watch details, once approved
                          by us our logistic team will collect your watch at
                          home for expertise, once done you will be able to mint
                          your certificate and publish your add !
                        </Typography.Text>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
