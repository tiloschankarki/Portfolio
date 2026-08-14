import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar, ExternalLink, X } from "lucide-react";

import { API_BASE_URL } from "../apiConfig";
import {
  ALL_AREAS,
  filterResearchEntries,
  getContentExcerpt,
  getEntryActions,
  getResearchAreas,
} from "../researchArchive";
import "./Blog.css";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const Blog = () => {
  const [entries, setEntries] = useState([]);
  const [selectedArea, setSelectedArea] = useState(ALL_AREAS);
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/blog/`);
      if (!response.ok) {
        throw new Error(`Research archive request failed: ${response.status}`);
      }
      setEntries(await response.json());
    } catch (requestError) {
      console.error("Error fetching research archive:", requestError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const researchAreas = useMemo(() => getResearchAreas(entries), [entries]);
  const visibleEntries = useMemo(
    () => filterResearchEntries(entries, selectedArea),
    [entries, selectedArea]
  );

  const selectArea = (area) => {
    setSelectedArea(area);
    setExpandedEntryId(null);
  };

  return (
    <main
      className="research-archive"
      style={{ backgroundImage: "url('/1.jpg')" }}
    >
      <div className="research-archive__overlay" />
      <div className="research-archive__container">
        <header className="research-archive__header">
          <p className="research-archive__eyebrow">Ideas, inquiry, and ongoing work</p>
          <h1>Research Areas &amp; Interests</h1>
          <p className="research-archive__intro">
            An evolving archive of my papers, proposals, research notes, and
            longer-form writing.
          </p>
        </header>

        {!loading && !error && entries.length > 0 && (
          <nav className="research-filters" aria-label="Filter by research area">
            {researchAreas.map((area) => (
              <button
                key={area}
                type="button"
                className={
                  area === selectedArea
                    ? "research-filter research-filter--active"
                    : "research-filter"
                }
                aria-pressed={area === selectedArea}
                onClick={() => selectArea(area)}
              >
                {area}
              </button>
            ))}
          </nav>
        )}

        {loading && (
          <div className="research-state" role="status">
            Loading research work…
          </div>
        )}

        {!loading && error && (
          <div className="research-state research-state--error" role="alert">
            <p>We could not load research work right now.</p>
            <button type="button" onClick={loadEntries}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="research-state">Research work coming soon.</div>
        )}

        {!loading && !error && entries.length > 0 && visibleEntries.length === 0 && (
          <div className="research-state">
            <p>No work is available in this research area yet.</p>
            <button type="button" onClick={() => selectArea(ALL_AREAS)}>
              Show all
            </button>
          </div>
        )}

        {!loading && !error && visibleEntries.length > 0 && (
          <section className="research-list" aria-label="Research archive entries">
            {visibleEntries.map((entry) => {
              const { canRead, canViewPdf } = getEntryActions(entry);
              const isExpanded = expandedEntryId === entry.id;

              return (
                <article className="research-entry" key={entry.id}>
                  <div className="research-entry__date">
                    <Calendar aria-hidden="true" size={16} />
                    <time dateTime={entry.created_at}>{formatDate(entry.created_at)}</time>
                  </div>

                  <div className="research-entry__body">
                    <div className="research-entry__labels">
                      <span className="research-label research-label--type">
                        {entry.content_type}
                      </span>
                      <span className="research-label research-label--status">
                        {entry.status}
                      </span>
                      {entry.research_area && (
                        <span className="research-label research-label--area">
                          {entry.research_area}
                        </span>
                      )}
                    </div>

                    <h2>{entry.title}</h2>
                    <p className="research-entry__summary">
                      {getContentExcerpt(entry.content)}
                    </p>

                    <div className="research-entry__actions">
                      {canRead && (
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? "Close" : "Read"} ${entry.title}`}
                          onClick={() =>
                            setExpandedEntryId(isExpanded ? null : entry.id)
                          }
                        >
                          {isExpanded ? "Close" : "Read"}
                          {isExpanded ? (
                            <X aria-hidden="true" size={16} />
                          ) : (
                            <ArrowRight aria-hidden="true" size={16} />
                          )}
                        </button>
                      )}

                      {canViewPdf && (
                        <a
                          href={entry.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Follow the document for ${entry.title}`}
                        >
                          View PDF
                          <ExternalLink aria-hidden="true" size={15} />
                        </a>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="research-entry__content">
                        {entry.content}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

export default Blog;
