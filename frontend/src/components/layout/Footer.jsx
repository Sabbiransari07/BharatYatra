import React from "react";

export default function Footer({ fixed = false }) {
  return (
    <footer className={`component-footer ${fixed ? "fixed" : ""}`}>
      <div>© 2026 BharatYatra - Student Innovation Project</div>
      <div>🇮🇳 Made in India | For India | By India</div>
      <div>TRAVEL • EXPLORE • EXPERIENCE • REPEAT</div>
    </footer>
  );
}
