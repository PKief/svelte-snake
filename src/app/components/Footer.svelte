<script>
  import githubLogo from './../../img/github.svg';
</script>

<footer>
  <div class="footer-text">
    <a
      href="https://github.com/PKief/svelte-snake"
      aria-label="Link to GitHub repository"
      target="_blank"
    >
      <img src={githubLogo} alt="GitHub Logo" fill="#AB7C94" />
      <span>Svelte-Snake</span>
    </a>
  </div>
</footer>

<style lang="scss">
  footer {
    display: flex;
    justify-content: center;

    .footer-text {
      a {
        display: flex;
        align-items: center;
        color: rgba(238, 238, 238, 0.5);
        text-decoration: none;
        margin-top: 2rem;
        gap: 0.5rem;
      }

      img {
        width: 1.5rem;
      }
    }
  }
</style>
