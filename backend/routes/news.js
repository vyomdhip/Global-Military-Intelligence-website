const express = require('express');
const router = express.Router();

// In-memory cache for news
let cachedNews = null;
let lastCacheTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const RSS_FEEDS = [
    { url: 'https://news.usni.org/feed', name: 'USNI News' },
    { url: 'https://www.navalnews.com/feed/', name: 'Naval News' },
    { url: 'https://idrw.org/feed/', name: 'Indian Defence Research Wing' },
    { url: 'https://ukdefencejournal.org.uk/feed/', name: 'UK Defence Journal' },
    { url: 'https://www.livefistdefence.com/feed/', name: 'LiveFist Defence' },
    { url: 'https://feeds.feedburner.com/IndianDefenceNews', name: 'Indian Defence News' }
];

const MILITARY_KEYWORDS = [
    'military', 'defense', 'defence', 'armed forces', 'army', 'navy', 'air force',
    'marine', 'pentagon', 'nato', 'warfare', 'weapon', 'missile', 'fighter jet',
    'bomber', 'submarine', 'warship', 'destroyer', 'frigate', 'carrier', 'tank',
    'artillery', 'drone', 'uav', 'nuclear', 'warhead', 'troops', 'soldiers',
    'combat', 'strike', 'airstrike', 'deployment', 'battalion', 'brigade',
    'special forces', 'commando', 'infantry', 'stealth', 'radar', 'anti-aircraft',
    'torpedo', 'hypersonic', 'ballistic', 'f-35', 'f-16', 'su-57', 'rafale',
    'drdo', 'tejas', 'brahmos', 'himars', 'patriot', 's-400'
];

function isMilitaryArticle(title, description) {
    const text = `${title || ''} ${description || ''}`.toLowerCase();
    return MILITARY_KEYWORDS.some(kw => text.includes(kw));
}

function categorizeArticle(text) {
    const t = (text || '').toLowerCase();
    if (t.includes('strike') || t.includes('conflict') || t.includes('war') || t.includes('clash') || t.includes('frontline') || t.includes('border') || t.includes('invasion') || t.includes('attack')) {
        return 'conflict';
    }
    if (t.includes('tech') || t.includes('ai') || t.includes('drone') || t.includes('hypersonic') || t.includes('stealth') || t.includes('radar') || t.includes('missile') || t.includes('satellite') || t.includes('cyber')) {
        return 'tech';
    }
    return 'defense';
}

function parseRSSItems(xml, sourceName) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 25) {
        const block = match[1];

        const titleMatch = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
        const linkMatch = block.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
        const descMatch = block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
        const contentMatch = block.match(/<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/i);
        const pubDateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
        const mediaMatch = block.match(/(?:enclosure|media:content)[^>]*url=["']([^"']+)["']/i) || block.match(/<img[^>]*src=["']([^"']+)["']/i);

        const rawTitle = titleMatch ? titleMatch[1].trim() : '';
        const rawDesc = descMatch ? descMatch[1] : '';
        const cleanDesc = rawDesc.replace(/<[^>]*>/g, '').replace(/&[a-z0-9#]+;/gi, ' ').trim().substring(0, 300);

        if (!rawTitle) continue;

        const articleDate = pubDateMatch ? new Date(pubDateMatch[1].trim()) : new Date();
        const publishedAt = isNaN(articleDate.getTime()) ? new Date().toISOString() : articleDate.toISOString();

        const combinedText = `${rawTitle} ${cleanDesc}`;
        const category = categorizeArticle(combinedText);

        items.push({
            title: rawTitle,
            description: cleanDesc,
            fullContent: contentMatch ? contentMatch[1].trim() : (rawDesc || cleanDesc),
            url: linkMatch ? linkMatch[1].trim() : '',
            image: mediaMatch ? mediaMatch[1] : null,
            source: sourceName,
            publishedAt,
            category
        });
    }

    return items;
}

async function fetchAllFeeds() {
    let allArticles = [];

    const promises = RSS_FEEDS.map(async feed => {
        try {
            const res = await fetch(feed.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
                },
                signal: AbortSignal.timeout(6000)
            });

            if (!res.ok) return [];
            const xml = await res.text();
            return parseRSSItems(xml, feed.name);
        } catch (err) {
            console.warn(`[News API] Feed failed (${feed.name}):`, err.message);
            return [];
        }
    });

    const results = await Promise.allSettled(promises);
    results.forEach(res => {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
            allArticles = allArticles.concat(res.value);
        }
    });

    // Deduplicate articles by title
    const seen = new Set();
    const unique = [];
    for (const a of allArticles) {
        const key = a.title.toLowerCase().substring(0, 50).trim();
        if (!seen.has(key) && key.length > 5) {
            seen.add(key);
            unique.push(a);
        }
    }

    // Sort newest first
    unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return unique;
}

// GET /api/news
router.get('/', async (req, res) => {
    try {
        const now = Date.now();
        if (cachedNews && (now - lastCacheTime < CACHE_TTL) && cachedNews.length > 0) {
            return res.json({ status: 'ok', source: 'cache', count: cachedNews.length, articles: cachedNews });
        }

        const articles = await fetchAllFeeds();

        if (articles && articles.length > 0) {
            cachedNews = articles;
            lastCacheTime = now;
            return res.json({ status: 'ok', source: 'live', count: articles.length, articles });
        }

        // If live fetch returned nothing but we had stale cache, return stale cache
        if (cachedNews && cachedNews.length > 0) {
            return res.json({ status: 'ok', source: 'stale-cache', count: cachedNews.length, articles: cachedNews });
        }

        return res.json({ status: 'empty', count: 0, articles: [] });
    } catch (err) {
        console.error('[News API] Unexpected error:', err);
        return res.status(500).json({ error: 'Failed to retrieve military news.' });
    }
});

module.exports = router;
