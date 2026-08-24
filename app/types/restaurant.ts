// ============================================================================
// restaurant.ts — Shared TypeScript Types for Restaurant Data
// ============================================================================
// This file hosts TYPE-ONLY definitions that multiple components share.
// It replaces the old app/config/restaurant.ts, whose runtime VALUES
// (coordinates, geofence radius, price multiplier) now live in
// server/data/restaurant.json — the single editable source of truth.
//
// 📚 LEARNING — Types vs Values:
// TypeScript types (like OrderType) exist only at compile time and CANNOT be
// stored in JSON. Runtime values (numbers, strings) CAN live in JSON and be
// served by the /api/restaurant endpoint instead of being hardcoded.
// ============================================================================

/**
 * OrderType defines the two ways a customer can receive their order.
 *
 * 📚 LEARNING — String Literal Union:
 * By declaring this as a union of string literals, TypeScript only allows
 * exactly 'takeaway' or 'dine-in' anywhere an OrderType is expected.
 * Passing 'delivery' would fail compilation — catching bugs before runtime.
 */
export type OrderType = 'takeaway' | 'dine-in'
