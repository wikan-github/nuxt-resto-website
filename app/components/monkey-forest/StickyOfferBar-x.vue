<script
  setup
  lang="ts"
>
  // Contract: parent must pass both props — no defaults, no optional.
  // TypeScript will error at compile time if either is missing.
  // REF: https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits
  const props = defineProps<{
    discountLabel: string
    whatsappUrl: string
  }>()

  // Emits only the click — parent owns tracking (source, utm_source, offer slug).
  // This separation lets the same bar be reused on other campaign pages
  // without baking in this page's analytics schema.
  const emit = defineEmits<{ 'claim-click': [] }>()

  // Controls visibility via v-show (not v-if) — the DOM node stays mounted,
  // only CSS display toggles. Faster for frequent show/hide during scroll.
  // REF: https://vuejs.org/api/built-in-directives.html#v-show
  const visible = ref(true)

  // Plain `let` (not ref) — this value is NOT reactive on purpose.
  // It's read/written only inside onScroll, never referenced in template.
  // Making it reactive would trigger unnecessary re-renders on every scroll frame.
  let lastScroll = 0

  // Scroll direction detector — decides whether to show or hide the bar.
  // Logic: hide only when scrolling UP past the 400px threshold on desktop.
  // This is the standard "reveal on scroll down" pattern:
  //   - Scrolling down (y > lastScroll): visible stays true
  //   - Scrolling up (y < lastScroll) AND past 400px: visible = false
  // The 400px threshold prevents flicker near the top of the page.
  function onScroll() {
    const y = window.scrollY

    // Guard: this logic only runs on viewports >= 768px (desktop).
    // On mobile, the CSS media query hides the bar entirely (see <style>),
    // so the JS logic is irrelevant — but the listener still fires.
    // (Minor optimization opportunity: skip attaching listener on mobile.)
    if (window.innerWidth >= 768) {
      visible.value = !(y < lastScroll && y > 400)
    }

    // Always update lastScroll, even on mobile — keeps state consistent
    // if the user resizes from mobile → desktop mid-session.
    lastScroll = y
  }

  // passive: true tells the browser this listener will never call preventDefault().
  // Benefit: the browser can scroll immediately without waiting for JS to run,
  // which is critical for smooth scrolling on mobile/low-end devices.
  // REF: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#passive
  onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))

  // Cleanup: prevents the listener from leaking when the component unmounts.
  // In Nuxt with page navigation, unmounted components would otherwise keep
  // firing onScroll and mutating a stale `visible` ref.
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <!-- v-show (not v-if) — keeps DOM node alive, toggles display:none.
       Important here because scroll handler flips `visible` frequently.
       role="banner" identifies this as a page-level landmark for screen readers.
       NOTE: only one role="banner" should exist per page. -->
  <div
    v-show="visible"
    class="sticky-bar"
    role="banner"
  >
    <span class="sticky-bar__msg">
      <!-- aria-hidden hides the emoji from screen readers (it's decorative) -->
      <span aria-hidden="true">🌿</span>
      <!-- Rendered as text, not a link — taps are intended for the CTA only -->
      <span class="sticky-bar__text">{{ discountLabel }} · 2 min walk</span>
    </span>

    <!-- Real <a href> — not a button — so:
         1. Mobile browsers can hand off to the WhatsApp app
         2. Right-click / long-press "copy link" works
         3. Works even if JS fails to hydrate
         The @click only fires the emit — it does NOT preventDefault,
         so the browser still follows the href to wa.me. -->
    <a
      :href="whatsappUrl"
      class="sticky-bar__cta"
      @click="emit('claim-click')"
    >
      Claim
    </a>
  </div>
</template>

<style
  lang="css"
  scoped
>
/* position: sticky (not fixed) — the bar stays in normal document flow
   until it hits top:0, then sticks. This avoids overlap issues with
   elements above it in the DOM. */
.sticky-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  /* Above page content, below modals (typically 100+) */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-forest);
  /* Brand token — dark green from playbook */
  color: var(--color-cream);
  font-size: 12px;
  font-weight: 600;
}

/* min-width: 0 is the classic flexbox fix that allows the child
   to shrink below its content width — required for the ellipsis
   on .sticky-bar__text to actually work. Without it, flex items
   refuse to shrink past their intrinsic size. */
.sticky-bar__msg {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

/* Truncation trio — long offer labels get cut with "…" instead of
   pushing the CTA off screen. Critical for i18n: German/Indonesian
   translations can be 30–40% longer than English.
   REF: https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow */
.sticky-bar__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* flex-shrink: 0 — CTA never shrinks even if the message is long.
   Guarantees the "Claim" button stays tappable at all times. */
.sticky-bar__cta {
  flex-shrink: 0;
  background: var(--color-amber);
  color: var(--color-white);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Mobile: bar is completely hidden. Reasoning (from the playbook):
   mobile screens are small — a sticky bar would eat precious vertical
   space during the 3–10 second attention window. Mobile instead relies
   on the FloatingWhatsApp button (fixed, bottom-right) for persistence.
   Note: the JS scroll handler is still attached on mobile — harmless
   but unnecessary. Could be gated with a matchMedia check. */
@media (min-width: 768px) {
  .sticky-bar {
    display: none;
  }
}
</style>
