<script lang="ts">
  import { getAppContext } from '../core';

  export let isVisible = false;

  const imageService = getAppContext('imageService');
  const explanationKeyboard = imageService.getImage('explanation-keyboard');
  const explanationGestures = imageService.getImage('explanation-gestures');
  const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
</script>

<div class="explanation-overlay" class:visible={isVisible}>
  {#if isMobileDevice}
    <img src={explanationGestures.src} alt={explanationGestures.alt} />
  {:else}
    <img src={explanationKeyboard.src} alt={explanationKeyboard.alt} />
  {/if}
</div>

<style lang="scss">
  .explanation-overlay {
    opacity: 0;
    position: absolute;
    background: rgba(3, 169, 244, 0.5);
    backdrop-filter: blur(5px);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1rem;
    height: 1rem;
    width: 8rem;
    height: 8rem;
    border-radius: 8px;
    margin: 2rem;
    animation: 0.25s ease 0s normal forwards 1 fadeout;

    &.visible {
      opacity: 1;
      animation: 0.25s ease 0s normal forwards 1 fadein;
    }

    img {
      width: 80%;
      height: 80%;
    }
  }

  @keyframes fadein {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes fadeout {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
    }
  }
</style>
