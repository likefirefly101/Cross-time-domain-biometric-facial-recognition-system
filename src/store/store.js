import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import analyzeReducer from "./analyzeSlice";
import selectReducer from "./selectSlice";

const ANALYZE_STATE_KEY = 'facial_recognition_analyze_state';

const loadPersistedAnalyzeState = () => {
    try {
        const serializedState = sessionStorage.getItem(ANALYZE_STATE_KEY);
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (error) {
        console.warn('Failed to restore analyze state:', error);
        return undefined;
    }
};

const savePersistedAnalyzeState = (analyzeState) => {
    try {
        sessionStorage.setItem(ANALYZE_STATE_KEY, JSON.stringify(analyzeState));
    } catch (error) {
        console.warn('Failed to persist analyze state:', error);
    }
};

const persistedAnalyzeState = loadPersistedAnalyzeState();

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        analyze: analyzeReducer,
        select: selectReducer,
    },
    preloadedState: persistedAnalyzeState
        ? {
            analyze: persistedAnalyzeState,
        }
        : undefined,
});

let previousAnalyzeState = store.getState().analyze;

store.subscribe(() => {
    const currentAnalyzeState = store.getState().analyze;

    if (currentAnalyzeState === previousAnalyzeState) {
        return;
    }

    previousAnalyzeState = currentAnalyzeState;
    savePersistedAnalyzeState(currentAnalyzeState);
});

export default store;