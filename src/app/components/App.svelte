<script lang="ts">
  import '../../styles/styles.scss';
  import { getAppContext, setAppContext } from '../core';
  import { registerServices } from '../core/services';
  import { Game } from '../logic/game';
  import { gameState } from '../stores';
  import Controls from './Controls.svelte';
  import Footer from './Footer.svelte';
  import GameFields from './GameFields.svelte';
  import GameOver from './GameOver.svelte';
  import StatusBar from './StatusBar.svelte';

  registerServices();

  const translationInit$ = getAppContext('translationService').init();

  const gridSize = 10;
  const speed = 15;

  const game = new Game({
    gridSize,
    speed,
  });

  getAppContext('controlService').init(game);

  setAppContext('game', { getGame: () => game });
</script>

{#await translationInit$ then}
  <div class="app-container">
    <div class="app-context">
      <header>
        <h1 class="title">Snake</h1>
      </header>
      <main>
        <StatusBar />
        <Controls>
          <GameFields />
        </Controls>
        {#if $gameState.gameOver}
          <GameOver />
        {/if}
      </main>
      <Footer />
    </div>
  </div>
{/await}

<style lang="scss">
  .app-container {
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(-45deg, #0d0d0e, #144934, #143526, #0c5533);
    color: white;
    background-size: 400% 400%;

    .app-context {
      max-width: 400px;
      width: 100%;
    }
  }

  header {
    h1.title {
      text-align: center;
      font-family: monospace;
      font-style: italic;
      font-size: 4rem;
      padding-bottom: 2rem;
      margin: 0;
      color: rgba(238, 238, 238, 0.75);
    }
  }

  main {
    text-align: center;
    position: relative;

    @media (min-width: 640px) {
      max-width: none;
    }
  }
</style>
