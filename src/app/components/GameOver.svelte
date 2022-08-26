<script lang="ts">
  import Button, { Label } from '@smui/button';
  import { Icon } from '@smui/common';
  import { getAppContext } from '../core';
  import { gameState, i18n } from '../stores';

  const game = getAppContext('game');
  const imageService = getAppContext('imageService');
  const scoreImage = imageService.getImage('trophy');
  const startGame = () => {
    game.restart();
  };
</script>

<div class="game-over">
  <div class="game-over-card">
    <div class="game-stats">
      <span class="score">
        <img src={game.food.image.src} alt={game.food.image.alt} />
        {$gameState.score}
      </span>

      <span class="score">
        <img src={scoreImage.src} alt={scoreImage.alt} />
        {$gameState.highScore}
      </span>
    </div>
    <div class="action-items">
      <Button
        color="primary"
        class="w-75 px-3"
        on:click={() => startGame()}
        touch
        variant="raised"
      >
        <Label
          ><Icon class="material-icons me-2">play_arrow</Icon>
          {$i18n('button.play')}
        </Label>
      </Button>
    </div>
  </div>
</div>

<style lang="scss">
  .game-over {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: #0000007d;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(2px);
    animation: 1s ease 0s normal forwards 1 fadein;

    .game-over-card {
      width: 50%;
      height: 50%;
      background: #03a9f4;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px;
      flex-direction: column;
      padding: 1.5rem 0;

      .game-stats {
        display: flex;
        gap: 2rem;

        .score {
          display: flex;
          flex-direction: column;
          font-size: 1.5rem;
          font-variant-numeric: diagonal-fractions;
          font-family: monospace;

          & > img {
            width: 4rem;
            margin-bottom: 1rem;
          }
        }
      }

      .action-items {
        width: 100%;
      }
    }
  }

  @keyframes fadein {
    0% {
      opacity: 0;
    }
    66% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
