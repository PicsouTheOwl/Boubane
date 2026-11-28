import { ImageResponse } from "next/og";

export const alt =
  "Boubane — Sites vitrines sur-mesure à 0 € & Automatisations IA à prix fixe";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAF8F5",
          color: "#0C0A08",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#ED5B04",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              B
            </div>
            <span
              style={{
                fontSize: "26px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              BOUBANE
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(12, 10, 8, 0.1)",
              fontSize: "18px",
              fontWeight: 600,
              color: "#0E7541",
            }}
          >
            <span>●</span>
            <span>Création vitrine offerte · 0 €</span>
          </div>
        </div>

        {/* Center headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              fontSize: "66px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: "#0C0A08",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Des vitrines d’exception à 0 €. L’IA branchée sur vos outils.
          </div>
          <div
            style={{
              fontSize: "27px",
              lineHeight: 1.4,
              color: "#57534E",
              maxWidth: "860px",
            }}
          >
            Livré en 5 jours ouvrés · Code source 100 % à votre nom · Sans abonnement ni engagement.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "28px",
            borderTop: "1px solid rgba(12, 10, 8, 0.1)",
            fontSize: "20px",
            color: "#57534E",
          }}
        >
          <span style={{ fontWeight: 700, color: "#0C0A08" }}>
            www.boubane.com
          </span>
          <span>Léo Saillour · Segré-en-Anjou Bleu (49) &amp; France</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
