<script lang="ts">
  import { onMount } from 'svelte';
  import { getAppContext } from '../core';
  import { GameRenderer } from '../rendering';
  import { gameState } from '../stores';
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

<canvas
  class:shake={$gameState.gameOver}
  bind:this={canvas}
  width="500"
  height="500"
/>

<style lang="scss">
  canvas {
    width: 100%;

    &.shake {
      animation: shake 0.1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 1px, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, -2px, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 4px, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, -4px, 0);
    }
  }
</style>
