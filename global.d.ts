import da from './messages/da.json';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof da;
  }
}
