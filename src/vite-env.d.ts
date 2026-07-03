/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOCKAPI_PROJECT_TOKEN: string;
  readonly VITE_MOCKAPI_API_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
