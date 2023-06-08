// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(400).json({
      message: "Only POST",
    });
  const eventKey = process.env.EVENT_KEY;
  const bbeId = process.env.BBE_ID;
  return res.status(200).json({ eventKey, bbeId });
}
