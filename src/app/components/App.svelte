<script lang="ts">
  import { setContext } from 'svelte';
  import '../../styles/styles.scss';
  import { Game } from '../logic/game';
  import Controls from './Controls.svelte';
  import Footer from './Footer.svelte';
  import GameFields from './GameFields.svelte';
  import StatusBar from './StatusBar.svelte';

  const gridSize = 10;
  const speed = 15;

  const game = new Game({
    gridSize,
    speed,
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
    <Footer />
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
    background: linear-gradient(-45deg, #0d0d0e, #144934, #143526, #0c5533);
    color: white;
    background-size: 400% 400%;

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
      color: rgba(238, 238, 238, 0.75);
    }
  }

  main {
    text-align: center;
    box-shadow: 0px 4px 0px #66bb6a7d;

    @media (min-width: 640px) {
      max-width: none;
    }
  }
</style>
