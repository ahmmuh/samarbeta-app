import jwt from "jsonwebtoken";

export const getToken = (req, res, next) => {
  const token = req.cookies.token;

  console.log("Called getToken när jag använder api/apartments");
  console.log("Token i cookies: api/apartments", req.cookies.token);
  if (!token)
    return res.status(401).json({ message: "Åtkomst nekad. Ingen token" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Ogiltig token" });
  }
};
