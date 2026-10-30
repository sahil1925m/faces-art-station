-- Run this SQL in your Supabase SQL Editor:
-- Dashboard → SQL Editor → New query → paste this → Run

-- Step 1: Add the gender column (skip if already added)
ALTER TABLE suspects
  ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'unknown'
  CHECK (gender IN ('male', 'female', 'unknown'));

-- (Optional) index for faster gender filtering
CREATE INDEX IF NOT EXISTS suspects_gender_idx ON suspects (gender);

-- Step 2: Set ALL existing suspects to 'male'
UPDATE suspects SET gender = 'male' WHERE gender = 'unknown' OR gender IS NULL;

-- Verify
SELECT id, name, gender FROM suspects ORDER BY created_at DESC;
