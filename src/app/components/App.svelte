<script lang="ts">
  import { setContext } from 'svelte';
  import '../../styles/styles.scss';
  import { Game } from '../game';
  import AppBar from './AppBar.svelte';
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

<header>
  <AppBar />
  <StatusBar />
</header>

<main>
  <Controls>
    <GameFields />
  </Controls>
</main>

<style lang="scss">
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;

    @media (min-width: 640px) {
      max-width: none;
    }
  }
</style>
