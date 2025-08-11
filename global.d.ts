export {};

declare global {
  interface Window {
    electron: {
      getSummonerData: (username: string, region: string) => Promise<any>;
    };
  }
}