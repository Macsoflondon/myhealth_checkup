import React from "react";

interface TrustItem {
  icon: string;
  label: string;
}

const trustItems: TrustItem[] = [
  { icon: "🔬", label: "UKAS-Accredited Labs" },
  { icon: "✔", label: "CQC-Regulated Clinics" },
  { icon: "🏆", label: "ISO 15189 Certification" },
  { icon: "🔒", label: "GDPR Compliant" },
  { icon: "💷", label: "Transparent Pricing" },
  { icon: "🩺", label: "No GP Referral Needed" },
];

const AccreditedProvidersBar: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "#f5f8fc",
        borderBottom: "1px solid #eef1f6",
        padding: "18px 20px",
      }}
    >
      <div
        className="mx-auto flex flex-wrap items-center justify-center"
        style={{ maxWidth: "1280px", gap: "6px 22px" }}
      >
        {/* Top label */}
        <div
          className="w-full text-center font-sans font-bold uppercase"
          style={{
            fontSize: "9px",
            letterSpacing: "0.14em",
            color: "#8892a4",
            marginBottom: "6px",
            flexBasis: "100%",
          }}
        >
          All listed providers meet every one of the following standards
        </div>

        {trustItems.map((item, index) => {
          const isOdd = (index + 1) % 2 === 1;
          const iconBg = isOdd
            ? "rgba(34,192,212,0.12)"
            : "rgba(231,13,105,0.1)";
          const iconColor = isOdd ? "#22c0d4" : "#e70d69";

          return (
            <React.Fragment key={item.label}>
              {index > 0 && (
                <div
                  className="hidden sm:block"
                  style={{
                    width: "1px",
                    height: "18px",
                    backgroundColor: "#d8dce6",
                  }}
                />
              )}
              <div className="flex items-center" style={{ gap: "7px" }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "9999px",
                    backgroundColor: iconBg,
                    color: iconColor,
                    fontSize: "13px",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className="font-sans font-bold"
                  style={{ fontSize: "11px", color: "#081129" }}
                >
                  {item.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AccreditedProvidersBar;
