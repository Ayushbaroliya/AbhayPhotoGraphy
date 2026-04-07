import jwt from 'jsonwebtoken';

export const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
  } catch (err) {
    return null;
  }
};

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  console.log(`[AUTH] Incoming ${req.method} request`);

  // Handle Token Verification (GET)
  if (req.method === 'GET') {
    const user = verifyToken(req);
    if (user) {
      return res.status(200).json({ success: true, message: 'Token is valid', user });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log('[AUTH] Login attempt with password:', password ? '****' : 'EMPTY');
    console.log('[AUTH] Admin password configured?', adminPassword ? 'YES' : 'NO');

    if (!adminPassword) {
      console.error('[AUTH] ERROR: ADMIN_PASSWORD is not defined in environment');
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    if (password === adminPassword) {
      const token = jwt.sign(
        { role: 'admin' }, 
        process.env.JWT_SECRET || 'fallback_secret', 
        { expiresIn: '24h' }
      );
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
