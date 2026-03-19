import clsx from "clsx";

import animations from "./animations.module.css";

function highlightLastWord(line: string, accentClassName: string) {
  const parts = line.match(/^(.*?)(\s+[^\s]+[.!?]?)$/);

  if (!parts) {
    return line;
  }

  const [, leadText, highlightText] = parts;

  return (
    <>
      {leadText}
      <span className={accentClassName}>{highlightText}</span>
    </>
  );
}

export function renderHeroHeadline(headline: string, isActive: boolean) {
  return headline.split("\n").map((line, index) => (
    <span
      key={`${line}-${index}`}
      className={clsx(
        "block overflow-hidden",
        animations.heroHeadlineLine,
        isActive && animations.heroHeadlineLineVisible,
      )}
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {highlightLastWord(line.trim(), "ll-text-gold")}
    </span>
  ));
}

export function renderPackageHeadline(headline: string) {
  const match = headline.match(/^(.*?)(\s+Guarantee)(\s+Package)?$/);

  if (!match) {
    return headline;
  }

  const [, leadText, highlightedWord, trailingText = ""] = match;

  return (
    <>
      {leadText}
      <span className="ll-text-gold">
        {highlightedWord}
      </span>
      {trailingText}
    </>
  );
}

export function renderGlobalHeadline(headline: string) {
  const match = headline.match(/^(.*?)(\s+Global)$/);

  if (!match) {
    return headline;
  }

  const [, leadText, highlightedWord] = match;

  return (
    <>
      {leadText}
      <span className="ll-text-gold">
        {highlightedWord}
      </span>
    </>
  );
}
