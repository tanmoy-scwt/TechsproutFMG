//To be used in server components so we can avpid using extra serve action for fetch
//To check if fetch request giving a 401 error
export const ClientFetch = async (fullUrl: string, options?: RequestInit) => {
   try {
      const res = await fetch(fullUrl, options);
      return res;
   } catch (error) {
      throw error;
   }
};
