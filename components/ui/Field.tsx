"use client";
import { BG3, BORDER, DIM } from "@/lib/constants";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  /**
   * Marks the value as a credential-like secret. Defaults to true for
   * `type="password"`, which is the only way this field is used for secrets
   * today; pass it explicitly if a non-password field ever holds one.
   *
   * A secret field suppresses password-manager capture and the browser's own
   * autofill, and opts out of spellcheck — a spellchecker may send its input
   * to a remote service, which is not somewhere an HMAC key should go.
   *
   * NOTE: a value entered here must never reach logging, error reporting or a
   * query cache. See the callers in TransactionsTab.tsx.
   */
  secret?: boolean;
  /** Overrides the derived value when a caller needs something specific. */
  autoComplete?: string;
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  secret = type === "password",
  autoComplete,
}: FieldProps) {
  // "off" is widely ignored by browsers on password inputs; "new-password" is
  // the value they actually honour to suppress an autofill or save prompt.
  const resolvedAutoComplete = autoComplete ?? (secret ? "new-password" : "off");

  return (
    <div>
      <div
        style={{
          fontSize: 9,
          color: DIM,
          fontFamily: "'IBM Plex Mono', monospace",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={resolvedAutoComplete}
        spellCheck={secret ? false : undefined}
        autoCorrect={secret ? "off" : undefined}
        autoCapitalize={secret ? "off" : undefined}
        // Vendor opt-outs for the two most common password managers, which
        // ignore autoComplete on their own heuristics.
        data-1p-ignore={secret ? "" : undefined}
        data-lpignore={secret ? "true" : undefined}
        data-form-type={secret ? "other" : undefined}
        style={{
          width: "100%",
          background: BG3,
          border: `1px solid ${BORDER}`,
          color: "#eee",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          padding: "7px 10px",
          outline: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(245,166,35,0.45)")}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      />
    </div>
  );
}
