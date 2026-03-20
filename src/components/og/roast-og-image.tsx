import type { Roast } from "@/db/schema";

interface RoastOGImageProps {
  roast: Roast;
}

export function RoastOGImage({ roast }: RoastOGImageProps) {
  const verdictColors = {
    needs_serious_help: "#EF4444",
    rough_around_edges: "#F59E0B",
    decent_code: "#10B981",
    solid_work: "#10B981",
    exceptional: "#10B981",
  };

  const verdictLabels = {
    needs_serious_help: "needs_serious_help",
    rough_around_edges: "rough_around_edges",
    decent_code: "decent_code",
    solid_work: "solid_work",
    exceptional: "exceptional",
  };

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        backgroundColor: "#0C0C0C",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 64,
        gap: 28,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            color: "#10B981",
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "JetBrains Mono",
          }}
        >
          &gt;
        </span>
        <span
          style={{
            color: "#E5E5E5",
            fontSize: 20,
            fontWeight: 500,
            fontFamily: "JetBrains Mono",
          }}
        >
          devroast
        </span>
      </div>

      {/* Score */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
        <span
          style={{
            color: "#F59E0B",
            fontSize: 160,
            fontWeight: 900,
            fontFamily: "JetBrains Mono",
            lineHeight: 1,
          }}
        >
          {roast.score.toFixed(1)}
        </span>
        <span
          style={{
            color: "#737373",
            fontSize: 56,
            fontFamily: "JetBrains Mono",
            lineHeight: 1,
          }}
        >
          /10
        </span>
      </div>

      {/* Verdict */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: verdictColors[roast.verdict],
          }}
        />
        <span
          style={{
            color: verdictColors[roast.verdict],
            fontSize: 20,
            fontFamily: "JetBrains Mono",
          }}
        >
          {verdictLabels[roast.verdict]}
        </span>
      </div>

      {/* Lang Info */}
      <span
        style={{ color: "#737373", fontSize: 16, fontFamily: "JetBrains Mono" }}
      >
        lang: {roast.language} · {roast.lineCount} lines
      </span>

      {/* Quote */}
      <div style={{ maxWidth: "100%", textAlign: "center" }}>
        <span
          style={{
            color: "#E5E5E5",
            fontSize: 22,
            fontFamily: "IBM Plex Mono",
            lineHeight: 1.5,
          }}
        >
          &quot;{roast.roastQuote}&quot;
        </span>
      </div>
    </div>
  );
}
