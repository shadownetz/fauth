$(function(){
    /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
    const particles_url = $('#particles-json-url').val();
    particlesJS.load('particles-js', particles_url, function() {
        console.info('callback - particles.js config loaded');
    });

});