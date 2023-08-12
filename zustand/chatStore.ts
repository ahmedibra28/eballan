import { create } from 'zustand'

export type Chat = {
  _id: string
  createdAt: string
  user: {
    id: string
    name: string
    avatar: string
  }
  audio?: {
    url?: string
    duration?: number
  }
}

type ChatStore = {
  chats: Chat[]
  updateChat: (chat: Chat[]) => void
}

const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  updateChat: (chats: Chat[]) => {
    set((state) => ({
      chats: [...chats, ...state.chats],
    }))
  },
}))

export default useChatStore
