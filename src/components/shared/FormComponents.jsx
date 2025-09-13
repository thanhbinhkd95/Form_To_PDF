// Reusable form components
export function Label({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 15,
        marginBottom: 8,
        color: "#1e3a8a",
        fontWeight: 700,
        letterSpacing: "0.3px",
        textTransform: "none",
      }}
    >
      {children}
    </label>
  );
}

export function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <div
      className="error-message"
      style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}
    >
      {error}
    </div>
  );
}

export function Input({
  type = "text",
  value,
  onChange,
  placeholder,
  ...rest
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="form-control"
      {...rest}
    />
  );
}

export function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="form-control"
      style={{ minHeight: 96 }}
    />
  );
}

export function YesNo({ value, onChange }) {
  return (
    <div className="yesno-line">
      <button
        type="button"
        className={value === "Yes" ? "active" : ""}
        onClick={() => onChange("Yes")}
      >
        Yes
      </button>
      <button
        type="button"
        className={value === "No" ? "active" : ""}
        onClick={() => onChange("No")}
      >
        No
      </button>
    </div>
  );
}

export function Section({ title }) {
  return <h3 className="section-title">{title}</h3>;
}

export function Row({ children, cols = 2 }) {
  return (
    <div
      className="grid-2"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 16,
        // Mobile responsive: stack columns on small screens
        "@media (max-width: 768px)": {
          gridTemplateColumns: "1fr",
        },
      }}
    >
      {children}
    </div>
  );
}
