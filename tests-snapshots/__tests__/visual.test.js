const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

expect.extend({ toMatchImageSnapshot })

describe('Visual Regression Testing', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false })
    page =  await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  test('Full Page Snapshot', async () => {
    await page.goto('https://www.example.com')
    await page.waitForSelector('h1')
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: "pixel",
      failureThreshold: 500
    })
  })

  test('Single Element Snapshot', async () => {
    await page.goto('https://www.example.com')
    const h1 = await page.waitForSelector('h1')
    const image = await h1.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: "percent",
      failureThreshold: 0.01
    })
  })

  test('Mobile Snapshot', async () => {
    await page.goto('https://www.example.com')
    await page.emulate(puppeteer.KnownDevices['iPhone XR'])
    await page.waitForSelector('h1')
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: "percent",
      failureThreshold: 0.01
    })
  })

  test('Tablet Snapshot', async () => {
    await page.goto('https://www.example.com')
    await page.emulate(puppeteer.KnownDevices['iPad landscape'])
    await page.waitForSelector('h1')
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: "percent",
      failureThreshold: 0.01
    })
  })

  test('Remove Element Before Snapshot', async () => {
    await page.goto('https://example.com')
    await page.evaluate(() => {
      (document.querySelectorAll('h1') || []).forEach(el => el.remove())
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 5000))
  })
})