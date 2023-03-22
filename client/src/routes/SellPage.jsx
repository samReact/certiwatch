import { Form, Input, Select, Row, Col, DatePicker, Space, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../ImageUploader';
import { update } from '../state/formSlice';
import { decrement, increment } from '../state/stepperSlice';
import Stepper from '../Stepper';
import ToPng from '../ToPng';
import { WATCH_BRANDS } from '../utils';

const { Item } = Form;

export default function SellPage() {
  const step = useSelector((state) => state.stepper.value);
  const sellForm = useSelector((state) => state.sellForm);
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
      dispatch(increment());
    } else if (step == 2) {
      return navigate('/');
    }
  }
  console.log(step);
  return (
    <div className="container">
      <Stepper step={step} />
      <div className="container-content">
        <Row style={{ height: '40vh' }}>
          <Col xs={8}>
            {step == 0 && (
              <Form name="form_item_path" layout="vertical" form={form}>
                <Item
                  name="brand"
                  label="Brand"
                  rules={[
                    { required: true, message: 'Please fill watch brand !' }
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
                    { required: true, message: 'Please fill watch model !' }
                  ]}
                >
                  <Input />
                </Item>
                <Item
                  name="year"
                  label="Year"
                  rules={[
                    { required: true, message: 'Please fill watch year !' }
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
              </Form>
            )}
            {step === 1 && <ImageUploader />}
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
              <Button type="primary" onClick={() => handleNext()}>
                {step == 2 ? 'Submit' : 'Next'}
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
      {/* <ToPng /> */}
    </div>
  );
}
