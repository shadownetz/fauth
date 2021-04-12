const UserSettings = {
    name: 'UserSettings',
    delimiters: ['[[', ']]'],
    template: `
        <div id="app-user-settings" class="container-fluid">
            <div class="row">
                <div class="col-12 py-3">
                    <h5 class="text-info">
                    <i class="fa fa-user-lock"></i> Authentication Methods
                    </h5>
                    <small class="text-warning">
                        You can enable one or multiple methods for signing in
                    </small>
                    <div class="form-check pt-5">
                      <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" checked disabled>
                      <label class="form-check-label" for="defaultCheck1">
                        Facial Authentication&nbsp;<small><span class="text-warning">(default)</span></small>
                      </label>
                    </div>
                    <div class="form-check pt-3">
                      <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" v-model="settings.emailAuth" >
                      <label class="form-check-label" for="defaultCheck1">
                        Email &amp; Password&nbsp;<small><span class="text-danger">please treat with caution!</span></small>
                      </label>
                    </div>
                </div>
            </div>
        </div>
    `,
    data(){
        return {
            settings_update_api: '',
            settings_fetch_api: '',
            loaded: false,
            user: {
                id: ''
            },
            settings: {
                emailAuth: false
            },
        }
    },
    watch: {
        'settings.emailAuth': function(){
            if(this.loaded){
                this.updateSettings()
            }
        }
    },
    methods: {
        async getSettings(){
            const loader = loading('#app-user-settings');
            try{
                const response = await $.ajax({
                    url: this.settings_fetch_api,
                    type: 'POST',
                    data: {
                        userId: this.user.id
                    },
                    dataType: 'json',
                });
                if(response.status){
                    this.settings = Object.assign(this.settings, response.data);
                    setTimeout(()=>{
                        this.loaded = true
                    }, 2000)
                }
            }catch (e) {
                console.log('Err while fetching settings info:', e)
            }
            loader.hide()
        },
        async updateSettings(){
            const loader = loading('#app-user-settings');
            try{
                const response = await $.ajax({
                    url: this.settings_update_api,
                    type: 'POST',
                    data: {
                        userId: this.user.id,
                        ...Object.assign({}, this.settings)
                    },
                    dataType: 'json',
                });
                if(response.status){
                    toastr.success("Operation successful");
                }
                this.getSettings()
            }catch (e) {
                if(e && (e.message || e.statusText))
                    toastr.error(e.message||e.statusText, "Error");
                console.log('Unable to complete operation', e)
            }
            loader.hide()
        },
    },
    mounted(){
        setTimeout(()=>{
            this.user.id = $('#api_user_id').val();
            this.settings_fetch_api = $('#api_fetch_settings_url').val();
            this.settings_update_api = $('#api_update_settings_url').val();
            this.getSettings()
        }, 500)
    }
};