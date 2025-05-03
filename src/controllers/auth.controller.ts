import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await registerUser(email, password);
    res.status(201).json({ user: { id: user.id, email: user.email }, token });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.status(200).json({ user: { id: user.id, email: user.email }, token });
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
};
