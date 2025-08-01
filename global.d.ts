export {};

declare global {
  interface Window {
    electron: {
      getSummonerData: (username: string) => Promise<any>;
    };
  }
}