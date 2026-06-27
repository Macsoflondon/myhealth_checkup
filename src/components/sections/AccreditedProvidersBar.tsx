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
            fontSize: "9px",
            letterSpacing: "0.14em",
            color: "#8892a4",
            marginBottom: "6px",
          }}
        >
          All listed providers meet every one of the following standards
        </div>

        {/* Single-line items row */}
        <div
          className="flex items-center justify-center overflow-x-auto"
          style={{ gap: "6px 14px" }}
        >
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
                      height: "16px",
                      backgroundColor: "#d8dce6",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div
                  className="flex items-center whitespace-nowrap"
                  style={{ gap: "6px" }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "9999px",
                      backgroundColor: iconBg,
                      color: iconColor,
                      fontSize: "12px",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    className="font-sans font-bold"
                    style={{ fontSize: "10px", color: "#081129" }}
                  >
                    {item.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AccreditedProvidersBar;
