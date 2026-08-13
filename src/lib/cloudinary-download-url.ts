// Cloudinary serves files (including PDFs) with `Content-Disposition:
// inline` by default. The HTML `download` attribute on an <a> tag is
// silently ignored by browsers when the link is cross-origin — which
// res.cloudinary.com always is relative to this site — so a plain
// `<a href={pdfUrl} download>` just opens the file instead of
// downloading it. Cloudinary's `fl_attachment` delivery flag forces
// `Content-Disposition: attachment` at the server, which works
// regardless of origin. `filename` (optional) sets the downloaded
// file's name; pass it without an extension — Cloudinary appends the
// correct one automatically.
export function toDownloadUrl(url: string, filename?: string | null): string {
  const base = (filename ?? '').trim().replace(/\.[^./]+$/, '');
  const flag = base ? `fl_attachment:${encodeURIComponent(base)}` : 'fl_attachment';
  return url.replace('/upload/', `/upload/${flag}/`);
}
