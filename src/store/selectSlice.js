import { createSlice } from '@reduxjs/toolkit';

// 映射关系：中文 → API 使用的值
const MANNER_API_MAP = {
  '一对一匹配': 'individual',
  '数据库查询': 'team',
};

const SPECIES_API_MAP = {
  '人类': 'human',
  '山魈': 'mandrillus',
};

const initialState = {
  manner: ['一对一匹配', '数据库查询'],
  species: {
    '一对一匹配': ['人类', '山魈'],
    '数据库查询': ['人类', '山魈'],
  },
  currentManner: '一对一匹配',
  currentSpecies: '人类',
};

const selectSlice = createSlice({
  name: 'select',
  initialState,
  reducers: {
    setCurrentManner(state, action) {
      state.currentManner = action.payload;
      state.currentSpecies = state.species[action.payload][0];
    },
    setCurrentSpecies(state, action) {
      state.currentSpecies = action.payload;
    },
  },
});

export const { setCurrentManner, setCurrentSpecies } = selectSlice.actions;
export default selectSlice.reducer;

// 导出映射关系供组件使用
export { MANNER_API_MAP, SPECIES_API_MAP };
