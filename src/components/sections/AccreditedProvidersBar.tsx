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
        padding: "12px 16px",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "1280px" }}>
        {/* Top label */}
        <div
          className="w-full text-center font-sans font-bold uppercase"
          style={{
            fontSize: "11px",
            letterSpacing: "0.14em",
            color: "#4b5566",
            marginBottom: "12px",
          }}
        >
          All listed providers meet every one of the following standards
        </div>

        {/* Items row */}
        <div
          className="flex items-center justify-center flex-wrap"
          style={{ gap: "12px 24px" }}
        >
          {trustItems.map((item, index) => {
            const isOdd = (index + 1) % 2 === 1;
            const iconBg = isOdd
              ? "rgba(34,192,212,0.12)"
              : "rgba(231,13,105,0.1)";
            const iconColor = isOdd ? "#22c0d4" : "#e70d69";

            return (
              <div
                key={item.label}
                className="flex items-center whitespace-nowrap"
                style={{ gap: "10px" }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "9999px",
                    backgroundColor: iconBg,
                    color: iconColor,
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className="font-sans font-bold"
                  style={{ fontSize: "13px", color: "#081129" }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AccreditedProvidersBar;
