<script lang="ts">
  import IconButton from '@smui/icon-button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import { getAppContext } from '../core';
  import { gameState, i18n, soundState } from '../stores';

  const game = getAppContext('game');
  const imageService = getAppContext('imageService');
  const scoreImage = imageService.getImage('trophy');
  const soundService = getAppContext('soundService');

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
      <Wrapper>
        <span class="food-score">
          <img src={game.food.image.src} alt={game.food.image.alt} />
          {$gameState.score}
        </span>
        <Tooltip>{$i18n('label.score')}</Tooltip>
      </Wrapper>

      <Wrapper>
        <span class="food-score">
          <img src={scoreImage.src} alt={scoreImage.alt} />
          {$gameState.highScore}
        </span>
        <Tooltip>{$i18n('label.highScore')}</Tooltip>
      </Wrapper>
    </div>
    <div>
      {#if $soundState.muted}
        <IconButton
          class="material-icons"
          on:click={soundService.unmuteAllPlayers}>volume_off</IconButton
        >
      {:else}
        <IconButton
          class="material-icons"
          on:click={soundService.muteAllPlayers}>volume_up</IconButton
        >
      {/if}
      {#if $gameState.status === 'playing'}
        <IconButton class="material-icons" on:click={pauseGame}
          >pause</IconButton
        >
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
  </div>
{/if}

<style lang="scss">
  .app-bar {
    background-color: #43a047b5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;

    .scores {
      display: flex;
      gap: 1rem;
    }

    .food-score {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
      font-size: 1.25rem;
      font-variant-numeric: diagonal-fractions;
      font-family: monospace;

      & > img {
        width: 1.75rem;
      }
    }
  }
</style>
