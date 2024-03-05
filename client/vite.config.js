/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
const https=require('https')
const path=require('path')
const fs=require('fs')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    https:{
      key:fs.readFileSync(path.resolve(__dirname,'key.pem')),
      cert:fs.readFileSync(path.resolve(__dirname,'cert.pem'))

    },
    port:5173,
  },
})



*/

/*const app=express()
const sslserver=https.createServer({
  key:fs.readFileSync(path.join(__dirname,'key.pem')),
  cert:fs.readFileSync(path.join(__dirname,'cert.pem'))
},app)

sslserver.listen(5173,()=>console.log('secure server on port 3000')) */



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
    port: 5173,
  },
})

