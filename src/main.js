import { Actor } from 'apify';
import { gotScraping } from 'got-scraping';

await Actor.init();

const input = await Actor.getInput() || {};
const section = input.section || 'top';
const maxItems = Math.min(input.maxItems || 50, 500);
const minScore = input.minScore || 0;

console.log(`[HN Scraper] Fetching '${section}' stories (limit: ${maxItems}, minScore: ${minScore})...`);

const sectionEndpoints = {
    top: 'https://hacker-news.firebaseio.com/v0/topstories.json',
    best: 'https://hacker-news.firebaseio.com/v0/beststories.json',
    new: 'https://hacker-news.firebaseio.com/v0/newstories.json',
    ask: 'https://hacker-news.firebaseio.com/v0/askstories.json',
    show: 'https://hacker-news.firebaseio.com/v0/showstories.json',
    job: 'https://hacker-news.firebaseio.com/v0/jobstories.json',
};

const endpoint = sectionEndpoints[section] || sectionEndpoints.top;

try {
    const response = await gotScraping({
        url: endpoint,
        responseType: 'json',
        timeout: { request: 15000 },
    });

    const storyIds = response.body;

    if (!Array.isArray(storyIds) || storyIds.length === 0) {
        console.log('[HN Scraper] No stories found in this section.');
        await Actor.exit();
    }

    console.log(`[HN Scraper] Retrieved ${storyIds.length} candidate IDs. Fetching top ${maxItems}...`);

    const idsToFetch = storyIds.slice(0, Math.min(maxItems * 2, storyIds.length));
    const items = [];
    const concurrency = 15;

    for (let i = 0; i < idsToFetch.length; i += concurrency) {
        if (items.length >= maxItems) break;

        const chunk = idsToFetch.slice(i, i + concurrency);
        const chunkResults = await Promise.allSettled(
            chunk.map(async (id) => {
                const itemRes = await gotScraping({
                    url: `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
                    responseType: 'json',
                    timeout: { request: 10000 },
                });
                return itemRes.body;
            })
        );

        for (const res of chunkResults) {
            if (res.status === 'fulfilled' && res.value && !res.value.deleted && !res.value.dead) {
                const item = res.value;
                const score = item.score || 0;

                if (score >= minScore) {
                    const record = {
                        id: item.id,
                        title: item.title || null,
                        score: item.score || 0,
                        commentsCount: item.descendants || 0,
                        by: item.by || null,
                        url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
                        hnUrl: `https://news.ycombinator.com/item?id=${item.id}`,
                        type: item.type || 'story',
                        text: item.text || null,
                        postedAt: item.time ? new Date(item.time * 1000).toISOString() : null,
                        scrapedAt: new Date().toISOString(),
                    };

                    items.push(record);
                    if (items.length >= maxItems) break;
                }
            }
        }
    }

    console.log(`[HN Scraper] Successfully extracted ${items.length} stories. Pushing to dataset...`);
    if (items.length > 0) {
        await Actor.pushData(items);
    }

} catch (error) {
    console.error(`[HN Scraper] Critical error:`, error.message);
    throw error;
}

await Actor.exit();
