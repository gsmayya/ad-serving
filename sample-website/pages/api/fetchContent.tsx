import type { NextApiRequest, NextApiResponse } from 'next';

const apiUrl = "http://ad-server:8080";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { time, pagetype, uuid } = req.body as {
    time: string;
    pagetype: string;
    uuid: string;
  };

  console.log('Calling...');
  try {
    const backendRes = await fetch(apiUrl + '/getAd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ time, pagetype, uuid }),
    });

    console.log(backendRes);
    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return res
        .status(backendRes.status)
        .json({ message: 'Backend error', error: errorText });
    }

    const html = await backendRes.text(); // Expecting plain HTML
    return res.status(200).json({ htmlContent: html });
  } catch (error: any) {
    console.error('Error calling backend:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
}