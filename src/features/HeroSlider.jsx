import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { slides as fallbackSlides } from "../data/slides.js";

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
      3200,
    );
    return () => clearInterval(timer);
  }, [paused, currentSlide, gallery.length]);

  const primary = hero.primaryButton || {};
  const secondary = hero.secondaryButton || {};

  return (
    <div className="hero">
      <div
        className="hero-slider"
        id="heroSlider"
        aria-label="Hình ảnh tiêu biểu"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setPaused(false);
        }}
      >
        <div
          className="hero-slides"
          id="heroSlidesTrack"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {gallery.map((slide, index) => (
            <div
              className="hero-slide"
              key={`${slide.image}-${index}`}
              aria-hidden={index !== currentSlide}
            >
              <img
                src={slide.image}
                alt={slide.caption}
                fetchPriority={index === 0 ? "high" : undefined}
              />
            </div>
          ))}
        </div>
        <div className="slider-controls">
          <span className="caption" id="sliderCaption">
            Ảnh: {gallery[currentSlide]?.caption}
          </span>
          <div className="slider-dots" aria-label="Chọn ảnh">
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
        </div>
      </div>
      <div className="wrap">
        <div className="herotext">
          <h1>{hero.title}</h1>
          <p>{hero.subtitle}</p>
          <div className="actions">
            {primary.label ? (
              <Link className="btn light" to={primary.href || "/lien-he"}>
                {primary.label}
              </Link>
            ) : null}
            {secondary.label ? (
              <Link className="textlink" to={secondary.href || "/gioi-thieu"}>
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
