import { html, useState } from '../../lib/html.js';
import SectionTitle from '../atoms/SectionTitle.js';

const FAQ = ({ content }) => {
  const [activeTab, setActiveTab] = useState(content.tabs[0]?.key || 'logistics');
  const [openIndex, setOpenIndex] = useState(null);

  const items = content.items.filter((item) => item.cat === activeTab);

  const handleTab = (key) => {
    setActiveTab(key);
    setOpenIndex(null);
  };

  const toggleOpen = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return html`
    <section id="faq" className="faq">
      <div className="faq-inner">
        <${SectionTitle} text=${content.title} className="reveal" />

        <div className="faq-tabs reveal" role="tablist">
          ${content.tabs.map((tab) => html`
            <button
              className=${`faq-tab ${activeTab === tab.key ? 'active' : ''}`.trim()}
              data-cat=${tab.key}
              role="tab"
              aria-selected=${activeTab === tab.key ? 'true' : 'false'}
              onClick=${() => handleTab(tab.key)}
            >
              ${tab.label}
            </button>
          `)}
        </div>

        <div className="faq-list stagger-children">
          ${items.map((item, index) => html`
            <div className=${`faq-item reveal ${openIndex === index ? 'open' : ''}`.trim()}>
              <button
                className="faq-question"
                aria-expanded=${openIndex === index ? 'true' : 'false'}
                onClick=${() => toggleOpen(index)}
              >
                ${item.question}
              </button>
              <div className="faq-answer">
                ${item.answer}
                ${item.link
                  ? html` <a href=${item.link.href} target="_blank" rel="noopener">${item.link.label}</a>.`
                  : null}
              </div>
            </div>
          `)}
        </div>
      </div>
    </section>
  `;
};

export default FAQ;
