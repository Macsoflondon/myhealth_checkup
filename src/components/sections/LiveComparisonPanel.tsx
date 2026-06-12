import React from "react";

interface ProviderRow {
  name: string;
  bio: string;
  badge: string;
  badgeType: "ukas" | "popular" | "neutral";
  price: string;
}

const providers: ProviderRow[] = [
  {
    name: "Medichecks",
    bio: "At-home kit · UKAS · 24–48h",
    badge: "UKAS",
    badgeType: "ukas",
    price: "£29",
  },
  {
    name: "Thriva",
    bio: "At-home kit · Subscription option",
    badge: "At-Home",
    badgeType: "neutral",
    price: "£39",
  },
  {
    name: "Randox Health",
    bio: "Clinic-based · UKAS · 48–72h",
    badge: "Popular",
    badgeType: "popular",
    price: "£49",
  },
  {
    name: "Goodbody Health",
    bio: "Walk-in UK clinics · CQC",
    badge: "Walk-In",
    badgeType: "neutral",
    price: "£55",
  },
  {
    name: "London Medical Laboratory",
    bio: "Walk-in London · ISO 15189",
    badge: "UKAS",
    badgeType: "ukas",
    price: "£65",
  },
];

const badgeStyles: Record<string, React.CSSProperties> = {
  ukas: {
    backgroundColor: "rgba(34,192,212,0.15)",
    color: "#22c0d4",
  },
  popular: {
    backgroundColor: "rgba(231,13,105,0.15)",
    color: "#e70d69",
  },
  neutral: {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.55)",
  },
};

const LiveComparisonPanel: React.FC = () => {
  return (
    <section className="bg-white py-12 px-4 sm:py-16 sm:px-5 md:py-16 md:px-8 lg:py-16 lg:px-12">
      <style>{`
        @keyframes float-card {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-card {
          animation: float-card 5s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <hr
            className="flex-1 border-0"
            style={{
              height: "1px",
              background:
                "linear-gradient(to right, transparent, rgba(34,192,212,0.35))",
              maxWidth: "60px",
            }}
          />
          <span
            className="font-sans font-bold uppercase text-center"
            style={{
              fontSize: "10px",
              letterSpacing: "0.18em",
              color: "#22c0d4",
            }}
          >
            Updated regularly
          </span>
          <hr
            className="flex-1 border-0"
            style={{
              height: "1px",
              background:
                "linear-gradient(to left, transparent, rgba(34,192,212,0.35))",
              maxWidth: "60px",
            }}
          />
        </div>

        {/* Heading */}
        <h2
          className="font-heading font-bold text-center mb-8"
          style={{ fontSize: "28px", color: "#081129" }}
        >
          Compare at a glance.
        </h2>

        {/* Floating Card */}
        <div
          className="animate-float-card mx-auto w-full"
          style={{
            maxWidth: "640px",
            backgroundColor: "rgba(8,17,41,0.97)",
            border: "1px solid rgba(34,192,212,0.2)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 20px 60px rgba(8,17,41,0.25)",
          }}
        >
          {/* Header */}
          <div
            className="pb-3 mb-0"
            style={{
              borderBottom: "1px solid rgba(34,192,212,0.14)",
            }}
          >
            <span
              className="font-sans font-bold uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.14em",
                color: "#22c0d4",
              }}
            >
              Live Comparison — Full Blood Count Panel
            </span>
          </div>

          {/* Provider Rows */}
          {providers.map((provider, index) => (
            <div
              key={provider.name}
              className="grid items-center"
              style={{
                gridTemplateColumns: "1fr auto auto",
                gap: "12px",
                paddingTop: "11px",
                paddingBottom: "11px",
                borderBottom:
                  index < providers.length - 1
                    ? "1px solid rgba(255,255,255,0.055)"
                    : "none",
              }}
            >
              {/* Name + Bio */}
              <div className="min-w-0">
                <div
                  className="font-heading font-bold truncate"
                  style={{ fontSize: "13px", color: "#ffffff" }}
                >
                  {provider.name}
                </div>
                <div
                  className="truncate"
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.42)",
                    marginTop: "2px",
                  }}
                >
                  {provider.bio}
                </div>
              </div>

              {/* Badge */}
              <span
                className="font-sans font-bold uppercase whitespace-nowrap"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.05em",
                  borderRadius: "20px",
                  padding: "3px 8px",
                  ...badgeStyles[provider.badgeType],
                }}
              >
                {provider.badge}
              </span>

              {/* Price */}
              <div
                className="font-heading font-extrabold text-right whitespace-nowrap"
                style={{ fontSize: "15px", color: "#ffffff" }}
              >
                {provider.price}
              </div>
            </div>
          ))}

          {/* Footer */}
          <div
            className="pt-3 mt-0 text-center"
            style={{
              borderTop: "1px solid rgba(34,192,212,0.1)",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.28)",
              }}
            >
              Prices sourced directly from provider websites. Always verify
              before booking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveComparisonPanel;
