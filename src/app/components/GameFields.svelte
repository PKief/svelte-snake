<script lang="ts">
  import { onMount } from 'svelte';
  import { getAppContext } from '../core/context';
  import { GameRenderer } from '../rendering';
  import { ContextPath2D } from './../types';
  const game = getAppContext('game');

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    const renderer = new GameRenderer(game, ctx as ContextPath2D);

    const fpsInterval = 1;
    let then = window.performance.now();
    const renderContext = renderer.getRenderingContext();

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
