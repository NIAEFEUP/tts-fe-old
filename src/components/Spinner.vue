<template functional>
  <svg :width="props.size" :height="props.size" class="spinner" viewBox="25 25 50 50">
    <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
  </svg>
</template>
<script>
  export default {
    props: {
      size: {
        type: String,
        default: '30px',
      },
    },
    name: 'Spinner',
    functional: true,
  };
</script>

<style lang="scss">
  @import '../styles/variables';

  .spinner {
    animation: rotate 2s linear infinite;
    transform-origin: center center;
  }

  .path {
    stroke-dasharray: 75, 200;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite;
    stroke-linecap: round;
    stroke: $primary-color;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }
</style>
