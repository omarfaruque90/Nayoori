const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env.local manually
const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) env[key.trim()] = value.trim()
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSettings() {
  console.log("Checking Supabase Connection...")
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'default')
    .single()

  if (error) {
    console.error("Supabase Error:", error.message)
    return
  }

  console.log("--- DATA BASE CHECK ---")
  console.log("FULL DATA:", JSON.stringify(data, null, 2))
  console.log("-----------------------")
}

checkSettings()
