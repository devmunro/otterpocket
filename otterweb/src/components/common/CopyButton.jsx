import { useState } from "react";

function CopyButton({ text, className = "copy-button" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1300);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button className={className} onClick={handleCopy} type="button">
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default CopyButton;
