const progressBar = {
    name: 'ProgressBar',
    template: `
        <div class="progress">
            <div 
            id="fauth-progress-bar" 
            class="progress-bar progress-bar-striped progress-bar-animated" 
            role="progressbar" 
            :aria-valuenow="curr_value" 
            :aria-valuemin="min" 
            :aria-valuemax="max" 
            >
            [[curr_value+'%']]
            </div>
        </div>
    `,
    delimiters: ['[[', ']]'],
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        curr_value: {
            type: Number,
            required: true
        },
        mount: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        /**
         * Animate to dynamic values flawlessly
         * @param newVal
         */
        curr_value(newVal){
            let fauth_progress = $('#fauth-progress-bar');
            fauth_progress.stop(true, false);
            fauth_progress.animate({
                width: newVal+'%'
            }, 'fast')
        },
        /**
         * If component is unmounted reset progress value to default
         * @param newVal
         */
        mount(newVal){
            if(!newVal)
                this.curr_value = 0
        }
    }
};