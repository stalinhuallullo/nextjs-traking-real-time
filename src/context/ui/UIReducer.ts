import { UiState } from ".";

type UiActionType = { type: string; payload: string };

export const uiReducer = (state: UiState, action: UiActionType): UiState => {
    switch (action.type) {
        case "[UI] - ToggleMenu":
            return {
                ...state,
                isMenu: action.payload,
            };
        case "[UI] - SetLocalStorageRute":
            localStorage.setItem("rute", action.payload)

            return {
                ...state,
                localStorageRute: action.payload,
            };

        default:
            return state;
    }
};