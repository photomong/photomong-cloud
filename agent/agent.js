import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import chokidar from 'chokidar';
import fs from 'fs';
import os from 'os';
import path from 'path';

const cfg = JSON.parse(fs.readFileSync(new URL('./agent.config.json', import.meta.url)));

const app = initializeApp(cfg.firebase);
const auth = getAuth(app);
const db = getFirestore(app);
const st = getStorage(app);

async function heartbeat() {
  await setDoc(doc(db, 'kiosks', cfg.kioskId), {
    lastSeen: serverTimestamp(),
    version: cfg.version || 'unknown',
    hostname: os.hostname()
  }, { merge: true });
}

async function run() {
  await signInWithEmailAndPassword(auth, cfg.email, cfg.password);
  await heartbeat();
  setInterval(heartbeat, 60 * 1000);

  const watcher = chokidar.watch(cfg.watchDir, { ignoreInitial: true, depth: 0 });
  watcher.on('add', async (filePath) => {
    try {
      const buffer = fs.readFileSync(filePath);
      const key = `kiosks/${cfg.kioskId}/captures/${Date.now()}_${path.basename(filePath)}`;
      await uploadBytes(ref(st, key), buffer, { contentType: 'image/jpeg' });
      console.log('Uploaded', key);
    } catch (e) {
      console.error('Upload error', e);
    }
  });
}

run().catch((e) => { console.error(e); process.exit(1); });


