import { defineEntity, p, type InferEntity } from '@mikro-orm/core';

export const Restaurant = defineEntity({
  name: 'Restaurant',
  properties: {
    id: p.integer().primary(),
    whatsappNumber: p.string(),
    whatsappDisplay: p.string(),
    reservationMessage: p.string(),
    mapLatitude: p.float(),
    mapLongitude: p.float(),
    mapEmbedUrl: p.string(),
    mapLinkUrl: p.string(),
    geofenceRadiusMeters: p.integer(),
    dineInMultiplier: p.float(),
    brandingName: p.string(),
    brandingTagline: p.string(),
    brandingLogoPath: p.string(),
    addressStreet: p.string(),
    addressLocality: p.string(),
    addressRegion: p.string(),
    addressPostalCode: p.string(),
    addressCountry: p.string(),
    addressFull: p.string(),
  },
});

export type Restaurant = InferEntity<typeof Restaurant>;
