import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedProjectId: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedProjectId: (state, action) => {
      state.selectedProjectId = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selectedProjectId = null;
    },
  },
});

export const { setSelectedProjectId, clearSelectedProject } = dashboardSlice.actions;
export default dashboardSlice.reducer;
