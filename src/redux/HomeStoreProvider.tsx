"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./store";
import { initialAuthState, type AuthState } from "./slices/authSlice";
import { initialUiState } from "./slices/uiSlice";
import LoginModal from "@/components/LoginModal";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setLoginModalOpen } from "@/redux/slices/uiSlice";
import { useRouter } from "next/navigation";

type HomeStoreProviderProps = {
  children: ReactNode;
  authState?: Partial<AuthState>;
  openLoginModal?: boolean;
};

const HomeStoreProvider = ({
  children,
  authState,
  openLoginModal = false,
}: HomeStoreProviderProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const open = useAppSelector((state) => state.ui.loginModalOpen);
  const [store] = useState<AppStore>(() =>
    makeStore({
      auth: { ...initialAuthState, ...authState },
      ui: { ...initialUiState, loginModalOpen: openLoginModal },
    })
  );

  return (
    <Provider store={store}>
      {children}
      <LoginModal
        open={open}
        onClose={() => dispatch(setLoginModalOpen(false))}
        onSuccess={() => {
          dispatch(setLoginModalOpen(false));
          router.refresh(); // re-runs the SSR call with the new login token
        }}
      />
    </Provider>
  );
};

export default HomeStoreProvider;
