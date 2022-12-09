const storagePrefix = 'ranking_';

const storage = {
  getToken: () => {
    return JSON.parse(
      window.localStorage.getItem(`${storagePrefix}token`) as string
    );
  },
  setToken: (token: string) => {
    window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },
  clearToken: () => {
    window.localStorage.removeItem(`${storagePrefix}token`);
  },
  existToken: () => {
    const token = window.localStorage.getItem(
      `${storagePrefix}token`
    ) as string;
    if (!token) {
      return false;
    }
    return true;
  },
};

export default storage;
