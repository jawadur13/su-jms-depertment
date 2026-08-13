// Cloudinary serves files (including PDFs) with `Content-Disposition:
// inline` by default. The HTML `download` attribute on an <a> tag is
// silently ignored by browsers when the link is cross-origin — which
// res.cloudinary.com always is relative to this site — so a plain
// `<a href={pdfUrl} download>` just opens the file instead of
// downloading it. Cloudinary's `fl_attachment` delivery flag forces
// `Content-Disposition: attachment` at the server, which works
// regardless of origin. `filename` (optional) sets the downloaded
// file's name.
export function toDownloadUrl(url: string, filename?: string | null): string {
  const raw = (filename ?? '').trim();
  // Only strip a real trailing file extension — callers pass either an
  // actual filename ("Report.pdf") or a human title ("B.A. JMS
  // Prospectus"), and titles can contain their own periods that must
  // not be mistaken for one.
  const withoutExt = raw.replace(/\.(pdf|docx?|xlsx?|pptx?|png|jpe?g|webp)$/i, '');
  // "." is a delimiter inside a Cloudinary transformation segment, so
  // any punctuation left in the name breaks fl_attachment (e.g. "B.A"
  // → Cloudinary error "Invalid flag in transformation: A"). Keep only
  // characters that are safe there.
  const safe = withoutExt
    .replace(/[^a-zA-Z0-9 _-]+/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const flag = safe ? `fl_attachment:${encodeURIComponent(safe)}` : 'fl_attachment';
  return url.replace('/upload/', `/upload/${flag}/`);
}
