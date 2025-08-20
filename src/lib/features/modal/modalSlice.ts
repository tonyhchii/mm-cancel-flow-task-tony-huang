import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Answer = {
  foundJob?: boolean;
  foundJobMM?: boolean;
  // Add more answer fields as needed
};

interface ModalState {
  isOpen: boolean;
  pageName: string;
  answers: Partial<Answer>;
}

const initialState: ModalState = {
  isOpen: false,
  pageName: "",
  answers: {},
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal(state) {
      state.isOpen = true;
    },
    closeModal(state) {
      state.isOpen = false;
    },
    setPageName(state, action: PayloadAction<string>) {
      state.pageName = action.payload;
    },
    setAnswer(state, action: PayloadAction<Partial<Answer>>) {
      state.answers = { ...state.answers, ...action.payload };
    },
    resetModal(state) {
      state.isOpen = false;
      state.pageName = "";
      state.answers = {};
    },
  },
});

export const { openModal, closeModal, setPageName, setAnswer, resetModal } =
  modalSlice.actions;
export default modalSlice.reducer;
