// ============================================================================
// server/api/categories.get.ts — GET /api/categories API Route
// ============================================================================
// This Nitro server route reads the categories JSON file and returns
// the list of menu category objects to the frontend.
//
// 📚 LEARNING — Why a Separate Categories Endpoint?
// Categories are a small but important dataset used by CategoryTabs.
// Keeping them in their own JSON file makes them easy to update
// (e.g., add a new category by editing one JSON file).
// The API endpoint gives the frontend a single place to fetch them.
// ============================================================================

import { readFileSync } from 'fs'
import { join, resolve } from 'path'

// Define the route handler — Nuxt auto-imports `defineEventHandler`
export default defineEventHandler(() => {

  // ── Build path, read file, parse JSON, return ──
  // This is the same pattern used in menu.get.ts
  const filePath = join(resolve('.'), 'server', 'data', 'categories.json')
  const rawData = readFileSync(filePath, 'utf-8')
  const categories = JSON.parse(rawData)

  // 📚 The return value becomes the HTTP response body.
  //    The frontend will receive a JSON array of { slug, label } objects.
  return categories
})
