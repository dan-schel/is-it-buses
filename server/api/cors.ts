import cors from "cors";

const domains = ["http://localhost:3000", "https://beta.isitbuses.com"];

export function createCorsMiddleware() {
  return cors({
    origin: (origin, callback) => {
      if (origin == null || domains.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  });
}
