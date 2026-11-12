<template>
  <div
    id="card-free-tea-invitation"
    class="invitation-card selected"
  >
    <div class="invitation-card-top">
      <span class="step-badge">Your Exit Reward</span>
      <span class="free-pill">100% Free</span>
    </div>

    <h3>🥤 Keep Your Ticket &amp; Walk In for a FREE Drink!</h3>
    <p>
      No booking required—just show your Monkey Forest Sanctuary ticket at the door to claim your complimentary ice-cold
      drink!
    </p>

    <div class="invitation-card-footer">
      <span><i class="fa-solid fa-ticket"></i> Keep your sanctuary ticket</span>
      <span>Walk In / Message Us <i class="fa-solid fa-arrow-right"></i></span>
    </div>
  </div>
</template>

<script
  lang="ts"
  setup
>

</script>

<style
  scoped
  lang="css"
>
.invitation-card {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
    border-radius: 16px;
    padding: 20px;
    color: #0c0a09;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
    border: 2px solid #fde68a;
    text-align: left;
    cursor: pointer;
    position: relative;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    animation: pulse-border 2s infinite;
}
</style>