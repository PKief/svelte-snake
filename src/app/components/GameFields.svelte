<script lang="ts">
  import { onMount } from 'svelte';
  import { Game } from '../game';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    const gridSize = 10;
    const game = new Game({
      gridSize,
      ctx,
    });

    let frame = requestAnimationFrame(loop);

    function loop(t) {
      frame = requestAnimationFrame(loop);
      game.render();
    }

    game.start();

    return () => {
      cancelAnimationFrame(frame);
    };
  });
</script>

<canvas bind:this={canvas} width="300" height="300" />

<style lang="scss">
  canvas {
    width: 300px;
    height: 300px;
    background-color: #666;
  }
</style>
