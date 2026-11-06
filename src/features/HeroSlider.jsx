import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { slides as fallbackSlides } from "../data/slides.js";

const HERO_VALUES = ["Tận tâm", "Minh bạch", "Chuyên nghiệp"];

export function HeroSlider({ hero = {}, slides = [] }) {
  const items = (slides || [])
    .map((slide, index) => ({
      caption: slide.caption || fallbackSlides[index]?.caption || "",
      image: slide.image || fallbackSlides[index]?.image || "",
    }))
    .filter((slide) => slide.image);
  const gallery = items.length ? items : fallbackSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setCurrentSlide(0);
  }, [gallery.length]);

  useEffect(() => {
    if (paused || gallery.length < 2) return undefined;
    const timer = setInterval(
      () => setCurrentSlide((index) => (index + 1) % gallery.length),
      4200,
    );
    return () => clearInterval(timer);
  }, [paused, currentSlide, gallery.length]);

  const primary = hero.primaryButton || {};
  const secondary = hero.secondaryButton || {};
  const goPrev = () =>
    setCurrentSlide((index) => (index - 1 + gallery.length) % gallery.length);
  const goNext = () =>
    setCurrentSlide((index) => (index + 1) % gallery.length);

  return (
    <section className="page-hero hero-layout-split">
      <div className="wrap hero-split-grid">
        <div className="hero-content">
          <h1>{hero.title}</h1>
          <p>{hero.subtitle}</p>
          <div className="hero-actions">
            {primary.label ? (
              <Link
                className="btn btn-gold hero-cta-primary"
                to={primary.href || "/lien-he"}
              >
                <span>{String(primary.label).replace(/\s*[↗→]+$/u, "")}</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
            ) : null}
            {secondary.label ? (
              <Link
                className="btn btn-ghost-light hero-cta-secondary"
                to={secondary.href || "/gioi-thieu"}
              >
                {secondary.label}
              </Link>
            ) : null}
          </div>
          <div className="hero-ornament-bar" aria-label="Giá trị công ty">
            {HERO_VALUES.flatMap((value, index) =>
              index === 0
                ? [<span key={value}>{value}</span>]
                : [
                    <span className="diamond" aria-hidden="true" key={`${value}-d`}>
                      ◆
                    </span>,
                    <span key={value}>{value}</span>,
                  ],
            )}
          </div>
        </div>

        <div className="hero-slider-wrapper">
          <div
            className="hero-slider"
            id="heroSlider"
            aria-roledescription="carousel"
            aria-label="Hình ảnh tiêu biểu"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setPaused(false);
            }}
          >
            <div className="hero-slides">
              {gallery.map((slide, index) => (
                <div
                  className={`hero-slide${index === currentSlide ? " active" : ""}`}
                  key={`${slide.image}-${index}`}
                  aria-hidden={index !== currentSlide}
                >
                  <img
                    className="hero-slide-img"
                    src={slide.image}
                    alt={slide.caption}
                    fetchPriority={index === 0 ? "high" : undefined}
                  />
                  {slide.caption ? (
                    <div className="hero-slide-caption">
                      <span>{slide.caption}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  className="hero-slider-btn prev"
                  aria-label="Ảnh trước"
                  onClick={goPrev}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="hero-slider-btn next"
                  aria-label="Ảnh sau"
                  onClick={goNext}
                >
                  ›
                </button>
                <div className="hero-slider-dots" aria-label="Chọn ảnh">
                  {gallery.map((slide, index) => (
                    <button
                      key={`${slide.image}-dot-${index}`}
                      type="button"
                      className={`slider-dot${index === currentSlide ? " active" : ""}`}
                      aria-label={`Ảnh ${index + 1}`}
                      aria-pressed={index === currentSlide}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
