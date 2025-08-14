import jwt from "jsonwebtoken";

export const getToken = (req, res, next) => {
  console.log("Cookies in getToken:", req.cookies);
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({
      success: false,
      error: "Autentisering krävs",
      message: "Du är inte inloggad. Logga in för att fortsätta.",
    });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Ogiltig token" });
  }
};
