const puppeteer = require('puppeteer');

const start_stop_button = require('./start_stop_button');
const prev_next_button = require('./prev_next_button');
const first_last_button = require('./first_last_button');
const edge_update_button = require('./edge_update_button');


let browser, page;

const APPLICATION_URL = 'http://localhost:3101/'

async function init() {
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });

  page = await browser.newPage();
  await page.waitForTimeout(10000);

  try {
    await page.goto(APPLICATION_URL, {waitUntil: "networkidle2"});
  
    await start_stop_button(page);
    await edge_update_button(page);
    await prev_next_button(page);
    await first_last_button(page);  

    console.log("\n\n\tAll functional tests ran successfully\n\n");
    
  } catch (error) {
    console.log(error);
  }
  

  page.close();
  browser.close();
}

init();

