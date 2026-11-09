import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import {
  VAlert,
  VApp,
  VAppBar,
  VBtn,
  VBtnToggle,
  VCard,
  VCardActions,
  VCardText,
  VCheckbox,
  VChip,
  VCol,
  VContainer,
  VDataTable,
  VDialog,
  VDivider,
  VFileInput,
  VIcon,
  VImg,
  VList,
  VListItem,
  VMain,
  VMenu,
  VProgressLinear,
  VRow,
  VSelect,
  VSpacer,
  VTab,
  VTabs,
  VTextarea,
  VTextField,
} from 'vuetify/components'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import './styles.css'
import App from './App.vue'
import router from './router/index.js'

const vuetify = createVuetify({
  components: {
    VAlert,
    VApp,
    VAppBar,
    VBtn,
    VBtnToggle,
    VCard,
    VCardActions,
    VCardText,
    VCheckbox,
    VChip,
    VCol,
    VContainer,
    VDataTable,
    VDialog,
    VDivider,
    VFileInput,
    VIcon,
    VImg,
    VList,
    VListItem,
    VMain,
    VMenu,
    VProgressLinear,
    VRow,
    VSelect,
    VSpacer,
    VTab,
    VTabs,
    VTextarea,
    VTextField,
  },
  defaults: {
    VBtn: { rounded: 'lg', elevation: 0 },
    VCard: { rounded: 'xl', elevation: 0 },
    VTextField: { variant: 'outlined', density: 'comfortable' },
    VSelect: { variant: 'outlined', density: 'comfortable' },
    VTextarea: { variant: 'outlined', density: 'comfortable' },
  },
  theme: {
    defaultTheme: 'democraft',
    themes: {
      democraft: {
        dark: false,
        colors: {
          primary: '#175B48',
          secondary: '#D4E9DF',
          background: '#F6F7F3',
          surface: '#FFFFFF',
          error: '#B42318',
          'on-background': '#1B3029',
        },
      },
    },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
