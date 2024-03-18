import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as https from 'https'; // Import https module directly
import * as path from 'path'; // Import path module directly
import * as fs from 'fs'; // Import fs module directly

// Read the key and cert files synchronously
const key = fs.readFileSync(path.resolve(__dirname, 'key.pem'));
const cert = fs.readFileSync(path.resolve(__dirname, 'cert.pem'));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key, // Pass the key directly
      cert, // Pass the cert directly
    },
    port: 443,
  },
})

