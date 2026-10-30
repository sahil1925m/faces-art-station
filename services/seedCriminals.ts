/**
 * seedCriminals.ts
 *
 * Run this once from the browser console or as a one-off script to seed
 * all local criminal images into the Supabase 'suspects' table.
 *
 * Usage: Import and call seedCriminals() from a temporary button, or
 * paste into browser console after importing supabase client.
 */

import { supabase } from '../src/integrations/supabase/client';

interface CriminalSeed {
  localPath: string;   // path relative to /public
  name: string;
  description: string;
  category: 'known_offender' | 'missing_person' | 'person_of_interest';
}

const CRIMINALS: CriminalSeed[] = [
  {
    localPath: '/criminals/mini (1).webp',
    name: 'Marcus T. Webb',
    description: 'Male, early 40s. Stocky build, shaved head, prominent jaw. Known for armed robbery. Last seen in downtown district.',
    category: 'known_offender',
  },
  {
    localPath: '/criminals/mini (2).webp',
    name: 'Derek J. Holt',
    description: 'Male, mid 30s. Medium build, dark complexion, close-cropped beard. Wanted for aggravated assault.',
    category: 'known_offender',
  },
  {
    localPath: '/criminals/mini (3).webp',
    name: 'Unknown Subject #03',
    description: 'Male, late 20s. Thin build, light complexion. Person of interest in a series of break-ins in the northwest precinct.',
    category: 'person_of_interest',
  },
  {
    localPath: '/criminals/mini (4).webp',
    name: 'Leon A. Ruiz',
    description: 'Male, mid 40s. Heavy build, dark hair with streaks of grey. Prior convictions for fraud and identity theft.',
    category: 'known_offender',
  },
  {
    localPath: '/criminals/mini (5).webp',
    name: 'Unknown Subject #05',
    description: 'Male, approximately 30s. Witness described a tattoo on the left side of the neck. Person of interest in Case #2024-0031.',
    category: 'person_of_interest',
  },
  {
    localPath: '/criminals/mini (6).webp',
    name: 'Sarah L. Okafor',
    description: 'Female, early 30s. Slim build, distinctive facial scar above right eyebrow. Wanted for questioning related to a narcotics investigation.',
    category: 'person_of_interest',
  },
  {
    localPath: '/criminals/mini (7).webp',
    name: 'James P. Novak',
    description: 'Male, late 50s. Grey hair, heavy build. Known associate of the Westside syndicate. Prior record for extortion.',
    category: 'known_offender',
  },
  {
    localPath: '/criminals/mini (8).webp',
    name: 'Missing: Aiden Cole',
    description: 'Male, 19 years old. Last seen near Riverside Park wearing a blue hoodie. Family has filed a missing persons report.',
    category: 'missing_person',
  },
  {
    localPath: '/criminals/mini (9).webp',
    name: 'Missing: Priya Sharma',
    description: 'Female, 24 years old. Last seen leaving her apartment on September 12. Family concerned for her safety.',
    category: 'missing_person',
  },
  {
    localPath: '/criminals/mini (10).webp',
    name: 'Carlos M. Delgado',
    description: 'Male, mid 30s. Athletic build, multiple tattoos on forearms. Wanted for vehicle theft and evading arrest.',
    category: 'known_offender',
  },
  {
    localPath: '/criminals/mini.webp',
    name: 'Unknown Subject #11',
    description: 'Male, approximately 40s. Bald head, thick eyebrows. Caught on CCTV near the scene of a warehouse break-in.',
    category: 'person_of_interest',
  },
  {
    localPath: '/criminals/mini.jpeg',
    name: 'Robert D. Ashby',
    description: 'Male, early 50s. Distinguished appearance, silver hair. Convicted of financial fraud. Parole violation suspect.',
    category: 'known_offender',
  },
  {
    localPath: '/criminals/large.jpeg',
    name: 'Gang Unit File: Unidentified Leader',
    description: 'High-resolution surveillance capture. Subject believed to be the head of the North Valley organized crime network. Considered armed and dangerous.',
    category: 'known_offender',
  },
];

/**
 * Fetch an image from a local /public path and return it as a File object.
 */
async function localImageToFile(path: string): Promise<File> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.statusText}`);
  const blob = await res.blob();
  const filename = path.split('/').pop() ?? 'image.jpg';
  return new File([blob], filename, { type: blob.type });
}

/**
 * Upload one criminal to Supabase Storage + suspects table.
 */
async function uploadCriminal(criminal: CriminalSeed): Promise<void> {
  const file = await localImageToFile(criminal.localPath);
  const fileExt = file.name.split('.').pop();
  const storagePath = `suspect_photos/${crypto.randomUUID()}.${fileExt}`;

  // Upload photo
  const { error: uploadError } = await supabase.storage
    .from('forensic_images')
    .upload(storagePath, file);

  if (uploadError) throw new Error(`Storage upload failed for ${criminal.name}: ${uploadError.message}`);

  const { data: urlData } = supabase.storage.from('forensic_images').getPublicUrl(storagePath);
  const image_url = urlData.publicUrl;

  // Insert record
  const { error: dbError } = await supabase.from('suspects').insert([{
    name: criminal.name,
    description: criminal.description,
    category: criminal.category,
    image_url,
  }]);

  if (dbError) throw new Error(`DB insert failed for ${criminal.name}: ${dbError.message}`);
  console.log(`✓ Seeded: ${criminal.name}`);
}

/**
 * Main seed function — call this once.
 */
export async function seedCriminals(): Promise<{ ok: string[]; failed: string[] }> {
  const ok: string[] = [];
  const failed: string[] = [];

  for (const criminal of CRIMINALS) {
    try {
      await uploadCriminal(criminal);
      ok.push(criminal.name);
    } catch (err) {
      console.error(err);
      failed.push(criminal.name);
    }
  }

  console.log(`\nSeeding complete: ${ok.length} ok, ${failed.length} failed`);
  if (failed.length > 0) console.warn('Failed:', failed);
  return { ok, failed };
}
