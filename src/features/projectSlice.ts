import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectDetails {
  id: string;
  title: string;
  description?: string;
  created?: string;
  updated?: string;
}

interface ProjectState {
  currentProject: ProjectDetails | null;
}

const initialState: ProjectState = {
  currentProject: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject(state, action: PayloadAction<ProjectDetails>) {
      state.currentProject = action.payload;
    },
    clearProject(state) {
      state.currentProject = null;
    },
  },
});

export const { setProject, clearProject } = projectSlice.actions;
export default projectSlice.reducer; 