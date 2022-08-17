<script>
  import githubLogo from './../../img/github.svg';
</script>

<footer>
  <div class="footer-text">
    <p>
      Created with ♡ by
      <a target="_blank" href="https://pkief.github.io/">Philipp Kief</a>
    </p>
    <a
      href="https://github.com/PKief/svelte-snake"
      aria-label="Link to GitHub repository"
      target="_blank"
    >
      <img src={githubLogo} alt="GitHub Logo" fill="#AB7C94" />
    </a>
  </div>
</footer>

<style lang="scss">
  footer {
    display: flex;
    justify-content: center;

    .footer-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 2rem 0;

      p,
      a {
        color: rgba(238, 238, 238, 0.5);
        text-decoration: none;
      }

      img {
        width: 2rem;
      }
    }
  }
</style>
