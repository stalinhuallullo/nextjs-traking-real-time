import { UiState } from ".";

type UiActionType = { type: string; payload: string };

export const uiReducer = (state: UiState, action: UiActionType): UiState => {
    switch (action.type) {
        case "[UI] - ToggleMenu":
            return {
                ...state,
                isMenu: action.payload,
            };
        case "[UI] - SetMenu":
            return {
                ...state,
                isMenu: action.payload,
            };
        case "[UI] - GetMenu":
            return {
                ...state,
                isMenu: action.payload,
            };

        default:
            return state;
    }
};