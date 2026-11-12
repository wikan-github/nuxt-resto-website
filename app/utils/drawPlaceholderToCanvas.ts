export type PlaceholderTitleFormat = 'uppercase' | 'lowercase' | 'title-case';

export type PlaceholderOptions = {
     backgroundColor?: string;
     title?: string;
     titleFormat?: PlaceholderTitleFormat;
     titleColor?: string;
};

function escapeXml(value: string): string {
     return value.replace(/[&<>"']/g, (character) => {
          const entities: Record<string, string> = {
               '&': '&amp;',
               '<': '&lt;',
               '>': '&gt;',
               '"': '&quot;',
               "'": '&apos;',
          };
          return entities[character]!;
     });
}

function formatTitle(title: string, format: PlaceholderTitleFormat): string {
     if (format === 'uppercase') return title.toLocaleUpperCase();
     if (format === 'lowercase') return title.toLocaleLowerCase();

     return title.toLocaleLowerCase().replace(/(^|[\s-])\p{L}/gu, (match) => match.toLocaleUpperCase());
}

function wrapTitle(title: string, maxWidth: number, context: CanvasRenderingContext2D): string[] {
     const lines: string[] = [];
     let line = '';

     for (const word of title.trim().split(/\s+/).filter(Boolean)) {
          const candidate = line ? `${line} ${word}` : word;
          if (context.measureText(candidate).width <= maxWidth) {
               line = candidate;
               continue;
          }

          if (line) {
               lines.push(line);
               line = '';
          }

          let part = '';
          for (const character of Array.from(word)) {
               const candidatePart = part + character;
               if (part && context.measureText(candidatePart).width > maxWidth) {
                    lines.push(part);
                    part = character;
               } else {
                    part = candidatePart;
               }
          }
          line = part;
     }

     if (line || lines.length === 0) lines.push(line);
     return lines;
}

export async function drawPlaceholderToCanvas(
     img: HTMLImageElement,
     {
          backgroundColor = '#1f2a24',
          title = 'Image unavailable',
          titleFormat = 'title-case',
          titleColor = '#ffffff',
     }: PlaceholderOptions = {},
): Promise<string> {
     const width = Math.max(1, Math.round(img.clientWidth || 640));
     const height = Math.max(1, Math.round(img.clientHeight || 360));
     const safeBackgroundColor = escapeXml(backgroundColor);
     const safeTitleColor = escapeXml(titleColor);
     let titleFontSize = Math.max(12, Math.min(44, width * 0.055, height * 0.12));
     const canvas = document.createElement('canvas');
     canvas.width = width;
     canvas.height = height;
     const context = canvas.getContext('2d');
     if (!context) {
          throw new Error('Canvas 2D context is unavailable.');
     }

     const maxTitleWidth = width * 0.88;
     const maxTitleHeight = height * 0.6;
     let titleLines: string[];
     let lineHeight: number;
     do {
          context.font = `bold ${titleFontSize}px sans-serif`;
          titleLines = wrapTitle(formatTitle(title, titleFormat), maxTitleWidth, context);
          lineHeight = titleFontSize * 1.2;
          if (titleLines.length * lineHeight <= maxTitleHeight || titleFontSize <= 8) break;
          titleFontSize -= 1;
     } while (true);

     const titleStartY = (height - (titleLines.length - 1) * lineHeight) / 2;
     const titleMarkup = titleLines
          .map((line, index) => `<tspan x="${width / 2}"${index === 0 ? '' : ` dy="${lineHeight}"`}>${escapeXml(line)}</tspan>`)
          .join('');
     const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
               <rect width="${width}" height="${height}" fill="${safeBackgroundColor}"/>
               <g stroke="#3a5a4a" stroke-width="${Math.max(1, width * 0.0025)}" fill="none" opacity="0.8">
                    <path d="M0 ${height * 0.775} Q${width * 0.167} ${height * 0.7} ${width * 0.333} ${height * 0.75} T${width * 0.667} ${height * 0.7375} T${width} ${height * 0.75}"/>
                    <path d="M0 ${height * 0.825} Q${width * 0.167} ${height * 0.7625} ${width * 0.333} ${height * 0.80625} T${width * 0.667} ${height * 0.79375} T${width} ${height * 0.80625}"/>
                    <path d="M0 ${height * 0.875} Q${width * 0.167} ${height * 0.825} ${width * 0.333} ${height * 0.8625} T${width * 0.667} ${height * 0.85625} T${width} ${height * 0.86875}"/>
               </g>
               <text x="${width / 2}" y="${titleStartY}" font-family="sans-serif" font-size="${titleFontSize}" font-weight="bold" fill="${safeTitleColor}" text-anchor="middle" dominant-baseline="middle">${titleMarkup}</text>
          </svg>`;
     const svgImage = new Image();
     svgImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
     await svgImage.decode();

     context.drawImage(svgImage, 0, 0, width, height);
     
     //chose PNG for broad support and crisp, lossless text and lines
     //WebP is also supported by modern browsers and could make the data URL smaller, but for a simple placeholder the benefit may be small
     return canvas.toDataURL('image/png');
}
