import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Read env
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => { const parts = line.split('='); return [parts[0].trim(), parts.slice(1).join('=').trim()]; })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const ARTIFACTS_DIR = 'C:\\Users\\hemal\\.gemini\\antigravity-ide\\brain\\42ead9da-e908-47a5-81c8-52d2f544009c';

const images = [
  { file: 'hero_collage_1787557858958.jpg', name: 'hero-collage.jpg' },
  { file: 'prod_airpods_1787557876055.jpg', name: 'prod-airpods.jpg' },
  { file: 'prod_macbook_1787557890031.jpg', name: 'prod-macbook.jpg' },
  { file: 'prod_sony_wh_1787557919392.jpg', name: 'prod-sony-wh.jpg' },
  { file: 'prod_iphone_1787558070897.jpg', name: 'prod-iphone.jpg' },
  { file: 'prod_boat_watch_1787558088702.jpg', name: 'prod-boat.jpg' },
  { file: 'prod_jbl_speaker_1787558104416.jpg', name: 'prod-jbl.jpg' },
  { file: 'ai_robot_1787558121500.jpg', name: 'ai-robot.jpg' },
  { file: 'cat_electronics_1787558171606.jpg', name: 'cat-electronics.jpg' },
  { file: 'cat_laptops_1787558186867.jpg', name: 'cat-laptops.jpg' },
  { file: 'cat_audio_1787558199503.jpg', name: 'cat-audio.jpg' },
  { file: 'cat_accessories_1787558212415.jpg', name: 'cat-accessories.jpg' },
  { file: 'cat_gaming_1787558227057.jpg', name: 'cat-gaming.jpg' },
];

async function setupAndUpload() {
  // 1. Create the storage bucket (public)
  console.log('Creating store-assets bucket...');
  const { data: bucket, error: bucketError } = await supabase.storage.createBucket('store-assets', {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    fileSizeLimit: 10485760, // 10MB
  });
  
  if (bucketError && !bucketError.message.includes('already exists')) {
    console.error('Bucket error:', bucketError.message);
  } else {
    console.log('Bucket ready!');
  }

  // 2. Upload each image
  const urls: Record<string, string> = {};
  
  for (const img of images) {
    const filePath = path.join(ARTIFACTS_DIR, img.file);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${img.file} - skipping`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const contentType = img.file.endsWith('.png') ? 'image/png' : 'image/jpeg';

    console.log(`Uploading ${img.name}...`);
    
    const { data, error } = await supabase.storage
      .from('store-assets')
      .upload(img.name, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`Failed to upload ${img.name}:`, error.message);
    } else {
      const { data: urlData } = supabase.storage.from('store-assets').getPublicUrl(img.name);
      urls[img.name] = urlData.publicUrl;
      console.log(`✓ ${img.name} → ${urlData.publicUrl}`);
    }
  }

  console.log('\n--- ALL PUBLIC URLS ---');
  console.log(JSON.stringify(urls, null, 2));
}

setupAndUpload().catch(console.error);
