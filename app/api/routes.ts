import { NextApiRequest, NextApiResponse } from 'next';

// Health check API route
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}