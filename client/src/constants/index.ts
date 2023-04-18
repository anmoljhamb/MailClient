const currentUrl = window.location.href;
const exp = new RegExp(/https?:\/\/([a-zA-Z0-9.]+):[0-9]+/);
export const BACKEND_URI = `http://${exp.exec(currentUrl)![1]}:8080`;
