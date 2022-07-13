<script lang="ts">
  import { setContext } from 'svelte';
  import '../../styles/styles.scss';
  import { Game } from '../game';
  import Controls from './Controls.svelte';
  import GameFields from './GameFields.svelte';
  import StatusBar from './StatusBar.svelte';

  const gridSize = 10;
  const game = new Game({
    gridSize,
  });
  setContext('game', {
    getGame: () => game,
  });
</script>

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
    </main>
  </div>
</div>

<style lang="scss">
  .app-container {
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(-45deg, #c5e1a5, #ef9a9a, #9fa8da, #cddc39);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;

    .app-context {
      max-width: 500px;
      width: 100%;
    }
  }

  header {
    h1.title {
      text-align: center;
      font-family: monospace;
      font-style: italic;
      font-size: 4rem;
      padding: 2rem 0;
      margin: 0;
      text-shadow: 0px 4px #8383834d;
    }
  }

  main {
    text-align: center;
    box-shadow: 0px 4px 0px #66bb6a7d;

    @media (min-width: 640px) {
      max-width: none;
    }
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>
