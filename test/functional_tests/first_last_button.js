const assert = require("node:assert");

async function first_last_button(page) {
  await page.reload();
  await page.waitForTimeout(3000);
  await page.click("body > div > div.row.controls.d-flex.align-items-center > div > button:nth-child(4)");
  await page.waitForTimeout(5000);
  await page.click("body > div > div.row.controls.d-flex.align-items-center > div > button:nth-child(5)");
  await page.waitForTimeout(5000);

  const info = await page.$eval("#messageBox", (el) => el.textContent.trim());

  assert.deepEqual(info, `Created a random graph`);
}

module.exports = first_last_button;
