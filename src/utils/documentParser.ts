import mammoth from 'mammoth';

export interface ParsedDocument {
  name: string;
  type: 'word' | 'pdf' | 'image' | 'text';
  mimeType: string;
  text: string;
  dataUrl?: string;
  sizeBytes: number;
}

/**
 * Parses user-uploaded files:
 * - Word documents (.docx) via mammoth text extraction
 * - Images (.png, .jpg, .webp) via FileReader base64
 * - PDFs (.pdf) via client-side text extractor or base64
 * - Text (.txt, .md) via readAsText
 */
export async function parseUploadedFile(file: File): Promise<ParsedDocument> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const sizeBytes = file.size;

  // 1. Word Document (.docx)
  if (extension === 'docx' || file.type.includes('wordprocessingml')) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value || '';
    return {
      name: file.name,
      type: 'word',
      mimeType: file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      text: text.trim() || `[Word Document: ${file.name}]`,
      sizeBytes,
    };
  }

  // 2. Picture / Image (.png, .jpg, .jpeg, .webp)
  if (file.type.startsWith('image/')) {
    const dataUrl = await readFileAsDataURL(file);
    return {
      name: file.name,
      type: 'image',
      mimeType: file.type,
      text: `[Image: ${file.name} - sent to Gemini Multimodal Vision for text extraction and visual analysis]`,
      dataUrl,
      sizeBytes,
    };
  }

  // 3. PDF Document (.pdf)
  if (extension === 'pdf' || file.type === 'application/pdf') {
    const dataUrl = await readFileAsDataURL(file);
    // Simple text extraction from PDF stream if text is uncompressed, otherwise pass dataUrl
    const buffer = await file.arrayBuffer();
    const rawText = new TextDecoder().decode(buffer);
    const textMatches = rawText.match(/\(([^)]+)\)\s*Tj/g) || [];
    const extractedStream = textMatches
      .map((m) => m.replace(/^\(/, '').replace(/\)\s*Tj$/, ''))
      .join(' ')
      .trim();

    return {
      name: file.name,
      type: 'pdf',
      mimeType: 'application/pdf',
      text: extractedStream.length > 50 ? extractedStream : `[PDF Document: ${file.name}]`,
      dataUrl,
      sizeBytes,
    };
  }

  // 4. Plain Text / Markdown (.txt, .md, .csv)
  const text = await readFileAsText(file);
  return {
    name: file.name,
    type: 'text',
    mimeType: file.type || 'text/plain',
    text,
    sizeBytes,
  };
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
