import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto'
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const password = process.env.SITE_PASSWORD
if (!password || password.length < 16) {
  throw new Error('SITE_PASSWORD must be set to a shared password of at least 16 characters.')
}

const outputDir = fileURLToPath(new URL('./dist/', import.meta.url))
const iterations = 250000

async function htmlFiles(directory) {
  const results = []
  for (const name of await readdir(directory)) {
    const path = join(directory, name)
    const details = await stat(path)
    if (details.isDirectory() && name !== 'server' && name !== '.openai') results.push(...await htmlFiles(path))
    if (details.isFile() && name.endsWith('.html')) results.push(path)
  }
  return results
}

function encrypt(source) {
  const salt = randomBytes(16)
  const iv = randomBytes(12)
  const key = pbkdf2Sync(password, salt, iterations, 32, 'sha256')
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(source, 'utf8'), cipher.final(), cipher.getAuthTag()])
  return { salt: salt.toString('base64'), iv: iv.toString('base64'), ciphertext: ciphertext.toString('base64') }
}

function protectedPage(payload) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta name="theme-color" content="#260745">
  <title>Private Vsimple Agent Experience</title>
  <link rel="icon" href="/favicon-light.png" media="(prefers-color-scheme: dark)">
  <link rel="icon" href="/favicon-dark.png" media="(prefers-color-scheme: light)">
  <style>
    @font-face{font-family:Origin;src:url('/brand/fonts/origin-display-medium.woff') format('woff');font-weight:500;font-display:swap}
    @font-face{font-family:Instrument;src:url('/brand/fonts/instrument-sans-variable.ttf') format('truetype');font-weight:100 900;font-display:swap}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:28px;background:radial-gradient(circle at 78% 12%,rgba(153,57,235,.3),transparent 25%),#260745;color:#221b2a;font-family:Instrument,Arial,sans-serif}.gate{width:min(100%,460px);padding:38px;border-radius:14px;background:#fffefa;box-shadow:0 30px 90px rgba(0,0,0,.32)}.gate img{display:block;width:138px;height:auto;margin-bottom:42px}.eyebrow{display:block;color:#9939eb;font-size:11px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.eyebrow:before{content:"";display:inline-block;width:18px;height:2px;margin:0 8px 3px 0;background:#ff675f}.gate h1{margin:12px 0 13px;font-family:Origin,Instrument,sans-serif;font-size:42px;font-weight:500;line-height:1;letter-spacing:-.04em}.gate p{margin:0 0 25px;color:#6e6672;line-height:1.55}.gate label{display:grid;gap:7px;font-size:13px;font-weight:800;color:#554b59}.gate input{width:100%;height:51px;padding:0 13px;border:1px solid #cfc6d3;border-radius:6px;background:white;font:inherit;outline:none}.gate input:focus{border-color:#9939eb;box-shadow:0 0 0 3px rgba(153,57,235,.14)}.gate button{width:100%;min-height:52px;margin-top:13px;border:1px solid #260745;border-radius:6px;background:#260745;color:white;font:inherit;font-weight:800;cursor:pointer}.gate button:disabled{opacity:.6;cursor:wait}.status{min-height:22px;margin:13px 0 0!important;color:#a13731!important;font-size:13px}.privacy{margin:26px 0 0!important;padding-top:20px;border-top:1px solid #ded7e2;font-size:12px}@media(max-width:520px){.gate{padding:28px}.gate h1{font-size:36px}.gate img{margin-bottom:34px}}
  </style>
</head>
<body>
  <main class="gate">
    <img src="/brand/vsimple-logo.svg" alt="Vsimple">
    <span class="eyebrow">Private agent experience</span>
    <h1>Enter the shared password.</h1>
    <p>This Vsimple manufacturing experience is intended for invited prospects and partners.</p>
    <form id="unlockForm">
      <label>Password<input id="sitePassword" type="password" autocomplete="current-password" required autofocus></label>
      <button id="unlockButton" type="submit">View the agent experience →</button>
      <p class="status" id="unlockStatus" role="status" aria-live="polite"></p>
    </form>
    <p class="privacy">The password is used in this browser tab to decrypt the experience. It is never sent to the website.</p>
  </main>
  <script>
    const payload=${JSON.stringify(payload)};
    const storageKey='vsimple-agent-access';
    const bytes=value=>Uint8Array.from(atob(value),character=>character.charCodeAt(0));
    async function unlock(password,remember=true){
      const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
      const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(payload.salt),iterations:${iterations},hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
      const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(payload.iv),tagLength:128},key,bytes(payload.ciphertext));
      if(remember)sessionStorage.setItem(storageKey,password);
      document.open();document.write(new TextDecoder().decode(plain));document.close();
    }
    const form=document.querySelector('#unlockForm'),input=document.querySelector('#sitePassword'),button=document.querySelector('#unlockButton'),status=document.querySelector('#unlockStatus');
    form.addEventListener('submit',async event=>{event.preventDefault();button.disabled=true;button.textContent='Unlocking…';status.textContent='';try{await unlock(input.value)}catch{status.textContent='That password did not work. Please try again.';input.select();button.disabled=false;button.textContent='View the agent experience →'}});
    const saved=sessionStorage.getItem(storageKey);if(saved){button.disabled=true;button.textContent='Unlocking…';unlock(saved,false).catch(()=>{sessionStorage.removeItem(storageKey);button.disabled=false;button.textContent='View the agent experience →'})}
  </script>
</body>
</html>`
}

for (const path of await htmlFiles(outputDir)) {
  const source = await readFile(path, 'utf8')
  await writeFile(path, protectedPage(encrypt(source)))
}
