export function OGError() {
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
        gap: 32,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#10B981", fontSize: 24, fontWeight: 700 }}>
          &gt;
        </span>
        <span
          style={{
            color: "#E5E5E5",
            fontSize: 20,
            fontFamily: "JetBrains Mono",
          }}
        >
          devroast
        </span>
      </div>

      <span style={{ color: "#EF4444", fontSize: 32, fontWeight: 700 }}>
        404
      </span>
      <span
        style={{ color: "#737373", fontSize: 20, fontFamily: "JetBrains Mono" }}
      >
        Roast not found
      </span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 24px",
          borderRadius: 8,
          border: "1px solid #2A2A2A",
        }}
      >
        <span
          style={{
            color: "#737373",
            fontSize: 14,
            fontFamily: "JetBrains Mono",
          }}
        >
          ← Go to home
        </span>
      </div>
    </div>
  );
}
