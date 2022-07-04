<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { GameRenderer } from './../renderer';
  const { getGame } = getContext('game');

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const game = getGame();
    const ctx = canvas.getContext('2d');
    const renderer = new GameRenderer(game, ctx);

    const fps = 20;
    const fpsInterval = 300 / fps;
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
