# Hacker News Trends & Top Stories Scraper 🚀

Extract trending tech news, top community stories, developer discussions, and job offers directly from **Hacker News (Y Combinator)** in real time.

Ideal for tech trend monitoring, automated newsletters, Slack/Discord tech alerts, and AI summarization feeds.

---

## ⚡ Key Features

- **Multiple Feeds**: Top Stories, Best Stories, Newest Stories, Ask HN, Show HN, and Job postings.
- **Ultra-Fast & Reliable**: Directly uses official high-speed endpoints with 0 rate blocks. Runs in 2-4 seconds.
- **Enriched Data**: Story title, author username, point score, total comment count, discussion link, target link, and publication date.
- **Configurable Filters**: Set custom minimum upvote thresholds (`minScore`) and maximum item limits.
- **Export Ready**: Download as JSON, CSV, Excel, XML, or connect directly to Zapier, Make, and webhooks.

---

## 📥 Input Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `section` | String | `"top"` | Story category: `top`, `best`, `new`, `ask`, `show`, or `job`. |
| `maxItems` | Integer | `50` | Maximum number of stories to extract (1 to 500). |
| `minScore` | Integer | `0` | Minimum upvote score threshold. |

### Example Input:
```json
{
  "section": "top",
  "maxItems": 30,
  "minScore": 50
}
```

---

## 📤 Output Data Format

```json
{
  "id": 50522980,
  "title": "Carnegie Mellon is putting computer science courses on YouTube for free",
  "score": 1676,
  "commentsCount": 225,
  "by": "pcompeau",
  "url": "https://www.cs.cmu.edu/learn/",
  "hnUrl": "https://news.ycombinator.com/item?id=50522980",
  "type": "story",
  "postedAt": "2026-11-16T18:03:36.000Z",
  "scrapedAt": "2026-11-17T12:00:00.000Z"
}
```

---

## 💡 Use Cases

1. **AI Newsletters**: Automatically curate the top 5 hacker news stories every morning and generate AI digests.
2. **Social Media Automation**: Post trending tech articles to Twitter/X, LinkedIn, or Telegram channels.
3. **Competitive Intelligence**: Track emerging developer tools and viral startup launches on "Show HN".
