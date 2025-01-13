// src/stores/counter-store.ts
import { getMyInfo } from '@/service/user';
import { toast } from 'sonner';
import { createStore } from 'zustand/vanilla'

export type UserInfo = {
    nickname: string;
    avatar: string;
    enable_notify: boolean;
    phone_info?: {
        phone: string
    }
    google_info?: {
        google_id: string
    }
    github_info?: {
        github_id: string
    }
    email_info?: {
        email: string
        has_password: boolean
    }
}

export type UserState = {
    userInfo: UserInfo
}

export type UserActions = {
    setUserInfo: (userInfo: UserInfo) => void
    refreshUserInfo: () => Promise<void>
}

export type UserStore = UserState & UserActions

export const initUserStore = (): UserState => {
    return {
        userInfo: {
            nickname: '',
            avatar: '',
            enable_notify: true,
        }
    }
}

export const defaultInitState: UserState = {
    userInfo: {
        nickname: '',
        avatar: '',
        enable_notify: true,
    },
}

export const createUserStore = (
    initState: UserState = defaultInitState,
) => {
    return createStore<UserStore>()((set) => ({
        ...initState,
        setUserInfo: (userInfo: UserInfo) => set((state) => ({ userInfo: { ...state.userInfo, ...userInfo } })),
        refreshUserInfo: async () => {
            const [res, err] = await getMyInfo()
            if (err) {
                toast.error(err.message)
                return
            }
            set((state) => ({ userInfo: { ...state.userInfo, ...res } }))
        }
    }))
}
