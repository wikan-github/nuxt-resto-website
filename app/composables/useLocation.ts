// ============================================================================
// useLocation.ts — Composable: Geolocation & Proximity Detection
// ============================================================================
// This composable handles everything related to the user's physical location:
// 1. Requests browser geolocation permission
// 2. Gets the user's current latitude/longitude
// 3. Calculates distance to the restaurant using the Haversine formula
// 4. Exposes a reactive `isNearRestaurant` boolean (within 10 meters)
//
// 📚 LEARNING — Browser Geolocation API:
// The Geolocation API is built into all modern browsers. It:
// - Asks the user for permission ("Allow this site to use your location?")
// - Returns the device's GPS coordinates (latitude + longitude)
// - Can be high-accuracy (GPS) or low-accuracy (WiFi/cell tower)
//
// 📚 IMPORTANT — This ONLY works over HTTPS:
// Browsers block geolocation on non-secure (HTTP) sites for privacy.
// `localhost` is the only exception — it works without HTTPS during development.
//
// 📚 LEARNING — The Haversine Formula:
// The Haversine formula calculates the "great-circle distance" between
// two points on a sphere (the Earth). It accounts for the Earth's curvature,
// unlike a simple Pythagorean calculation which would be inaccurate over
// long distances.
//
// Formula: a = sin²(Δlat/2) + cos(lat1) · cos(lat2) · sin²(Δlng/2)
//          c = 2 · atan2(√a, √(1−a))
//          d = R · c
// Where R = Earth's radius (6,371,000 meters)

import {
  RESTAURANT_LAT,
  RESTAURANT_LNG,
  GEOFENCE_RADIUS_METERS,
} from '~/config/restaurant'

// ── TypeScript Interface ──

/**
 * UserLocation represents the user's current geographic position.
 *
 * 📚 This matches the structure returned by the browser's Geolocation API,
 *    but we define our own interface for type safety and clarity.
 */
export interface UserLocation {
  latitude: number    // User's latitude in decimal degrees (e.g., -8.5061)
  longitude: number   // User's longitude in decimal degrees (e.g., 115.2625)
}

// ── Helper: Haversine Distance Calculation ──

/**
 * calculateDistance computes the distance in meters between two geographic points
 * using the Haversine formula.
 *
 * @param lat1 - Latitude of point 1 (user's latitude)
 * @param lng1 - Longitude of point 1 (user's longitude)
 * @param lat2 - Latitude of point 2 (restaurant's latitude)
 * @param lng2 - Longitude of point 2 (restaurant's longitude)
 * @returns Distance in meters between the two points
 *
 * 📚 LEARNING — JavaScript Trig Functions:
 * Math.sin(), Math.cos(), Math.sqrt(), Math.atan2() all use RADIANS,
 * not degrees. We convert degrees to radians by multiplying by (π / 180).
 * `Math.PI` is JavaScript's built-in constant for π (3.14159...).
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  // Earth's mean radius in meters
  // 📚 This is the average radius of the Earth — accurate enough for our use case.
  const EARTH_RADIUS_METERS = 6_371_000

  // Convert latitude/longitude from degrees to radians
  // 📚 `* (Math.PI / 180)` is the standard degree-to-radian conversion.
  const lat1Rad = lat1 * (Math.PI / 180)
  const lat2Rad = lat2 * (Math.PI / 180)
  const lng1Rad = lng1 * (Math.PI / 180)
  const lng2Rad = lng2 * (Math.PI / 180)

  // Calculate the differences between the two points
  const deltaLat = lat2Rad - lat1Rad
  const deltaLng = lng2Rad - lng1Rad

  // ── Haversine Formula ──
  // `a` is the square of half the chord length between the points
  const a =
    Math.sin(deltaLat / 2) ** 2 +          // sin²(Δlat/2)
    Math.cos(lat1Rad) *                     // cos(lat1)
    Math.cos(lat2Rad) *                     // cos(lat2)
    Math.sin(deltaLng / 2) ** 2             // sin²(Δlng/2)

  // `c` is the angular distance in radians
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  // Distance = Earth's radius × angular distance
  return EARTH_RADIUS_METERS * c
}

// ── Composable Function ──

/**
 * useLocation() provides the user's geographic position and proximity status.
 *
 * 📚 LEARNING — How This Composable Works:
 * 1. When called, it immediately requests the user's geolocation.
 * 2. If granted, it calculates the distance to the restaurant.
 * 3. It stores the result in `useState` so ALL components share the same data.
 * 4. Components read `isNearRestaurant` to decide pricing and button labels.
 *
 * 📚 Edge Cases Handled:
 * - Permission denied → `isNearRestaurant` defaults to `false` (takeaway mode)
 * - Browser doesn't support geolocation → defaults to `false`
 * - Location unavailable → defaults to `false`
 * - User is exactly at the restaurant → `true`
 */
export function useLocation() {

  // ── Shared State ──
  // `useState` ensures all components see the SAME location data.
  // Without useState, each component calling useLocation() would get fresh state.

  /**
   * userLocation: the user's current coordinates, or null if unknown.
   * Starts as `null` until the browser provides the location.
   */
  const userLocation = useState<UserLocation | null>('userLocation', () => null)

  /**
   * isLocationLoading: true while waiting for the browser to respond.
   * Useful for showing a loading spinner or default UI.
   */
  const isLocationLoading = useState<boolean>('locationLoading', () => false)

  /**
   * locationError: error message if geolocation fails, or null if successful.
   * Examples: "User denied geolocation", "Position unavailable"
   */
  const locationError = useState<string | null>('locationError', () => null)

  // ── Computed Values ──

  /**
   * distanceToRestaurant: the distance in meters from the user to the restaurant.
   * Returns `null` if the user's location is unknown.
   *
   * 📚 This is a `computed` value — it automatically recalculates whenever
   *    `userLocation` changes. If the user moves, the distance updates.
   */
  const distanceToRestaurant = computed(() => {
    if (!userLocation.value) return null
    return calculateDistance(
      userLocation.value.latitude,
      userLocation.value.longitude,
      RESTAURANT_LAT,
      RESTAURANT_LNG,
    )
  })

  /**
   * isNearRestaurant: true if the user is within the geofence radius.
   * This is the MAIN VALUE that components use to determine pricing.
   *
   * 📚 When true → "Dine In" mode (user is at the restaurant)
   *    When false → "Take Away" mode (user is elsewhere, or location unknown)
   */
  const isNearRestaurant = computed(() => {
    if (distanceToRestaurant.value === null) return false
    return distanceToRestaurant.value <= GEOFENCE_RADIUS_METERS
  })

  // ── Actions ──

  /**
   * requestLocation asks the browser for the user's current position.
   *
   * 📚 How navigator.geolocation.getCurrentPosition() works:
   * 1. Browser shows a permission prompt: "Allow location access?"
   * 2. If user clicks "Allow" → success callback runs with position data
   * 3. If user clicks "Block" → error callback runs with error code
   * 4. If device has no GPS → error callback with "POSITION_UNAVAILABLE"
   *
   * The `enableHighAccuracy: true` option tells the browser to use GPS
   * instead of WiFi/cell tower approximation. This is more accurate but
   * uses more battery and may take longer.
   */
  function requestLocation() {
    // Check if the browser supports geolocation
    if (!navigator.geolocation) {
      locationError.value = 'Geolocation is not supported by this browser'; 
      console.log('Browser mendukung Geolocation');
      
      return;
    }

    // Set loading state to true while waiting for the browser response
    isLocationLoading.value = true

    navigator.geolocation.getCurrentPosition(
      // ── Success Callback ──
      // Called when the user grants permission and the position is obtained.
      (position) => {
        // Extract latitude and longitude from the position object
        const userLat = position.coords.latitude
        const userLng = position.coords.longitude

        userLocation.value = {
          latitude: userLat,
          longitude: userLng,
        }

        const distance = calculateDistance(userLat, userLng, RESTAURANT_LAT, RESTAURANT_LNG)

        console.log('--- Location Info ---')
        console.log(`User Location:      Lat ${userLat}, Lng ${userLng}`)
        console.log(`Restaurant Location: Lat ${RESTAURANT_LAT}, Lng ${RESTAURANT_LNG}`)
        console.log(`Distance to Restaurant: ${distance.toFixed(2)} meters`)
        console.log('---------------------')

        // Clear any previous error and loading state
        locationError.value = null
        isLocationLoading.value = false
      },
      // ── Error Callback ──
      // Called when something goes wrong (permission denied, timeout, etc.)
      (error) => {
        // Map the error code to a human-readable message
        switch (error.code) {
          case error.PERMISSION_DENIED:
            locationError.value = 'Location permission denied'
            break
          case error.POSITION_UNAVAILABLE:
            locationError.value = 'Location information unavailable'
            break
          case error.TIMEOUT:
            locationError.value = 'Location request timed out'
            break
          default:
            locationError.value = 'An unknown error occurred'
            break
        }
        // Clear loading state — we won't get a location
        isLocationLoading.value = false
      },
      // ── Options ──
      {
        enableHighAccuracy: true,   // Use GPS for maximum accuracy
        timeout: 10_000,            // Wait max 10 seconds for a response
        maximumAge: 60_000,         // Cache the result for 60 seconds
        // 📚 `maximumAge: 60_000` means: if the browser already has a location
        //    that's less than 60 seconds old, use that instead of requesting
        //    a new one. This is faster and saves battery.
      },
    )
  }

  // ── Auto-Request on First Use ──
  // 📚 When any component first calls `useLocation()`, we automatically
  //    request the user's location. This means the proximity check happens
  //    as soon as the page loads — no manual trigger needed.
  //    We only request if we don't already have a location (avoids duplicates).
  if (import.meta.client && !userLocation.value && !isLocationLoading.value) {
    // Only request location in the browser — navigator is undefined during SSR
    requestLocation()
  }

  // ── Return ──
  return {
    userLocation: readonly(userLocation),       // Current coordinates (or null)
    distanceToRestaurant,                       // Distance in meters (or null)
    isNearRestaurant,                           // true if within geofence
    isLocationLoading: readonly(isLocationLoading), // true while loading
    locationError: readonly(locationError),     // Error message (or null)
    requestLocation,                            // Manually re-request location
  }
}
