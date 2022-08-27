<script lang="ts">
  import { getAppContext } from '../core';

  const imageService = getAppContext('imageService');
  const explanationKeyboard = imageService.getImage('explanation-keyboard');
  const explanationGestures = imageService.getImage('explanation-gestures');
  const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
</script>

<div class="explanation-overlay">
  {#if isMobileDevice}
    <img src={explanationGestures.src} alt={explanationGestures.alt} />
  {:else}
    <img src={explanationKeyboard.src} alt={explanationKeyboard.alt} />
  {/if}
</div>

<style lang="scss">
  .explanation-overlay {
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

    img {
      width: 80%;
      height: 80%;
    }
  }
</style>
