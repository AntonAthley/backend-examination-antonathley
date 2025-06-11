if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
  process.exit(1);
}

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  lifetime: process.env.JWT_LIFETIME || "1h",
  algorithm: "HS256",
};
