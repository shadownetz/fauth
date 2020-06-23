$(function(){
    new Vue({
        el: '#fauth-app',
        delimiters: ['[[', ']]'],
        router,
        data(){
            return {
                screen_lock_settings: {
                    pressed: false,
                    last_position: {},
                    default_height: 0,
                    new_height: 0,
                    screen_height: screen.height
                },
            }
        },
        watch: {
            'screen_lock_settings.pressed': function(newVal){
                if(!newVal){
                    let half = (this.screen_lock_settings.screen_height / 2);
                    if(this.screen_lock_settings.new_height > half){
                        this.screen_lock_settings.new_height = this.screen_lock_settings.screen_height
                    }else{
                        this.screen_lock_settings.new_height = this.screen_lock_settings.default_height
                    }
                }
            }
        },
        methods: {
            mouse_move_on_locker_screen(event){
                if(this.screen_lock_settings.pressed){
                    if(this.screen_lock_settings.last_position.x !== undefined){
                        let deltaX = (event.offsetX - this.screen_lock_settings.last_position.x);
                        let deltaY = (event.offsetY - this.screen_lock_settings.last_position.y);
                        let absDeltaX = Math.abs(deltaX);
                        let absDeltaY = Math.abs(deltaY);
                        let new_height = this.screen_lock_settings.new_height;
                        let default_height = this.screen_lock_settings.default_height;
                        let screen_height = this.screen_lock_settings.screen_height;

                        // mouse movement is up
                        if((absDeltaY > absDeltaX) && deltaY < 0){
                            if(new_height > default_height){
                                new_height -= 10;
                            }else{
                                new_height = default_height
                            }
                        }
                        // mouse movement is down
                        else if((absDeltaY > absDeltaX) && deltaY > 0){
                            if(new_height <= screen_height){
                                new_height += 10;
                            }else{
                                new_height = screen_height
                            }
                        }
                        this.screen_lock_settings.new_height = new_height
                    }
                    this.screen_lock_settings.last_position = {
                        x: event.offsetX,
                        y: event.offsetY
                    }
                }else{

                }
            },
            toggleScreenHeight(){
                let new_height = this.screen_lock_settings.new_height;
                let screen_height = this.screen_lock_settings.screen_height;
                let default_height = this.screen_lock_settings.default_height;
                if(new_height === screen_height){
                    new_height = default_height
                }else{
                     new_height = screen_height
                }
                this.screen_lock_settings.new_height = new_height
            },
        },
        created(){
            // get default height of lock screen
            this.screen_lock_settings.default_height = this.screen_lock_settings.new_height =
                Number.parseFloat($('#app-locker-screen').css('height').replace('px', ''));
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