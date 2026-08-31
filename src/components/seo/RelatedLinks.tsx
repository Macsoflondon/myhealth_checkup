/**
 * Contextual internal-link block.
 *
 * Renders grouped links to related categories, comparison hubs and provider
 * profiles. Links preload on intent so the next page is usually already warm
 * by the time the user clicks.
 */

import { Link } from '@/lib/router-compat';
import { buildRelatedLinks, type RelatedLinksInput } from '@/lib/internal-links';

interface RelatedLinksProps extends RelatedLinksInput {
  heading?: string;
  className?: string;
}

export const RelatedLinks = ({
  categorySlug,
  providerId,
  limit,
  heading = 'Continue your comparison',
  className = '',
}: RelatedLinksProps) => {
  const groups = buildRelatedLinks({ categorySlug, providerId, limit });
  if (groups.length === 0) return null;

  return (
    <nav aria-label="Related pages" className={`bg-white ${className}`}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 border-t border-brand-navy">
        <h2 className="text-lg font-semibold text-navy mb-6">{heading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-navy mb-3">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      preload="intent"
                      className="text-sm text-navy hover:text-brand-pink underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default RelatedLinks;
