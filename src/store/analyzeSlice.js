import { createSlice } from "@reduxjs/toolkit";

const analyzeSlice = createSlice({
  name: "analyze",
  initialState: {
    individualResult: null,
    teamResult: null,
    individualUploads: null,
    teamUpload: null,
    lastMode: null,
  },
  reducers: {
    setIndividualResult(state, action) {
      state.individualResult = action.payload;
      state.lastMode = "individual";
    },
    setTeamResult(state, action) {
      state.teamResult = action.payload;
      state.lastMode = "team";
    },
    setIndividualUploads(state, action) {
      state.individualUploads = action.payload;
      state.lastMode = "individual";
    },
    setTeamUpload(state, action) {
      state.teamUpload = action.payload;
      state.lastMode = "team";
    },
    clearAnalyzeResult(state) {
      state.individualResult = null;
      state.teamResult = null;
      state.individualUploads = null;
      state.teamUpload = null;
      state.lastMode = null;
    },
  }
});

export const {
  setIndividualResult,
  setTeamResult,
  setIndividualUploads,
  setTeamUpload,
  clearAnalyzeResult,
} = analyzeSlice.actions;
export default analyzeSlice.reducer;