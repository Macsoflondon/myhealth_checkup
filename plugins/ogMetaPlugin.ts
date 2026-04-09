import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

interface RouteMeta {
  title: string;
  description: string;
  url: string;
}

const BASE_URL = 'https://myhealthcheckup.co.uk';

const routeMetadata: Record<string, RouteMeta> = {
  '/': {
    title: 'myhealth checkup | Compare UK Health Tests',
    description: "UK's leading health test comparison platform. Compare private blood tests, hormone checks, and health screenings from accredited providers. Free to use.",
    url: `${BASE_URL}/`,
  },
  '/about': {
    title: 'About Us | myhealth checkup',
    description: "Learn about myhealth checkup's mission to make private health testing transparent, accessible, and trustworthy for everyone in the UK.",
    url: `${BASE_URL}/about`,
  },
  '/how-it-works': {
    title: 'How It Works | myhealth checkup',
    description: 'Compare tests, choose a provider, and book directly. Three simple steps to take control of your health with confidence.',
    url: `${BASE_URL}/how-it-works`,
  },
  '/compare': {
    title: 'Compare Health Tests | myhealth checkup',
    description: 'Compare private blood tests side by side. Filter by price, biomarkers, turnaround time, and sample type across leading UK providers.',
    url: `${BASE_URL}/compare`,
  },
  '/test-categories': {
    title: 'Test Categories | myhealth checkup',
    description: 'Browse health test categories including hormones, vitamins, cancer screening, heart health, and more from accredited UK providers.',
    url: `${BASE_URL}/test-categories`,
  },
  '/search': {
    title: 'Search Health Tests | myhealth checkup',
    description: 'Search across hundreds of private health tests from UK providers. Find the right test by symptom, condition, or biomarker.',
    url: `${BASE_URL}/search`,
  },
  '/contact': {
    title: 'Contact Us | myhealth checkup',
    description: 'Get in touch with the myhealth checkup team. We are here to help with questions about health test comparisons and our platform.',
    url: `${BASE_URL}/contact`,
  },
  '/faqs': {
    title: 'FAQs | myhealth checkup',
    description: 'Frequently asked questions about private health testing in the UK. Learn about blood tests, providers, pricing, and how our comparison works.',
    url: `${BASE_URL}/faqs`,
  },
  '/blog': {
    title: 'Health Blog | myhealth checkup',
    description: 'Expert articles on private health testing, biomarkers, wellness, and preventive healthcare in the UK.',
    url: `${BASE_URL}/blog`,
  },
  '/partners': {
    title: 'Our Partners | myhealth checkup',
    description: 'Explore our network of UKAS-accredited, CQC-regulated health testing partners across the United Kingdom.',
    url: `${BASE_URL}/partners`,
  },
  '/legal': {
    title: 'Legal Information | myhealth checkup',
    description: 'Legal information, terms of service, and regulatory disclosures for myhealth checkup.',
    url: `${BASE_URL}/legal`,
  },
  '/sitemap': {
    title: 'Sitemap | myhealth checkup',
    description: 'Navigate all pages on myhealth checkup. Find health tests, providers, categories, and resources quickly.',
    url: `${BASE_URL}/sitemap`,
  },
  '/find-clinic': {
    title: 'Find a Clinic | myhealth checkup',
    description: 'Find your nearest blood test clinic in the UK. Search by postcode to locate accredited clinics for in-person sample collection.',
    url: `${BASE_URL}/find-clinic`,
  },
  '/at-home-tests': {
    title: 'At-Home Blood Tests | myhealth checkup',
    description: 'Compare at-home blood test kits from leading UK providers. Convenient finger-prick tests delivered to your door.',
    url: `${BASE_URL}/at-home-tests`,
  },
  '/most-popular': {
    title: 'Most Popular Tests | myhealth checkup',
    description: 'Discover the most popular private blood tests in the UK. See what other health-conscious adults are testing for.',
    url: `${BASE_URL}/most-popular`,
  },
  '/recommendations': {
    title: 'Health Recommendations | myhealth checkup',
    description: 'Get personalised health test recommendations based on your wellness goals. AI-powered suggestions from trusted UK providers.',
    url: `${BASE_URL}/recommendations`,
  },
  '/tests/cancer': {
    title: 'Cancer Screening Tests | myhealth checkup',
    description: 'Compare private cancer screening blood tests from accredited UK laboratories. PSA, CA-125, CEA and more tumour markers.',
    url: `${BASE_URL}/tests/cancer`,
  },
  '/tests/diabetes': {
    title: 'Diabetes Tests | myhealth checkup',
    description: 'Compare private diabetes blood tests including HbA1c, fasting glucose, and insulin resistance panels from UK providers.',
    url: `${BASE_URL}/tests/diabetes`,
  },
  '/tests/heart': {
    title: 'Heart Health Tests | myhealth checkup',
    description: 'Compare private heart health blood tests. Cholesterol, lipid profiles, and cardiovascular risk panels from accredited UK labs.',
    url: `${BASE_URL}/tests/heart`,
  },
  '/tests/vitamins': {
    title: 'Vitamin Deficiency Tests | myhealth checkup',
    description: 'Compare private vitamin and mineral blood tests. Check vitamin D, B12, folate, and iron levels from UK providers.',
    url: `${BASE_URL}/tests/vitamins`,
  },
  '/tests/gut': {
    title: 'Gut Health Tests | myhealth checkup',
    description: 'Compare private gut health and digestive tests from accredited UK providers. Comprehensive stool and blood testing options.',
    url: `${BASE_URL}/tests/gut`,
  },
  '/tests/mens-health': {
    title: "Men's Health Tests | myhealth checkup",
    description: "Compare private men's health blood tests. Testosterone, PSA, and comprehensive male health panels from UK providers.",
    url: `${BASE_URL}/tests/mens-health`,
  },
  '/tests/womens-health': {
    title: "Women's Health Tests | myhealth checkup",
    description: "Compare private women's health blood tests. Hormone panels, fertility tests, and well woman checks from UK providers.",
    url: `${BASE_URL}/tests/womens-health`,
  },
  '/tests/general-health': {
    title: 'General Health Tests | myhealth checkup',
    description: 'Compare general health blood test panels from UK providers. Comprehensive health MOTs covering key biomarkers.',
    url: `${BASE_URL}/tests/general-health`,
  },
  '/tests/vitamin-d': {
    title: 'Vitamin D Tests | myhealth checkup',
    description: 'Compare private vitamin D blood tests from accredited UK providers. Check your vitamin D levels quickly and affordably.',
    url: `${BASE_URL}/tests/vitamin-d`,
  },
  '/tests/iron-profile': {
    title: 'Iron Profile Tests | myhealth checkup',
    description: 'Compare private iron blood tests including ferritin, transferrin, and TIBC from accredited UK laboratories.',
    url: `${BASE_URL}/tests/iron-profile`,
  },
  '/tests/lipid-profile': {
    title: 'Lipid Profile Tests | myhealth checkup',
    description: 'Compare private cholesterol and lipid profile blood tests. Total cholesterol, HDL, LDL, and triglycerides from UK providers.',
    url: `${BASE_URL}/tests/lipid-profile`,
  },
  '/tests/female-hormones': {
    title: 'Female Hormone Tests | myhealth checkup',
    description: 'Compare private female hormone blood tests. Oestrogen, progesterone, FSH, and LH panels from accredited UK labs.',
    url: `${BASE_URL}/tests/female-hormones`,
  },
  '/tests/male-hormones': {
    title: 'Male Hormone Tests | myhealth checkup',
    description: 'Compare private male hormone blood tests. Testosterone, SHBG, and full male hormone panels from UK providers.',
    url: `${BASE_URL}/tests/male-hormones`,
  },
  '/tests/well-woman': {
    title: 'Well Woman Tests | myhealth checkup',
    description: 'Compare private well woman health checks from UK providers. Comprehensive female health screening packages.',
    url: `${BASE_URL}/tests/well-woman`,
  },
  '/thyroid': {
    title: 'Thyroid Tests | myhealth checkup',
    description: 'Compare private thyroid function blood tests. TSH, T3, T4, and thyroid antibody panels from accredited UK providers.',
    url: `${BASE_URL}/thyroid`,
  },
  '/hormones': {
    title: 'Hormone Tests | myhealth checkup',
    description: 'Compare private hormone blood tests from UK providers. Male and female hormone panels, thyroid, cortisol, and more.',
    url: `${BASE_URL}/hormones`,
  },
  '/fertility-tests': {
    title: 'Fertility Tests | myhealth checkup',
    description: 'Compare private fertility blood tests for men and women. AMH, FSH, semen analysis, and fertility panels from UK providers.',
    url: `${BASE_URL}/fertility-tests`,
  },
  '/mens-health': {
    title: "Men's Health | myhealth checkup",
    description: "Comprehensive guide to men's health testing in the UK. Compare testosterone, PSA, and male wellness panels.",
    url: `${BASE_URL}/mens-health`,
  },
  '/womens-health': {
    title: "Women's Health | myhealth checkup",
    description: "Comprehensive guide to women's health testing in the UK. Compare hormone, fertility, and wellness panels.",
    url: `${BASE_URL}/womens-health`,
  },
  '/sports-performance': {
    title: 'Sports Performance Tests | myhealth checkup',
    description: 'Compare sports and fitness blood tests from UK providers. Optimise training with performance biomarker panels.',
    url: `${BASE_URL}/sports-performance`,
  },
  '/cancer-screening': {
    title: 'Cancer Screening | myhealth checkup',
    description: 'Compare private cancer screening options across accredited UK providers. Tumour markers, risk assessments, and early detection.',
    url: `${BASE_URL}/cancer-screening`,
  },
  '/conditions': {
    title: 'Health Conditions | myhealth checkup',
    description: 'Explore health conditions and find relevant blood tests. Evidence-based guides to testing for common health concerns.',
    url: `${BASE_URL}/conditions`,
  },
  '/privacy-policy': {
    title: 'Privacy Policy | myhealth checkup',
    description: 'How myhealth checkup collects, uses, and protects your personal data. GDPR-compliant privacy practices explained clearly.',
    url: `${BASE_URL}/privacy-policy`,
  },
  '/terms': {
    title: 'Terms & Conditions | myhealth checkup',
    description: 'Terms of use for myhealth checkup. Read about your rights, responsibilities, and our platform policies.',
    url: `${BASE_URL}/terms`,
  },
  '/cookies': {
    title: 'Cookie Policy | myhealth checkup',
    description: 'How myhealth checkup uses cookies. Clear explanation of tracking, analytics, and your cookie choices.',
    url: `${BASE_URL}/cookies`,
  },
  '/accessibility': {
    title: 'Accessibility | myhealth checkup',
    description: 'Our commitment to digital accessibility. Learn how myhealth checkup ensures an inclusive experience for all users.',
    url: `${BASE_URL}/accessibility`,
  },
  '/how-we-rank': {
    title: 'How We Rank | myhealth checkup',
    description: 'Transparent ranking methodology. Learn how myhealth checkup compares and ranks health test providers fairly.',
    url: `${BASE_URL}/how-we-rank`,
  },
  '/affiliate-disclosure': {
    title: 'Affiliate Disclosure | myhealth checkup',
    description: 'Full transparency on how myhealth checkup earns revenue. Our affiliate relationships and editorial independence policy.',
    url: `${BASE_URL}/affiliate-disclosure`,
  },
  '/fair-trading': {
    title: 'Fair Trading Policy | myhealth checkup',
    description: 'Our commitment to CMA-compliant fair trading practices. Honest comparisons, transparent pricing, no pay-to-rank.',
    url: `${BASE_URL}/fair-trading`,
  },
  '/modern-slavery': {
    title: 'Modern Slavery Statement | myhealth checkup',
    description: 'MYHEALTHCHECKUP LTD modern slavery and human trafficking statement as required under the Modern Slavery Act 2015.',
    url: `${BASE_URL}/modern-slavery`,
  },
  '/dashboard': {
    title: 'Dashboard | myhealth checkup',
    description: 'Your personal health dashboard. Track tests, view results, manage favourites, and monitor your health journey.',
    url: `${BASE_URL}/dashboard`,
  },
  '/trusted-providers': {
    title: 'Trusted Providers | myhealth checkup',
    description: 'Discover our network of trusted, accredited UK health test providers. UKAS certified labs and CQC registered clinics.',
    url: `${BASE_URL}/trusted-providers`,
  },
  '/wellness': {
    title: 'Wellness Tests | myhealth checkup',
    description: 'Compare private wellness blood tests from UK providers. Comprehensive health checks for proactive wellbeing.',
    url: `${BASE_URL}/wellness`,
  },
};

function replaceTag(html: string, regex: RegExp, replacement: string): string {
  return regex.test(html) ? html.replace(regex, replacement) : html;
}

export function ogMetaPlugin(): Plugin {
  return {
    name: 'og-meta-injection',
    apply: 'build',
    closeBundle: {
      sequential: true,
      async handler() {
        const distDir = path.resolve(process.cwd(), 'dist');
        const indexPath = path.join(distDir, 'index.html');

        if (!fs.existsSync(indexPath)) {
          console.warn('[og-meta] dist/index.html not found, skipping.');
          return;
        }

        const template = fs.readFileSync(indexPath, 'utf-8');
        let count = 0;

        for (const [route, meta] of Object.entries(routeMetadata)) {
          if (route === '/') continue; // index.html already has homepage meta

          const html = template
            .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
            .replace(
              /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
              `<meta name="description" content="${meta.description}" />`
            )
            .replace(
              /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
              `<meta property="og:title" content="${meta.title}" />`
            )
            .replace(
              /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
              `<meta property="og:description" content="${meta.description}" />`
            )
            .replace(
              /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
              `<meta property="og:url" content="${meta.url}" />`
            )
            .replace(
              /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
              `<meta name="twitter:title" content="${meta.title}" />`
            )
            .replace(
              /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
              `<meta name="twitter:description" content="${meta.description}" />`
            )
            .replace(
              /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
              `<link rel="canonical" href="${meta.url}" />`
            );

          const routeDir = path.join(distDir, route.slice(1));
          fs.mkdirSync(routeDir, { recursive: true });
          fs.writeFileSync(path.join(routeDir, 'index.html'), html);
          count++;
        }

        console.log(`[og-meta] Generated ${count} route-specific HTML files.`);
      },
    },
  };
}
