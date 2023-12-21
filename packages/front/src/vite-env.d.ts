/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_IS_LOGGED_IN: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}