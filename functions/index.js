import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

export const heartbeat = onRequest(async (req, res) => {
  const { kioskId } = req.query;
  if (!kioskId) {
    res.status(400).json({ error: 'kioskId required' });
    return;
  }
  const db = getFirestore();
  await db.collection('kiosks').doc(String(kioskId)).set({
    lastSeen: new Date(),
    ip: req.ip,
  }, { merge: true });
  logger.info('heartbeat', { kioskId });
  res.json({ ok: true });
});


