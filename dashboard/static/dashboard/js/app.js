$(function(){
    new Vue({
        el: '#fauth-app',
        delimiters: ['[[', ']]'],
        router,
        data(){
            return {

            }
        },
        methods: {

        },
        created(){

        },
        mounted(){
            /* remove preloader*/
            $('#preloader').fadeOut();
            /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
            const particles_url = $('#particles-json-url').val();
            particlesJS.load('particles-js', particles_url, function() {
                console.info('particles.js config loaded');
            });
        }
    })
});