import React, { useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';
import { QRCode } from 'antd';
// import cert from './assets/nft.jpg';

const ToPng = () => {
  const ref = useRef(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = './my-image-name.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  return (
    <>
      <div
        // ref={ref}
        style={{
          background: 'url(./nft_template.png) no-repeat',
          height: 600,
          width: 600,
          backgroundColor: 'red'
        }}
      >
        <h3 style={{ left: 220, top: 138, position: 'relative' }}>
          <b>931293129-3232</b>
        </h3>
        <QRCode
          value="https://ant.design/"
          style={{ left: 30, top: 330, position: 'relative' }}
        />
        {/* <img src={cert} alt="" srcset="" /> */}
      </div>
      <button onClick={onButtonClick}>Click me</button>
    </>
  );
};

export default ToPng;
