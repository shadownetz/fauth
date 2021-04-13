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
                time_str: '',
                date_str: '',
                monthNames: ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ],
                days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            }
        },
        watch: {
            'screen_lock_settings.pressed': function(newVal){
                if(!newVal){
                    let half = (this.screen_lock_settings.screen_height / 2);
                    if(this.screen_lock_settings.new_height > half){
                        this.screen_lock_settings.new_height = this.screen_lock_settings.screen_height;
                    }else{
                        this.screen_lock_settings.new_height = this.screen_lock_settings.default_height;
                    }
                    this.auto_decide_timer_visibility()
                }
            },
            'screen_lock_settings.new_height': function(newVal){
                if(newVal >= this.screen_lock_settings.screen_height){
                    $('#app-locker-btn').fadeOut('fast');
                }else{
                    $('#app-locker-btn').fadeIn('slow');
                }
            }
        },
        methods: {
            auto_decide_timer_visibility(){
                let half = (this.screen_lock_settings.screen_height / 2);
                if(this.screen_lock_settings.new_height > half){
                    $('.lock-content').fadeIn("slow")
                }else{
                    $('.lock-content').fadeOut("fast")
                }
            },
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
                                // FIXME: get mouse cursor position on screen and determine distance from screen top
                                // FIXME: use this to set as locker height
                                new_height -= 10;
                            }else{
                                new_height = default_height
                            }
                        }
                        // mouse movement is down
                        else if((absDeltaY > absDeltaX) && deltaY > 0){
                            if(new_height <= screen_height){
                                // FIXME: get mouse cursor position on screen and determine distance from screen top
                                // FIXME: use this to set as locker height
                                new_height += 10;
                            }else{
                                new_height = screen_height
                            }
                        }
                        this.screen_lock_settings.new_height = new_height;
                        this.auto_decide_timer_visibility()
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
                this.screen_lock_settings.new_height = new_height;
                if(new_height === screen_height){
                    $('.lock-content').fadeIn("slow");
                }else{
                    $('.lock-content').fadeOut("fast")
                }
            },
            hideNav(){
                let nav_items = $('#app-navigation > div:nth-child(1)');
                let h = nav_items.css('height');
                nav_items.animate({
                    height: (h === '343px')?'49px':'343px',
                }, 'slow');
            },
            showTime(){
                const date = new Date();
                let h = date.getHours(); // 0 - 23
                let m = date.getMinutes(); // 0 - 59
                let s = date.getSeconds(); // 0 - 59
                let month = date.getMonth();
                let _date = date.getDate();
                let y = date.getFullYear();
                let session = "AM";

                this.date_str = `${this.monthNames[month]} ${_date}, ${y}`;

                if(h === 0){
                    h = 12;
                }

                if(h > 12){
                    h = h - 12;
                    session = "PM";
                }

                h = (h < 10) ? "0" + h : h;
                m = (m < 10) ? "0" + m : m;
                s = (s < 10) ? "0" + s : s;

                this.time_str = h + "<span class='blink'>:</span>" + m + "<span class='blink'>:</span>" + s + " " + session;
                setTimeout(()=>this.showTime(), 1000);
            }
        },
        created(){
            // get default height of lock screen
            this.screen_lock_settings.default_height = this.screen_lock_settings.new_height =
                Number.parseFloat($('#app-locker-screen').css('height').replace('px', ''));
            this.screen_lock_settings.screen_height =
                (document.documentElement.clientHeight || document.body.clientHeight || 0);

            this.showTime()
        },
        mounted(){
            /* remove preloader*/
            $('#preloader').fadeOut();

            /* Initialize tooltips */
            $('[data-toggle="tooltip"]').tooltip({
                container: 'body',
            });

            /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
            const particles_url = $('#particles-json-url').val();
            particlesJS.load('particles-js', particles_url, function() {
                console.info('particles.js config loaded');
            });

            // app tooltip
            let nav_items = $('#app-navigation div:nth-child(1) div');
            nav_items.on('mouseover', function(event){
                let tooltip = $(this).children('span')[0];
                $(tooltip).fadeIn("slow")
            });
            nav_items.on('mouseleave', function(event){
                let tooltip = $(this).children('span')[0];
                $(tooltip).fadeOut("fast")
            });

        }
    })
});