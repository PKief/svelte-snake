<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { GameRenderer } from '../rendering';
  import { ContextPath2D } from './../types';
  const { getGame } = getContext('game');

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const game = getGame();
    const ctx = canvas.getContext('2d');
    const renderer = new GameRenderer(game, ctx as ContextPath2D);

    const fps = 15;
    const fpsInterval = 20 / fps;
    let then = window.performance.now();
    const renderContext = renderer.getRenderingContext(fps);

    const loop = (t) => {
      frame = requestAnimationFrame(loop);

      const elapsed = t - then;

      // if enough time has elapsed, draw the next frame
      if (elapsed > fpsInterval) {
        then = t - (elapsed % fpsInterval);
        renderContext();
      }
    };

    let frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
    };
  });
</script>

<canvas bind:this={canvas} width="500" height="500" />

<style lang="scss">
  canvas {
    width: 100%;
  }
</style>
