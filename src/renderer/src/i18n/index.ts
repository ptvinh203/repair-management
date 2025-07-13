import { createI18n } from 'vue-i18n'
import vi from './locales/vi.json'

const messages = {
  vi
}

const i18n = createI18n({
  legacy: false,
  locale: 'vi',
  fallbackLocale: 'vi',
  messages
})

export default i18n
