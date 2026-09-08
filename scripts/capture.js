const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function capture() {
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  ];
  let executablePath = chromePaths.find(p => p && fs.existsSync(p));
  console.log('Using browser executable:', executablePath);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars']
  });

  const targets = [
    {
      name: 'northstar-dental.jpg',
      url: 'https://northstar-dental-xi.vercel.app/'
    },
    {
      name: 'studio-auren.jpg',
      url: 'https://studio-auren.vercel.app/'
    },
    {
      name: 'haven-co.jpg',
      url: 'https://haven-co-orcin.vercel.app/'
    }
  ];

  const outDir = path.join(__dirname, '..', 'public', 'projects');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const target of targets) {
    console.log(`Navigating to ${target.url}...`);
    const page = await browser.newPage();
    await page.setViewport({
      width: 1360,
      height: 850,
      deviceScaleFactor: 1.5
    });

    try {
      await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait a bit for CSS transitions, fonts, and images
      await new Promise(r => setTimeout(r, 2500));

      const outPath = path.join(outDir, target.name);
      await page.screenshot({
        path: outPath,
        type: 'jpeg',
        quality: 90,
        clip: {
          x: 0,
          y: 0,
          width: 1360,
          height: 850
        }
      });
      console.log(`Saved screenshot to ${outPath}`);
    } catch (err) {
      console.error(`Error capturing ${target.url}:`, err);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('Finished capturing.');
}

capture();
