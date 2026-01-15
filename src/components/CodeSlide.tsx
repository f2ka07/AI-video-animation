import React from "react";
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";

interface BaseProps {
  title: string;
  code: string;
  language?: string;
  logoSrc?: string;
  logoAlt?: string;
}

/**
 * 16:9 YouTube slide – big readable code, subtitle safe zone at bottom.
 */
export const CodeSlideYoutube: React.FC<BaseProps> = ({
  title,
  code,
  language = "typescript",
  logoSrc,
  logoAlt = "Logo",
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps * 0.25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(frame, [0, fps * 0.25], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Code appears faster and stays visible longer
  const codeOpacity = interpolate(frame, [fps * 0.1, fps * 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const codeY = interpolate(frame, [fps * 0.1, fps * 0.3], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        background:
          "radial-gradient(circle at top left, #020617 0%, #020617 45%, #000000 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: 64,
        boxSizing: "border-box",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
      }}
    >
      {/* top accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg, #38bdf8 0%, #6366f1 50%, #22c55e 100%)",
          opacity: 0.9,
        }}
      />

      {/* subtle texture */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.06,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #1f2937 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxWidth: 1700,
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontSize: 62,
              margin: 0,
              flex: 1,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              fontWeight: 700,
              letterSpacing: -0.01,
              color: "#e5e7eb",
            }}
          >
            {title}
          </h2>
          {logoSrc && (
            <img
              src={logoSrc}
              alt={logoAlt}
              style={{
                height: 60,
                objectFit: "contain",
                marginLeft: 28,
                opacity: titleOpacity,
                transform: `translateY(${titleY}px)`,
              }}
            />
          )}
        </div>

        {/* code */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "stretch",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: 1,
              maxWidth: 1600,
              opacity: codeOpacity,
              transform: `translateY(${codeY}px)`,
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(148, 163, 184, 0.35)",
              backgroundColor: "#020617",
              boxShadow:
                "0 22px 44px rgba(15, 23, 42, 0.95), 0 0 0 1px rgba(15,23,42,0.8)",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              maxHeight: "100%",
            }}
          >
            {/* window bar */}
            <div
              style={{
                height: 36,
                background:
                  "linear-gradient(90deg, #020617 0%, #111827 100%)",
                borderBottom: "1px solid rgba(51, 65, 85, 0.9)",
                display: "flex",
                alignItems: "center",
                paddingLeft: 16,
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#f97373",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#facc15",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                }}
              />
              <span
                style={{
                  marginLeft: 14,
                  fontSize: 18,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                }}
              >
                {language}
              </span>
            </div>

            <div style={{ flex: 1, overflow: "hidden", minHeight: 0, maxHeight: "100%", display: "flex", alignItems: "center" }}>
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "24px 32px 24px 32px",
                  fontSize: 38,
                  lineHeight: "1.15",
                  backgroundColor: "#020617",
                  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                  overflowX: "visible",
                  overflowY: "visible",
                  fontWeight: 400,
                  WebkitFontSmoothing: "antialiased",
                  MozOsxFontSmoothing: "grayscale",
                  textRendering: "optimizeLegibility",
                  color: "#e5e7eb",
                }}
                codeTagProps={{
                  style: {
                    lineHeight: "1.15",
                  },
                }}
                showLineNumbers
                lineNumberStyle={{
                  fontSize: 38,
                  paddingRight: 24,
                  color: "#6b7280",
                  fontWeight: 400,
                  lineHeight: "1.15",
                }}
              >
                {code.trim()}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 9:16 Shorts / Reels code slide – code centered, no line numbers.
 */
export const CodeSlideShorts: React.FC<BaseProps> = ({
  title,
  code,
  language = "typescript",
  logoSrc,
  logoAlt = "Logo",
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const blockOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const blockY = interpolate(frame, [0, fps * 0.4], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        background:
          "radial-gradient(circle at top, #020617 0%, #020617 40%, #000000 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: 40,
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
      }}
    >
      {/* texture */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #111827 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* top label + logo */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 20,
            textTransform: "uppercase",
            letterSpacing: 1.6,
            color: "#9ca3af",
            maxWidth: "70%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
        {logoSrc && (
          <img
            src={logoSrc}
            alt={logoAlt}
            style={{
              height: 36,
              objectFit: "contain",
              marginLeft: 10,
            }}
          />
        )}
      </div>

      {/* center code block for 9:16 */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            maxHeight: "100%",
            opacity: blockOpacity,
            transform: `translateY(${blockY}px)`,
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid rgba(148, 163, 184, 0.45)",
            backgroundColor: "#020617",
            boxShadow:
              "0 22px 50px rgba(0,0,0,0.95), 0 0 0 1px rgba(15,23,42,0.9)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              height: 30,
              background:
                "linear-gradient(90deg, #020617 0%, #111827 100%)",
              borderBottom: "1px solid rgba(55,65,81,0.9)",
              display: "flex",
              alignItems: "center",
              paddingLeft: 14,
            }}
          >
            <span
              style={{
                fontSize: 16,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              {language}
            </span>
          </div>

          <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "20px 28px 20px 28px",
                fontSize: 28,
                lineHeight: "1.15",
                backgroundColor: "#020617",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                overflowX: "visible",
                overflowY: "visible",
                fontWeight: 400,
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
                textRendering: "optimizeLegibility",
                color: "#e5e7eb",
              }}
              codeTagProps={{
                style: {
                  lineHeight: "1.15",
                },
              }}
              showLineNumbers={false}
            >
              {code.trim()}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Default export for backward compatibility - uses YouTube format
 */
export const CodeSlide: React.FC<BaseProps> = (props) => {
  return <CodeSlideYoutube {...props} />;
};
