import { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Space,
  Button,
  Typography,
  Result
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import axios from 'axios';

import ImageUploader from '../ImageUploader';
import { decrement, increment } from '../state/stepperSlice';
import { update } from '../state/watchesSlice';
import Stepper from '../Stepper';
import {
  BRACELET_MATERIAL,
  CASE_MATERIAL,
  GENDER,
  WATCH_BRANDS,
  WATCH_MOVEMENTS
} from '../utils';
import { addNotification } from '../state/notificationSlice';
import { SmileOutlined } from '@ant-design/icons';

const { Item } = Form;

export default function ExpertForm() {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isDisconnected } = useAccount();
  const { id } = useParams();

  const step = useSelector((state) => state.stepper.value);
  const watches = useSelector((state) => state.watches.watches);
  const watch = watches.filter((watch) => watch.id === parseInt(id))[0];

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const navigate = useNavigate();

  function handlePrevious() {
    if (step !== 0) {
      dispatch(decrement());
    }
  }
  async function handleNext() {
    let values = form.getFieldsValue();
    if (step === 0) {
      try {
        let validate = await form.validateFields();
        const { errorFields } = validate;
        if (!errorFields) {
          let formattedYear = values.year
            .toISOString()
            .slice(0, 5)
            .replace(/-/g, '');
          values.year = formattedYear;
          dispatch(update({ ...watch, ...values }));
          dispatch(increment());
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
      setLoading(true);
      const photos = fileList.map((elt) => elt.thumbUrl);
      const {
        brand,
        model,
        gender,
        year,
        serial,
        watch_case,
        bracelet,
        movement,
        color
      } = watch;
      try {
        const res = await axios.post('/api/uploadIpfs', {
          brand,
          model,
          gender,
          year,
          serial,
          watch_case,
          bracelet,
          movement,
          color
        });
        const data = await res.data;

        dispatch(
          update({ ...watch, ipfsHash: data.IpfsHash, photos, certified: true })
        );
        dispatch(increment());
        setLoading(false);
      } catch (error) {
        dispatch(
          addNotification({
            message: 'Error',
            description: error.message,
            type: 'error'
          })
        );
        setLoading(false);
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
          <Stepper step={step} />
          <div className="container-content">
            <Row style={{ height: '50vh' }}>
              <Col xs={24}>
                {step === 0 && (
                  <Form
                    name="form_item_path"
                    layout="vertical"
                    form={form}
                    {...layout}
                    initialValues={{
                      brand: watch.brand,
                      model: watch.model,
                      serial: watch.serial
                    }}
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
                        <Item
                          name="gender"
                          label="Gender"
                          rules={[
                            {
                              required: true,
                              message: 'Please fill gender !'
                            }
                          ]}
                        >
                          <Select>
                            {GENDER.map((gender) => (
                              <Select.Option key={gender} value={gender}>
                                {gender}
                              </Select.Option>
                            ))}
                          </Select>
                        </Item>
                        <Item
                          name="year"
                          label="Year"
                          rules={[
                            {
                              required: true,
                              message: 'Please fill watch year !'
                            }
                          ]}
                        >
                          <DatePicker
                            picker="year"
                            disabledDate={(current) => current > Date.now()}
                          />
                        </Item>
                        <Item
                          name="serial"
                          label="Serial No"
                          rules={[
                            {
                              required: true,
                              message: 'Please fill watch serial number !'
                            }
                          ]}
                        >
                          <Input />
                        </Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Item
                          name="watch_case"
                          label="Case material"
                          rules={[
                            {
                              required: true,
                              message: 'Please fill case material !'
                            }
                          ]}
                        >
                          <Select>
                            {CASE_MATERIAL.map((material) => (
                              <Select.Option key={material} value={material}>
                                {material}
                              </Select.Option>
                            ))}
                          </Select>
                        </Item>
                        <Item
                          name="bracelet"
                          label="Bracelet material"
                          rules={[
                            {
                              required: true,
                              message: 'Please fill bracelet material !'
                            }
                          ]}
                        >
                          <Select>
                            {BRACELET_MATERIAL.map((material) => (
                              <Select.Option key={material} value={material}>
                                {material}
                              </Select.Option>
                            ))}
                          </Select>
                        </Item>
                        <Item
                          name="movement"
                          label="Movement"
                          rules={[
                            {
                              required: true,
                              message: 'Please fill watch movement !'
                            }
                          ]}
                        >
                          <Select>
                            {WATCH_MOVEMENTS.map((movement) => (
                              <Select.Option key={movement} value={movement}>
                                {movement}
                              </Select.Option>
                            ))}
                          </Select>
                        </Item>
                        <Item
                          name="color"
                          label="Color"
                          rules={[
                            {
                              required: true,
                              message: 'Please fill watch color !'
                            }
                          ]}
                        >
                          <Input />
                        </Item>
                      </Col>
                    </Row>
                  </Form>
                )}
                {step === 1 && (
                  <ImageUploader
                    fileList={fileList}
                    setFileList={setFileList}
                  />
                )}
                {step === 2 && (
                  <Result
                    icon={<SmileOutlined />}
                    title="Watch has been certified !"
                    extra={
                      <Button
                        type="primary"
                        onClick={() => navigate('/expert')}
                      >
                        Go to Dashboard
                      </Button>
                    }
                  />
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
                  <Button
                    type="primary"
                    onClick={() => handleNext()}
                    disabled={step === 1 && fileList.length < 3}
                    loading={loading}
                  >
                    {step === 1 ? 'Submit' : 'Next'}
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
