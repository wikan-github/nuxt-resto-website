// ============================================================================
// server/api/menu.get.ts — GET /api/menu API Route
// ============================================================================
// This is a Nitro server route that reads the menu data from the JSON file
// on the server and returns it as a JSON response.
//
// 📚 LEARNING — Nitro Server Routes:
// - Files in `server/api/` are auto-registered as API routes by Nitro
// - The filename determines the route: `menu.get.ts` → GET /api/menu
// - The `.get` part means this route only responds to GET requests
// - These routes run on the SERVER (Node.js), NOT in the browser
//
// 📚 LEARNING — File Path Aliases:
// - `~/` points to the project root (Nuxt alias)
// - So `~/server/data/menu.json` resolves to the absolute path of the JSON file
// ============================================================================

// Import Node.js `readFileSync` to read the JSON file from disk
import { readFileSync } from 'fs'
// Import `join` to construct file paths safely across operating systems
import { join } from 'path'
// Import the Nuxt `resolve` helper to get the project root directory
import { resolve } from 'path'

// Define the API route handler — Nuxt auto-imports `defineEventHandler`
export default defineEventHandler(() => {

  // ── Step 1: Build the absolute path to the JSON data file ──
  // 📚 We use `resolve()` to get the project root, then join it with the
  //    relative path to the data file. This works regardless of where
  //    Node.js is running from.
  const filePath = join(resolve('.'), 'server', 'data', 'menu.json')

  // ── Step 2: Read the JSON file from disk ──
  // 📚 `readFileSync` reads the file SYNCHRONOUSLY (blocks until done).
  //    For small JSON files like this, that's perfectly fine.
  //    `utf-8` decodes the raw bytes into a string.
  const rawData = readFileSync(filePath, 'utf-8')

  // ── Step 3: Parse the JSON string into a JavaScript array ──
  // 📚 JSON.parse() converts a JSON string into a real JS object/array.
  const menu = JSON.parse(rawData)

  // ── Step 4: Return the data as the HTTP response ──
  // 📚 Nuxt automatically serializes the returned value to JSON
  //    and sets the Content-Type header to application/json.
  return menu
})
