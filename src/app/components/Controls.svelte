<script lang="ts">
  import { swipe } from 'svelte-gestures';
  import { getAppContext } from '../core';

  const gameControls = getAppContext('controlService');
</script>

<svelte:window on:keydown={gameControls.handleKeydown()} />

<div
  class="controls"
  use:swipe={{ timeframe: 300, minSwipeDistance: 60, touchAction: 'none' }}
  on:swipe={gameControls.handleSwipe()}
>
  <slot />
</div>

<style>
  .controls {
    padding: 1rem;
    background-color: #66bb6ade;
    position: relative;
    display: flex;
    justify-content: end;
    align-items: end;
  }
</style>
