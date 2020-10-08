const progressBar = {
    name: 'ProgressBar',
    template: `
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" 
            role="progressbar" 
            :aria-valuenow="curr_value" 
            :aria-valuemin="min" 
            :aria-valuemax="max" 
            :style="{width:curr_value+'%'}">
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
        }
    },
    data(){
        return {

        }
    },
    methods: {

    }
};