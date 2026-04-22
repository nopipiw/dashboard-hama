import { authenticate, registerUser } from "../services/auth.service.js";


// Responsibilities: handle auth HTTP requests (login, register)
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authenticate(username, password);
    res.status(200).json({
      message: "Login berhasil",
      user: {
        username: result.user.username,
        role: result.user.role,
      },
      token: result.token,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const loginByRole = (expectedRole) => async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authenticate(username, password);

    if (expectedRole && result.user.role !== expectedRole) {
      return res.status(403).json({ message: `Akses ditolak: hanya ${expectedRole}.` });
    }

    return res.status(200).json({
      message: "Login berhasil",
      user: {
        username: result.user.username,
        role: result.user.role,
      },
      token: result.token,
    });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

export const loginAdmin = loginByRole("admin");
export const loginPetani = loginByRole("petani");

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

