import { Modal, Upload } from 'antd';
import { useState } from 'react';
import ImgCrop from 'antd-img-crop';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function ImageUploader() {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    console.log(file.preview);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const beforeUpload = (file) => {
    console.log(file.type);
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return false;
  };
  console.log(previewOpen);
  const handleCancel = () => setPreviewOpen(false);
  return (
    <>
      <ImgCrop rotationSlider>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={handlePreview}
          beforeUpload={beforeUpload}
        >
          {fileList.length < 2 && '+ Upload'}
        </Upload>
      </ImgCrop>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
}
