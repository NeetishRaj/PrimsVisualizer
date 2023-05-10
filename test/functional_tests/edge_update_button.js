const assert = require("node:assert");

async function edge_update_button(page) {
  await page.reload();
  await page.waitForTimeout(3000);
  
  await page.type("#edgeSource", "1");
  await page.type("#edgeTarget", "2");
  await page.type("#edgeWeight", "-100");
  
  await page.waitForTimeout(5000);

  const info = await page.$eval("#messageBox", (el) => el.textContent.trim());

  assert.deepEqual(info, `Created a random graph`);
}

module.exports = edge_update_button;
