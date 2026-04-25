import React from 'react';
import { Alert, Flex, Spin } from 'antd';
const contentStyle = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};
const content = <div style={contentStyle} />;
const SpinToast = () => (
    <Flex gap="medium" className='absolute top-30 left-full'>
      <Spin description="正在跳转...">{content}</Spin>
    </Flex>
);
export default SpinToast;