const fs = require('fs');
const path = require('path');

// --- Configuration ---
const productsFilePath = path.join(__dirname, '..', 'products.json');
const sitemapFilePath = path.join(__dirname, '..', 'sitemap.xml');
const googleFeedFilePath = path.join(__dirname, '..', 'google_feed.xml');
const baseUrl = 'https://sherow1982.github.io/matjar-makhzoon-oman';

// --- Helper Functions ---
function escapeXml(unsafe) {
    if (typeof unsafe !== 'string') {
        return unsafe;
    }
    return unsafe.replace(/[<>&'"\\]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            // The description field contains escaped newlines, let's handle them
            case '\\': return ''; 
            default: return c;
        }
    });
}

function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

// --- Main Logic ---
try {
    // Read products data
    const productsData = fs.readFileSync(productsFilePath, 'utf8');
    const products = JSON.parse(productsData);
    const today = getCurrentDate();

    // --- 1. Generate sitemap.xml ---
    console.log('Generating sitemap.xml...');
    const staticUrls = `
  <!-- الصفحات الرئيسية والثابتة -->
  <url>
    <loc>${baseUrl}/index.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/pages/shipping.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/pages/returns.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/pages/terms.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/pages/privacy.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/pages/contact.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

    const productUrls = products.map(p => `
  <url>
    <loc>${baseUrl}/product-details.html?id=${p.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('');

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${productUrls}
</urlset>`;
    fs.writeFileSync(sitemapFilePath, sitemapContent.trim());
    console.log('sitemap.xml generated successfully.');

    // --- 2. Generate google_feed.xml ---
    console.log('Generating google_feed.xml...');
    const feedItems = products.map(p => {
        // Remove brand names from title for the feed
        const cleanTitle = p.title.replace(/(من|من|من |من |من |من )?(Remington|باناسونيك|BRAUN|بيبي ليس|KIKO|Maybelline|Rolex|Geepas|Sanford|Hamilton|Krypton|VGR|Dexe|Topface|Rose Berry|SHEGLAM|فلورمار|Bioaqua|Joy|Seiko)/gi, '').trim();
        
        return `
    <item>
      <g:id>${p.id}</g:id>
      <title>${escapeXml(cleanTitle)}</title>
      <description>${escapeXml(p.description)}</description>
      <link>${baseUrl}/product-details.html?id=${p.id}</link>
      <g:image_link>${escapeXml(p['image link'])}</g:image_link>
      ${p['additional image link'] ? `<g:additional_image_link>${escapeXml(p['additional image link'])}</g:additional_image_link>` : ''}
      <g:availability>${p.availability}</g:availability>
      <g:price>${p.sale_price} OMR</g:price>
      <g:condition>${p.condition}</g:condition>
      <g:brand>${escapeXml(p.brand || 'مخزون عمان')}</g:brand>
      <g:mpn>${p.sku}</g:mpn>
    </item>`;
    }).join('');

    const feedContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>مخزون عمان - تغذية بيانات المنتجات</title>
    <link>${baseUrl}</link>
    <description>قائمة منتجات متجر مخزون عمان.</description>${feedItems}
  </channel>
</rss>`;
    fs.writeFileSync(googleFeedFilePath, feedContent.trim());
    console.log('google_feed.xml generated successfully.');

} catch (error) {
    console.error('Error generating feeds:', error);
    process.exit(1);
}