<template>
    <footer id="social">
        <a :href="fb"><img src="/static/social-fb.svg" alt="Share on Facebook"></a>
        <a :href="twitter"><img src="/static/social-twitter.svg" alt="Share on Twitter"></a>
    </footer>
</template>

<script>

export default {
    name: 'social',
    data() {
        return {
                fb: `https://www.facebook.com/sharer/sharer.php?u=https%3A//webtools.itgonline.se/appar/v3/groupie/%23/`,
                twitter: `https://twitter.com/home?status=V%C3%A4rldens%20b%C3%A4sta%20gruppslumpare!%0Ahttps%3A//webtools.itgonline.se/appar/v3/groupie/%23/`
            }
    }
}

</script>

<style scoped>

#social {
    width: 12vw;
    position: fixed;
    bottom: .75rem;
    right: .75rem;
    text-align: right;
}

#social a {
    opacity: .6;
}

#social a:hover {
    opacity: .8;
}

#social a:active {
    opacity: 1;
}

#social img {
    width: 1.5rem;
    margin: 0 .25rem;

}

</style>
