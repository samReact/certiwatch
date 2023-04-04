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
  const { write, isSuccess } = useContractWrite(config);

  // const balance = useContractRead({
  //   address: nftCollectionAddress,
  //   abi: nftCollectionAbi,
  //   functionName: 'balanceOf',
  //   watch: false,
  //   enabled: Boolean(address),
  //   args: [address]
  // });

  // const certificate = useContract({
  //   address: nftCollectionAddress,
  //   abi: nftCollectionAbi,
  //   signerOrProvider: signer
  // });

  // async function getTokenId() {
  // const tokenId = certificate.tokenOfOwnerByIndex(balance.data);
  // }

  // useEffect(() => {
  //   if (balance.data) {
  //     getTokenId();
  //   }
  // }, [balance.data]);
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
            current={isSuccess ? 1 : 0}
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
              <Row style={{ height: '50vh' }}>
                <Col xs={24}>
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
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            )}
          </div>
        </>
      )}
    </div>
  );
}
