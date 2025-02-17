export function Endpoint(type = "prod") {
  return type == "dev"
    ? "http://127.0.0.1:8000/"
    : "http://51.38.99.75:2001/";
}
