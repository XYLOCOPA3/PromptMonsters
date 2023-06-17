// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ERROR_MAINTENANCE } from "@/const/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return res.status(503).json({ message: ERROR_MAINTENANCE });
}
