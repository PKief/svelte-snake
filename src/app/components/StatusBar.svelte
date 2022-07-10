<script lang="ts">
  import IconButton from '@smui/icon-button';
  import { getContext } from 'svelte';
  import { gameState } from '../stores';

  const { getGame } = getContext('game');
  const game = getGame();

  const startGame = () => {
    game.start();
  };

  const restartGame = () => {
    game.restart();
  };

  const pauseGame = () => {
    game.pause();
  };

  const endPause = () => {
    game.endPause();
  };
</script>

{#if $gameState}
  <div class="app-bar">
    <div class="scores">
      <span class="food-score">
        🍎 {$gameState.score}
      </span>
      <span class="food-score">
        🏆 {$gameState.highScore}
      </span>
    </div>
    {#if $gameState.status === 'playing'}
      <IconButton class="material-icons" on:click={pauseGame}>pause</IconButton>
    {:else if $gameState.status === 'paused'}
      <IconButton class="material-icons" on:click={endPause}
        >play_arrow</IconButton
      >
    {:else if $gameState.status === 'stopped'}
      <IconButton class="material-icons" on:click={restartGame}
        >replay</IconButton
      >
    {:else if $gameState.status === 'initial'}
      <IconButton class="material-icons" on:click={startGame}
        >play_arrow</IconButton
      >
    {/if}
  </div>
{/if}

<style>
  .app-bar {
    background-color: #43a047;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
  }
</style>
