declare global {
  interface Window {
    Telegram?: {
      Login?: {
        init: (opts: { client_id: number; request_access?: string[]; lang?: string }, cb: (data: { id_token?: string; error?: string }) => void) => void;
        open: (cb?: (data: { id_token?: string; error?: string }) => void) => void;
      };
    };
  }
}
export {};
