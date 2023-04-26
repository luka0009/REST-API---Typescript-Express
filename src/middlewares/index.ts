import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["AUTH"];

    if (!sessionToken) {
      return res.status(403).json({ message: "Not Authenticated" });
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(403).json({ message: "User not Authenticated" });
    }

    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(400);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
