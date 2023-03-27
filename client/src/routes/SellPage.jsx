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
  InputNumber
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

import ImageUploader from '../ImageUploader';
import { update } from '../state/formSlice';
import { decrement, increment, resetStep } from '../state/stepperSlice';
import { add } from '../state/watchesSlice';
import Stepper from '../Stepper';
import { WATCH_BRANDS } from '../utils';

const { Item } = Form;

export default function SellPage() {
  const [fileList, setFileList] = useState([]);
  const { address, isConnecting, isDisconnected } = useAccount();

  const step = useSelector((state) => state.stepper.value);
  const sellForm = useSelector((state) => state.sellForm);
  const watches = useSelector((state) => state.watches.watches);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const navigate = useNavigate();

  function handlePrevious() {
    dispatch(decrement());
  }
  async function handleNext() {
    if (step == 0) {
      try {
        let validate = await form.validateFields();
        const { errorFields } = validate;
        if (!errorFields) {
          let values = form.getFieldsValue();
          let formattedYear = values.year
            .toISOString()
            .slice(0, 5)
            .replace(/-/g, '');
          values.year = formattedYear;
          dispatch(update(values));
          dispatch(increment());
        }
      } catch (error) {
        console.log(error);
      }
    } else if (step == 1) {
      const toto = fileList.map((elt) => elt.thumbUrl);
      dispatch(update({ photos: toto }));
      dispatch(increment());
    } else if (step == 2) {
      try {
        dispatch(
          add({
            ...sellForm,
            address,
            id: watches.length
          })
        );
        dispatch(resetStep());
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
      <Stepper step={step} />

      {isDisconnected ? (
        <div>Please connect your wallet</div>
      ) : (
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
                        <DatePicker picker="year" />
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
                        name="price"
                        label="Selling price"
                        rules={[
                          {
                            required: true,
                            message: 'Please fill selling price !'
                          }
                        ]}
                      >
                        <InputNumber />
                      </Item>
                      <Form.Item name="description" label="Description">
                        <Input.TextArea />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              )}
              {step === 1 && (
                <ImageUploader fileList={fileList} setFileList={setFileList} />
              )}
              {step === 2 && <div>Are you sure ?</div>}
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
                  disabled={step == 1 && fileList.length < 3}
                >
                  {step == 2 ? 'Submit' : 'Next'}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
