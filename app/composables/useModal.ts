// import { ref } from 'vue'

const isOpen = ref(false)
const content = ref<string>('')

export const useModal = () => {
  const open = (text: string) => {
    content.value = text
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    content.value = ''
  }

  return {
    isOpen,
    content,
    open,
    close,
  }
}