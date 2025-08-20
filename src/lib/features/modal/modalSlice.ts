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
  cancelReason?:
    | "too_expensive"
    | "platform_not_helpful"
    | "not_enough_jobs"
    | "decided_not_to_move"
    | "other";
  // Add more answer fields as needed
};

interface User {
  userId: string;
  subscriptionPrice: number;
  subscriptionCurrentPeriodEnd: string;
  userVariant: "A" | "B";
}

interface ModalState {
  isOpen: boolean;
  pageName: string;
  answers: Partial<Answer>;
  user?: User;
}

const initialState: ModalState = {
  isOpen: false,
  pageName: "",
  answers: {},
  user: undefined,
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
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    resetModal(state) {
      state.isOpen = false;
      state.pageName = "";
      state.answers = {};
      state.user = undefined;
    },
  },
});

export const {
  openModal,
  closeModal,
  setPageName,
  setAnswer,
  resetModal,
  setUser,
} = modalSlice.actions;
export default modalSlice.reducer;
