const assert = require("node:assert");

async function start_stop_button(page) {
  await page.reload();
  await page.waitForTimeout(3000);
  await page.click("#startStopButton");
  // await page.waitForTimeout(5000);
  await page.click("#startStopButton");
  await page.waitForTimeout(5000);

  const info = await page.$eval("#messageBox", (el) => el.textContent.trim());

  assert.deepEqual(info, `Selected '1' as start vertex`);
}

module.exports = start_stop_button;
