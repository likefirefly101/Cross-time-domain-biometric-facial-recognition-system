import React from 'react';
import { Select, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentManner, setCurrentSpecies } from '../../store/selectSlice';

const ModalSelect = () => {
  const dispatch = useDispatch();
  const { manner, species, currentManner, currentSpecies } = useSelector(
    state => state.select
  );

  const handleFirstChange = value => {
    dispatch(setCurrentManner(value));
  };
  const onSecondChange = value => {
    dispatch(setCurrentSpecies(value));
  };
  return (
    <Space wrap className='absolute left-15 top-5'>
      <span>方式：</span>
      <Select
        value={currentManner}
        style={{ width: 120 }}
        onChange={handleFirstChange}
        options={manner.map(item => ({ label: item, value: item }))}
      />
      <span>物种：</span>
      <Select
        style={{ width: 120 }}
        value={currentSpecies}
        onChange={onSecondChange}
        options={species[currentManner].map(item => ({ label: item, value: item }))}
      />
    </Space>
  );
};
export default ModalSelect;