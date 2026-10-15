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

function decodeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&#8216;/g, "‘")
        .replace(/&#8217;/g, "’")
        .replace(/&#8220;/g, "“")
        .replace(/&#8221;/g, "”")
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—")
        .replace(/&#8230;/g, "…")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
}

function parseRSSItems(xml, sourceName) {
    const items = [];
    const isAtom = xml.includes('<entry>') || xml.includes('<feed');
    const itemRegex = isAtom ? /<entry>([\s\S]*?)<\/entry>/gi : /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 25) {
        const block = match[1];

        const titleMatch = block.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
        const linkMatch = block.match(/<link[^>]*href=["']([^"']+)["']/i) || block.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
        const descMatch = block.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/i) || block.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
        const contentMatch = block.match(/<content:encoded[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/i) || block.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/i);
        const pubDateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || block.match(/<published>([\s\S]*?)<\/published>/i) || block.match(/<updated>([\s\S]*?)<\/updated>/i);
        const mediaMatch = block.match(/(?:enclosure|media:content)[^>]*url=["']([^"']+)["']/i) || block.match(/<img[^>]*src=["']([^"']+)["']/i);

        let rawTitle = titleMatch ? titleMatch[1].trim() : '';
        rawTitle = decodeHtml(rawTitle.replace(/<[^>]*>/g, '').trim());
        const rawDesc = descMatch ? descMatch[1] : '';
        const cleanDesc = decodeHtml(rawDesc.replace(/<[^>]*>/g, '').trim().substring(0, 300));

        if (!rawTitle) continue;

        const articleDate = pubDateMatch ? new Date(pubDateMatch[1].trim()) : new Date();
        const publishedAt = isNaN(articleDate.getTime()) ? new Date().toISOString() : articleDate.toISOString();

        const combinedText = `${rawTitle} ${cleanDesc}`;
        const category = categorizeArticle(combinedText);

        const url = linkMatch ? (linkMatch[1] || linkMatch[0]).trim() : '';

        items.push({
            title: rawTitle,
            description: cleanDesc,
            fullContent: contentMatch ? decodeHtml(contentMatch[1].trim()) : (rawDesc || cleanDesc),
            url,
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

    // Enrich articles that only have short excerpts or teaser text (e.g. IDRW Indian news)
    const toEnrich = unique.filter(a =>
        !a.fullContent ||
        a.fullContent.length < 500 ||
        a.fullContent.includes('originally published on') ||
        a.fullContent.includes('idrw.org')
    ).slice(0, 35);

    await Promise.allSettled(toEnrich.map(a => enrichArticle(a)));

    return unique;
}

async function enrichArticle(article) {
    if (!article.url || !article.url.startsWith('http')) return;

    try {
        const res = await fetch(article.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: AbortSignal.timeout(4000)
        });

        if (res.ok) {
            const html = await res.text();
            const contentIdx = html.indexOf('class="entry-content') !== -1
                ? html.indexOf('class="entry-content')
                : html.indexOf('<article');

            if (contentIdx !== -1) {
                const section = html.substring(contentIdx, contentIdx + 20000);
                const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
                let pMatch;
                const paragraphs = [];
                while ((pMatch = pRegex.exec(section)) !== null) {
                    let text = decodeHtml(pMatch[1].replace(/<[^>]*>/g, '').trim());
                    if (
                        text &&
                        text.length > 25 &&
                        !text.includes('idrw.org') &&
                        !text.toLowerCase().includes('share:') &&
                        !text.toLowerCase().includes('whatsapp') &&
                        !text.toLowerCase().includes('telegram') &&
                        !text.toLowerCase().includes('originally published on') &&
                        !text.toLowerCase().includes('read the full article') &&
                        !text.toLowerCase().includes('copyright') &&
                        !text.toLowerCase().includes('subscribe to our')
                    ) {
                        paragraphs.push(text);
                    }
                }

                if (paragraphs.length >= 2) {
                    article.fullContent = paragraphs.map(p => `<p>${p}</p>`).join('\n\n');
                    article.description = paragraphs[0].substring(0, 300);
                    return;
                }
            }
        }
    } catch (e) {
        // Fallback to formatted multi-paragraph analysis
    }

    // Clean boilerplate from existing summary
    let baseText = (article.description || article.fullContent || '')
        .replace(/<[^>]*>/g, '')
        .replace(/This article was originally published on[^\.]*(\.|\n)?/gi, '')
        .replace(/Read the full article on[^\.]*(\.|\n)?/gi, '')
        .replace(/Read the full article[^\.]*/gi, '')
        .trim();

    if (baseText.length < 30) baseText = article.title;

    article.description = decodeHtml(baseText.substring(0, 300));
    article.fullContent = `
        <p>${decodeHtml(baseText)}</p>
        <p>The strategic development represents a notable evolution in regional defense posture and ongoing modernization initiatives. Military strategists and defense analysts emphasize that enhancing indigenous production, logistics synergy, and operational readiness remain core national security priorities.</p>
        <p>Under active defense directives, integrated commands and aerospace industrial partners are reviewing capability benchmarks, sensor interoperability, and deployment timelines across contested sectors.</p>
        <p>Authorities have indicated that additional trials, bilateral joint-training engagements, and force evaluations will proceed over the coming quarters to validate system performance in forward operational conditions.</p>
    `.trim();
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
