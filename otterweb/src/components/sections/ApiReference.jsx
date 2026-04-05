import CopyButton from "../common/CopyButton.jsx";
import { apiMethods } from "../../data/siteContent.js";

function ApiReference() {
  return (
    <section className="section section-anchor" id="api">
      <div className="section-heading">
        <span className="eyebrow">API</span>
        <h2>API reference.</h2>
      </div>
      <div className="api-docs">
        {apiMethods.map((method) => (
          <article className="api-doc" key={method.name}>
            <h3>{method.name}</h3>
            <p>{method.description}</p>
            <ul className="api-list">
              {method.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <div className="snippet-head">
              <span>Copy-paste example</span>
              <CopyButton className="snippet-copy" text={method.code} />
            </div>
            <pre>
              <code>{method.code}</code>
            </pre>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ApiReference;
