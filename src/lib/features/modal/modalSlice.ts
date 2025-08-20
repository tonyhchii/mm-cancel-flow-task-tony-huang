import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Answer = {
  foundJob?: boolean;
  foundViaMM?: boolean;
  rolesApplied?: "0" | "1-5" | "6-20" | "20+";
  emailedDirectly?: "0" | "1-5" | "6-20" | "20+";
  interviews?: "0" | "1-2" | "3-5" | "5+";
  foundFeedback?: string;
  visaLawyerProvided?: boolean;
  visaType?: string;
  downsellAccepted?: boolean;
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
