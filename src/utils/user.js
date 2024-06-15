export function saveInfoToLocalStorage(user) {
  if (!user) return localStorage.removeItem("user");

  let dataSave = JSON.stringify(user);
  dataSave = btoa(dataSave);
  localStorage.setItem("user", dataSave);
}

export function getInfoToLocalStorage() {
  const dataGet = localStorage.getItem("user");
  if (!dataGet) return null;
  return JSON.parse(atob(dataGet));
}
