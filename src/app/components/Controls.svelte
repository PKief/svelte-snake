<script lang="ts">
  import { swipe } from 'svelte-gestures';
  import { ControlService } from '../services';

  const gameControls = new ControlService();
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
    padding: 10px;
    background-color: #66bb6ade;
  }
</style>
