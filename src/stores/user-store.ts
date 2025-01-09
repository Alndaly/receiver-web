// src/stores/counter-store.ts
import { createStore } from 'zustand/vanilla'

export type UserState = {
    userInfo: {
        nickname: string
        email: string
        avatar: string
    }
}

export type UserActions = {
    setUserInfo: (nickname: string, email: string, avatar: string) => void
}

export type UserStore = UserState & UserActions

export const initUserStore = (): UserState => {
    return {
        userInfo: {
            nickname: '',
            email: '',
            avatar: '',
        }
    }
}

export const defaultInitState: UserState = {
    userInfo: {
        nickname: '',
        email: '',
        avatar: '',
    },
}

export const createUserStore = (
    initState: UserState = defaultInitState,
) => {
    return createStore<UserStore>()((set) => ({
        ...initState,
        setUserInfo: (nickname: string, email: string, avatar: string) => set((state) => ({ userInfo: { ...state.userInfo, nickname, email, avatar } })),
    }))
}
