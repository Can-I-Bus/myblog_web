<template>
    <div>
        <span class="l">L</span>
        <span class="o">o</span>
        <span class="a">a</span>
        <span class="d">d</span>
        <span class="i">i</span>
        <span class="n">n</span>
        <span class="g">g</span>
        <span class="d1">.</span>
        <span class="d2">.</span>
    </div>
</template>

<style scoped lang="scss">
.l {
    color: black;
    opacity: 0;
    animation: pass 2s ease-in-out infinite;
    animation-delay: 0.2s;
    letter-spacing: 0.5em;
    text-shadow: 2px 2px 3px #919191;
}

.o {
    color: black;
    opacity: 0;
    animation: pass 2s ease-in-out infinite;
    animation-delay: 0.4s;
    letter-spacing: 0.5em;
    text-shadow: 2px 2px 3px #919191;
}

.a {
    color: black;
    opacity: 0;
    animation: pass 2s ease-in-out infinite;
    animation-delay: 0.6s;
    letter-spacing: 0.5em;
    text-shadow: 2px 2px 3px #919191;
}

.d {
    color: black;
    opacity: 0;
    animation: pass 2s ease-in-out infinite;
    animation-delay: 0.8s;
    letter-spacing: 0.5em;
    text-shadow: 2px 2px 3px #919191;
}

.i {
    color: black;
    opacity: 0;
    animation: pass 2s ease-in-out infinite;
    animation-delay: 1s;
    letter-spacing: 0.5em;
    text-shadow: 2px 2px 3px #919191;
}

.n {
    color: black;
    opacity: 0;
    animation: pass 2s ease-in-out infinite;
    animation-delay: 1.2s;
    letter-spacing: 0.5em;
    text-shadow: 2px 2px 3px #919191;
}

.g {
    color: black;
    opacity: 0;
    animation: pass 2s ease-in-out infinite;
    animation-delay: 1.4s;
    letter-spacing: 0.5em;
    text-shadow: 2px 2px 3px #919191;
}

.d1 {
    color: black;
    opacity: 0;
    animation: pass1 2s ease-in-out infinite;
    animation-delay: 1.6s;
    letter-spacing: 0.5em;
    text-shadow: 2px 2px 3px #919191;
}

.d2 {
    color: black;
    opacity: 0;
    animation: pass1 2s ease-in-out infinite;
    animation-delay: 2s;
    letter-spacing: 0.5em;
    text-shadow: 2px 2px 3px #919191;
}

@keyframes pass {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes pass1 {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>
