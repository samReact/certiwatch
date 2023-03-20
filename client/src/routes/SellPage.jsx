import { Form, Input, Button, Select, Row, Col } from 'antd';
import React from 'react';
import Stepper from '../Stepper';

const { Item } = Form;

export default function SellPage() {
  return (
    <div className="container">
      <Stepper />
      <div className="container-content">
        <Row>
          <Col xs={24} md={12}>
            <Form name="form_item_path" layout="vertical">
              <Item name="brand" label="Marque">
                <Select>
                  <Select.Option value="demo">Demo</Select.Option>
                </Select>
              </Item>
              <Item name="model" label="Modèle">
                <Input />
              </Item>
              <Item name="year" label="Année">
                <Input />
              </Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
}
