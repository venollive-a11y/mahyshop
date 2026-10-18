const fs = require('fs');
const path = require('path');

// 1. Recursive search for all .env* files
function findEnvFiles() {
  const envFiles = [];
  const searchDirs = ['backend/', 'apps/web/', './'];
  const envPattern = /^\.env(\.|$)/;

  searchDirs.forEach(dir => {
    try {
      const walk = (current) => {
        fs.readdirSync(current).forEach(file => {
          const fullPath = path.join(current, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            walk(fullPath);
          } else if (envPattern.test(file)) {
            envFiles.push(fullPath);
          }
        });
      };
      walk(path.resolve(dir));
    } catch (_) {}
  });

  return envFiles;
}

// 2. Extract credentials with validation
function extractCredentials(files) {
  const found = {
    supabaseUrl: null,
    supabaseAnonKey: null
  };

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      content.split('\n').forEach(line => {
        const [key, ...values] = line.split('=').map(s => s.trim().replace(/['"]/g, ''));
        const value = values.join('=');
        
        if (key === 'SUPABASE_URL' && value.startsWith('http')) {
          found.supabaseUrl = value.replace(/\/+$/, '');
        }
        if (key === 'SUPABASE_ANON_KEY' && value.length >= 20) {
          found.supabaseAnonKey = value;
        }
      });
    } catch (_) {}
  });

  return found;
}

// 3. Safe wrangler.toml update
function updateConfig(creds) {
  const wranglerPath = path.resolve('wrangler.toml');
  
  try {
    let content = fs.readFileSync(wranglerPath, 'utf-8');
    
    if (creds.supabaseUrl) {
      content = content.replace(
        /SUPABASE_URL\s*=\s*['"].*?['"]/,
        `SUPABASE_URL = "${creds.supabaseUrl}"`
      );
    }
    
    if (creds.supabaseAnonKey) {
      content = content.replace(
        /SUPABASE_ANON_KEY\s*=\s*['"].*?['"]/,
        `SUPABASE_ANON_KEY = "${creds.supabaseAnonKey}"`
      );
    }

    fs.writeFileSync(wranglerPath, content);
    console.log('✅ wrangler.toml updated successfully');
    return true;
  } catch (err) {
    console.error('❌ Error updating wrangler.toml:', err.message);
    return false;
  }
}

// Execute
console.log('🔍 Searching for environment files...');
const envFiles = findEnvFiles();
console.log('📄 Found:', envFiles.length ? envFiles : 'No .env files found');

console.log('🔑 Extracting credentials...');
const credentials = extractCredentials(envFiles);
console.log('✔️  Found:');
console.log(`- SUPABASE_URL: ${credentials.supabaseUrl ? '******' + credentials.supabaseUrl.slice(-6) : 'Not found'}`);
console.log(`- SUPABASE_ANON_KEY: ${credentials.supabaseAnonKey ? '****' + credentials.supabaseAnonKey.slice(-4) : 'Not found'}`);

if (credentials.supabaseUrl && credentials.supabaseAnonKey) {
  console.log('🔄 Updating wrangler.toml...');
  updateConfig(credentials);
} else {
  console.log('❌ Missing required credentials - no changes made');
}