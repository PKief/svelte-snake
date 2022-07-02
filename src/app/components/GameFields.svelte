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

    const fps = 30;
    const fpsInterval = 1000 / fps;
    let then = window.performance.now();
    const renderContext = game.getRenderingContet(fps);

    let frame = requestAnimationFrame(loop);

    function loop(t) {
      frame = requestAnimationFrame(loop);

      const elapsed = t - then;

      // if enough time has elapsed, draw the next frame
      if (elapsed > fpsInterval) {
        then = t - (elapsed % fpsInterval);
        renderContext();
      }
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
