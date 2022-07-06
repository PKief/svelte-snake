<script lang="ts">
  import { getContext } from 'svelte';
  import { swipe } from 'svelte-gestures';
  import { Controls } from '../controls';

  const { getGame } = getContext('game');
  const game = getGame();
  const gameControls = new Controls(game);
</script>

<svelte:window on:keydown={gameControls.handleKeydown()} />

<div
  use:swipe={{ timeframe: 300, minSwipeDistance: 60, touchAction: 'none' }}
  on:swipe={gameControls.handleSwipe()}
>
  <slot />
</div>
