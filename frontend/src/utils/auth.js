export const getToken = () => sessionStorage.getItem("token");
export const setToken = (token) => sessionStorage.setItem("token", token);
export const removeToken = () => sessionStorage.removeItem("token");
export const getUser = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
export const setUser = (user) => sessionStorage.setItem("user", JSON.stringify(user));
export const removeUser = () => sessionStorage.removeItem("user");
export const isLoggedIn = () => !!getToken();
export const logout = () => {
  removeToken();
  removeUser();
};