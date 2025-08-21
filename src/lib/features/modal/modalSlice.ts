import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

type Cancellation = {
  id: string;
  subscription_id: string;
  downsell_variant: "A" | "B";
  status: "in_progress" | "submitted";
  session_id: string;
  created_at: string;
  updated_at: string;
};

export const startCancellation = createAsyncThunk<
  Cancellation, // return type
  void, // args (none — we read from state)
  { state: RootState }
>("modal/startCancellation", async (_arg, { getState, rejectWithValue }) => {
  const { modal } = getState();
  const user = modal.user; // { userId, ... }
  const subscriptionId = modal.subscription?.id; // wherever you keep it

  // If you don’t have subscriptionId in state, you can change your API to fetch it server-side
  if (!user?.userId || !subscriptionId) {
    return rejectWithValue("Missing userId or subscriptionId") as never;
  }

  const res = await fetch("/api/cancellation/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.userId, subscriptionId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return rejectWithValue(
      err?.error ?? "Failed to start cancellation"
    ) as never;
  }
  const json = await res.json();
  return json.cancellation as Cancellation;
});

export const updateCancellationAnswers = createAsyncThunk<
  Cancellation,
  { answers: Partial<Answer> },
  { state: RootState }
>("modal/updateCancellationAnswers", async ({ answers }, { getState }) => {
  const { modal } = getState();
  if (!modal.cancellationId) throw new Error("No cancellation in progress");
  const res = await fetch("/api/cancellation/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cancellationId: modal.cancellationId,
      answers: answers,
    }),
  });
  const json = await res.json();
  return json.cancellation as Cancellation;
});

export const acceptDownsell = createAsyncThunk<
  Cancellation,
  void,
  { state: RootState }
>("modal/acceptDownsell", async (_arg, { getState }) => {
  const { modal } = getState();
  if (!modal.cancellationId) throw new Error("No cancellation in progress");

  const res = await fetch("/api/cancellation/accept-downsell", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cancellationId: modal.cancellationId }),
  });
  const json = await res.json();
  return json.cancellation as Cancellation;
});

export const completeCancellation = createAsyncThunk<
  Cancellation,
  void,
  { state: RootState }
>("modal/completeCancellation", async (_arg, { getState }) => {
  const { modal } = getState();
  if (!modal.cancellationId) throw new Error("No cancellation in progress");

  const res = await fetch("/api/cancellation/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cancellationId: modal.cancellationId }),
  });
  const json = await res.json();
  return json.cancellation as Cancellation;
});

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

interface Subscript {
  id: string;
  user_id: string;
  status: "active" | "canceled" | "pending_cancellation";
}

interface ModalState {
  cancellationId: string;
  isOpen: boolean;
  pageName: string;
  answers: Partial<Answer>;
  user: User;
  subscription?: Subscript;
  history?: Array<{ pageName: string }>;
}

const initialState: ModalState = {
  cancellationId: "",
  isOpen: false,
  pageName: "",
  answers: {},
  user: {
    userId: "",
    subscriptionPrice: 0,
    subscriptionCurrentPeriodEnd: "",
    userVariant: "A",
  },
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
    setSubscription(state, action: PayloadAction<Subscript>) {
      state.subscription = action.payload;
    },
    resetModal(state) {
      state.isOpen = false;
      state.pageName = "";
      state.answers = {};
      state.user = {
        userId: "",
        subscriptionPrice: 0,
        subscriptionCurrentPeriodEnd: "",
        userVariant: "A",
      };
    },
  },
  extraReducers: (b) => {
    b.addCase(startCancellation.pending, (s) => {});
    b.addCase(startCancellation.fulfilled, (s, a) => {
      s.cancellationId = a.payload.id;
      s.pageName = "screenOne";
      s.isOpen = true;
      s.user.userVariant = a.payload.downsell_variant;
    });
    b.addCase(startCancellation.rejected, (s, a) => {});
  },
});

export const {
  openModal,
  closeModal,
  setPageName,
  setAnswer,
  resetModal,
  setUser,
  setSubscription,
} = modalSlice.actions;
export default modalSlice.reducer;
