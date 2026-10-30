/**
 * supabaseService.ts
 *
 * Provides CRUD access to suspect records stored in Supabase.
 */

import { supabase } from '../src/integrations/supabase/client';

export type SuspectCategory = 'known_offender' | 'missing_person' | 'person_of_interest' | 'generated_sketch';

export interface SuspectRecord {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: SuspectCategory;
  gender: 'male' | 'female' | 'unknown';
  created_at: string;
}

export interface MatchResult {
  suspect: SuspectRecord;
  match: boolean;
  confidence_score: number;
}

const CATEGORY_LABEL: Record<SuspectCategory, string> = {
  known_offender: 'Known Offender',
  missing_person: 'Missing Person',
  person_of_interest: 'Person of Interest',
  generated_sketch: 'Generated Sketch',
};

export { CATEGORY_LABEL };

/** Fetch all suspect records from the database. */
export async function listSuspects(): Promise<SuspectRecord[]> {
  const { data, error } = await supabase
    .from('suspects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to load suspects: ${error.message}`);
  return (data ?? []) as SuspectRecord[];
}

/** Fetch a single suspect by ID. */
export async function getSuspect(id: string): Promise<SuspectRecord> {
  const { data, error } = await supabase
    .from('suspects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(`Failed to fetch suspect: ${error.message}`);
  return data as SuspectRecord;
}

/** Create a new suspect record with an optional photo. */
export async function createSuspect(
  name: string,
  description: string,
  photo: File | null,
  category: SuspectCategory = 'person_of_interest',
  gender: 'male' | 'female' | 'unknown' = 'unknown'
): Promise<SuspectRecord> {
  let image_url = '';

  if (photo) {
    const fileExt = photo.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `suspect_photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('forensic_images')
      .upload(filePath, photo);

    if (uploadError) {
      throw new Error(`Failed to upload photo: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('forensic_images')
      .getPublicUrl(filePath);

    image_url = publicUrlData.publicUrl;
  }

  const { data, error } = await supabase
    .from('suspects')
    .insert([{ name, description, image_url, category, gender }])
    .select()
    .single();

  if (error) throw new Error(`Failed to save suspect: ${error.message}`);

  return data as SuspectRecord;
}

/** Update an existing suspect record. */
export async function updateSuspect(
  id: string,
  name?: string,
  description?: string,
  photo?: File | null,
  category?: SuspectCategory,
  gender?: 'male' | 'female' | 'unknown'
): Promise<SuspectRecord> {
  const updateData: Partial<SuspectRecord> = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (category !== undefined) updateData.category = category;
  if (gender !== undefined) updateData.gender = gender;

  if (photo) {
    const fileExt = photo.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `suspect_photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('forensic_images')
      .upload(filePath, photo);

    if (uploadError) {
      throw new Error(`Failed to upload photo: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('forensic_images')
      .getPublicUrl(filePath);

    updateData.image_url = publicUrlData.publicUrl;
  }

  const { data, error } = await supabase
    .from('suspects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update suspect: ${error.message}`);

  return data as SuspectRecord;
}

/** Delete a suspect record and its associated photo from Supabase Storage. */
export async function deleteSuspect(id: string): Promise<void> {
  const { data: suspect } = await supabase
    .from('suspects')
    .select('image_url')
    .eq('id', id)
    .single();

  if (suspect?.image_url) {
    try {
      const urlObj = new URL(suspect.image_url);
      const pathParts = urlObj.pathname.split('/public/forensic_images/');
      if (pathParts.length > 1) {
        await supabase.storage.from('forensic_images').remove([pathParts[1]]);
      }
    } catch (e) {
      console.warn('Failed to delete photo from storage', e);
    }
  }

  const { error } = await supabase.from('suspects').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete suspect: ${error.message}`);
}

/**
 * Detect the perceived gender of the person in an image.
 * Calls the backend CLIP-based gender classifier.
 * Returns 'male' | 'female' | 'unknown'
 */
export async function detectGender(imageUrl: string): Promise<string> {
  try {
    const res = await fetch('http://localhost:8000/api/detect-gender', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl }),
    });
    if (!res.ok) return 'unknown';
    const data = await res.json();
    console.log(`[Gender] Detected: ${data.gender} (${data.confidence}%)`);
    return data.gender ?? 'unknown';
  } catch {
    return 'unknown';
  }
}


export async function scanSketchAgainstDatabase(
  sketchUrl: string,
  onProgress?: (done: number, total: number) => void
): Promise<MatchResult[]> {
  const suspects = await listSuspects();
  const withImages = suspects.filter(s => !!s.image_url);

  // ── Step 0: detect sketch gender once, send as hint to every comparison ──
  console.log('[Scan] Detecting sketch gender before scan...');
  const sketchGender = await detectGender(sketchUrl);
  console.log(`[Scan] Sketch gender resolved to: "${sketchGender}"`);

  const results: MatchResult[] = [];

  for (let i = 0; i < withImages.length; i++) {
    const suspect = withImages[i];
    onProgress?.(i, withImages.length);

    try {
      // If both genders are known and they mismatch, skip the API call entirely
      // and return a 0-score result — saves backend time.
      const suspectGender = suspect.gender ?? 'unknown';
      if (
        sketchGender !== 'unknown' &&
        suspectGender !== 'unknown' &&
        sketchGender !== suspectGender
      ) {
        console.log(`[Scan] Skipping ${suspect.name} — gender mismatch (sketch:${sketchGender} vs db:${suspectGender})`);
        results.push({ suspect, match: false, confidence_score: 0 });
        continue;
      }

      const res = await fetch('http://localhost:8000/api/compare-faces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sketch_url: sketchUrl,
          real_image_url: suspect.image_url,
          // Provide the sketch gender hint so the backend skips its own
          // detection step (saves 1 CLIP inference per candidate).
          sketch_gender: sketchGender !== 'unknown' ? sketchGender : undefined,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      results.push({
        suspect,
        match: data.match ?? false,
        confidence_score: data.confidence_score ?? 0,
      });
    } catch (err) {
      console.error(`Comparison failed for suspect ${suspect.id}:`, err);
      // Still include it with 0 score so we don't silently skip
      results.push({ suspect, match: false, confidence_score: 0 });
    }

  }

  onProgress?.(withImages.length, withImages.length);

  // Sort highest confidence first
  return results.sort((a, b) => b.confidence_score - a.confidence_score);
}

