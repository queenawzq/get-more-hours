-- Async generation + OCR status tracking on documents.
-- Enables the UI to render generating / failed / ready states and show errors.

ALTER TABLE documents
  ADD COLUMN generation_status TEXT
    CHECK (generation_status IN ('pending', 'generating', 'ready', 'failed')),
  ADD COLUMN generation_error TEXT,
  ADD COLUMN ocr_status TEXT
    CHECK (ocr_status IN ('pending', 'processing', 'ready', 'failed')),
  ADD COLUMN ocr_error TEXT;

-- Backfill existing rows so they don't appear mid-flight in the UI.
UPDATE documents
  SET generation_status = 'ready'
  WHERE type = 'generated' AND content IS NOT NULL;

UPDATE documents
  SET ocr_status = 'ready'
  WHERE ocr_text IS NOT NULL;
