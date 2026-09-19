import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
const browser = await chromium.launch({channel:'msedge', headless:true})
const page = await browser.newPage()
const requests = []
const uiErrors = []
page.on('pageerror', error => uiErrors.push(error.message))
page.on('response', async response => {
  const url = new URL(response.url())
  if (!url.pathname.startsWith('/api/')) return
  const params = Object.fromEntries([...url.searchParams].filter(([k]) => k.toLowerCase() !== 'servicekey'))
  let structure
  try {
    const text = await response.text()
    if (text.trim().startsWith('{')) {
      const root = JSON.parse(text); const r = root.response ?? root; const b = r.body
      structure = { rootKeys: Object.keys(root), header: r.header, bodyKeys: Object.keys(b ?? {}), totalCount:b?.totalCount, itemsType: Array.isArray(b?.items) ? 'array' : typeof b?.items, itemsKeys:Object.keys(b?.items ?? {}), itemCount:Array.isArray(b?.items) ? b.items.length : Array.isArray(b?.items?.item) ? b.items.item.length : b?.items?.item ? 1 : 0 }
    } else structure = { type: response.headers()['content-type'], xmlRoot:text.match(/<(\w+)[\s>]/)?.[1], resultCode:text.match(/<(?:resultCode|returnReasonCode)>(.*?)<\//)?.[1], resultMsg:text.match(/<(?:resultMsg|returnAuthMsg)>(.*?)<\//)?.[1], totalCount:text.match(/<totalCount>(.*?)<\//)?.[1], itemCount:(text.match(/<item>/g) ?? []).length }
  } catch { structure = {unreadable:true} }
  requests.push({path:url.pathname, params, http:response.status(), structure})
})
await page.goto('http://127.0.0.1:5174/home')
const result = await page.evaluate(async () => {
  const {regions} = await import('/src/mocks/regions.mock.ts')
  const {getRegionLivingData} = await import('/src/services/regionDataService.ts')
  const {getTourCityCodes} = await import('/src/services/tourApiService.ts')
  const {regionRuntimeConfig} = await import('/src/config/regionCodes.ts')
  return Promise.all(regions.map(async r => {
    const data = await getRegionLivingData(r)
    let codes
    try { const c = regionRuntimeConfig[r.id]; codes = await getTourCityCodes(c.provinceAliases,c.city) } catch { codes = {provinceResolved:false,sigunguResolved:false} }
    return {id:r.id, region:r.city, codes, data}
  }))
})
const checks = []
for (const r of result) {
  await page.evaluate(path => { history.pushState({}, '', path); dispatchEvent(new PopStateEvent('popstate')) }, `/region/${r.id}`)
  await page.getByText('지역 주거비 수준', {exact:true}).first().waitFor()
  await page.locator('details').first().evaluate(el => { el.open = true })
  if (r.data.library.data.length) await page.getByRole('heading', {name:r.data.library.data[0].name,exact:true}).first().waitFor()
  if (r.data.ruralExperience.data.length) await page.getByRole('heading', {name:r.data.ruralExperience.data[0].name,exact:true}).first().waitFor()
  if (r.data.festival.data.length) await page.getByRole('heading', {name:r.data.festival.data[0].name,exact:true}).first().waitFor()
  await page.getByRole('button',{name:'즐길거리',exact:true}).click()
  if (r.data.tourism.data.length) await page.getByText(r.data.tourism.data[0].name,{exact:true}).first().waitFor()
  checks.push({route:`/region/${r.id}`,rendered:true})
}
for (const route of ['/home','/compare','/map','/itinerary','/analysis-result']) {
  await page.evaluate(path => { history.pushState({}, '', path); dispatchEvent(new PopStateEvent('popstate')) }, route)
  if (route === '/home' || route === '/compare' || route === '/analysis-result') await page.getByText(/지역 활력/).first().waitFor()
  else { await page.locator('details summary').click(); await page.getByRole('heading',{name:result[0].data.ruralExperience.data[0].name,exact:true}).first().waitFor() }
  checks.push({route,rendered:true})
}
await page.screenshot({path:'docs/itinerary-runtime.png',fullPage:true})
const unitChecks = await page.evaluate(async () => {
  const {parseDataset} = await import('/src/services/datasetClient.ts')
  const {median,toRental} = await import('/src/adapters/housingAdapter.ts')
  const {toFestival} = await import('/src/adapters/festivalAdapter.ts')
  const assert = (value, name) => { if (!value) throw new Error(name) }
  assert(median([1,2,1000]) === 2 && median([1,3]) === 2, 'median outliers/even')
  assert(toRental({deposit:'10,000',monthlyRent:'0'}).deposit === 100000000,'jeonse units')
  assert(toRental({deposit:'',monthlyRent:'0'}) === null,'missing deposit')
  assert(parseDataset({response:{header:{resultCode:'00'},body:{totalCount:1,items:[{name:'ok'}]}}},true).items.length === 1,'standard array')
  assert(parseDataset({response:{header:{resultCode:'000'},body:{totalCount:1,items:{item:{deposit:'1'}}}}}).items.length === 1,'agency singleton')
  let mismatch = false
  try {parseDataset({response:{header:{resultCode:'0000'},body:{totalCount:17,items:''}}})} catch(e) {mismatch=e.state === 'api_response_mismatch'}
  assert(mismatch,'positive count empty items')
  assert(toFestival({fstvlStartDate:'2020-01-01',fstvlEndDate:'2020-01-02'}).status === 'expired','expired festival')
  return ['median','rental units/missing values','standard array','agency singleton','response mismatch','expired festival']
})
await writeFile('docs/runtime-audit.json', JSON.stringify({at:new Date().toISOString(),result,requests,checks,unitChecks,uiErrors},null,2))
if(uiErrors.length) throw new Error(JSON.stringify(uiErrors))
console.log(JSON.stringify(result.map(r=>({region:r.region,codes:r.codes,sources:r.data.sources,reasons:Object.fromEntries(['tourism','visitor','housing','festival','ruralExperience','library'].map(k=>[k,r.data[k].reason]))})),null,2))
await browser.close()
