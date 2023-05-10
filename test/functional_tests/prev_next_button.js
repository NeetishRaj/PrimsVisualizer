const assert = require("node:assert");

async function prev_next_button(page) {
  await page.reload();
  await page.waitForTimeout(3000);
  await page.click("body > div > div.row.controls.d-flex.align-items-center > div > button:nth-child(2)");
  await page.waitForTimeout(5000);
  await page.click("body > div > div.row.controls.d-flex.align-items-center > div > button:nth-child(3)");
  await page.waitForTimeout(5000);

  const info = await page.$eval("#messageBox", (el) => el.textContent.trim());

  assert.deepEqual(info, `Created a random graph`);
}

module.exports = prev_next_button;
