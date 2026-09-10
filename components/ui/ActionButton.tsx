"use client";

interface ActionButtonProps {
  label: string;
  color: string;
  onClick: () => void;
  fullWidth?: boolean;
  /** Defaults to false, so existing callers are unaffected. */
  disabled?: boolean;
  /** Native tooltip, used to say why a disabled button is disabled. */
  title?: string;
}

export function ActionButton({
  label,
  color,
  onClick,
  fullWidth,
  disabled = false,
  title,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      // The tooltip is the only explanation a disabled button can give, so it
      // is also exposed to assistive technology rather than left visual-only.
      aria-label={disabled && title ? `${label} — ${title}` : undefined}
      style={{
        flex: fullWidth ? undefined : 1,
        width: fullWidth ? "100%" : undefined,
        padding: "9px 12px",
        background: "transparent",
        border: `1px solid ${color}${disabled ? "22" : "55"}`,
        color,
        // Dimmed rather than greyed out: the button keeps its identity, so it
        // still reads as "COMPLETE, not available yet" rather than as chrome.
        opacity: disabled ? 0.35 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.06em",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        // No hover feedback while disabled — a button that lights up under the
        // cursor reads as clickable no matter what the cursor says.
        if (disabled) return;
        (e.currentTarget as HTMLButtonElement).style.background = color + "22";
        (e.currentTarget as HTMLButtonElement).style.borderColor = color + "99";
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        (e.currentTarget as HTMLButtonElement).style.borderColor = color + "55";
      }}
    >
      {label}
    </button>
  );
}
