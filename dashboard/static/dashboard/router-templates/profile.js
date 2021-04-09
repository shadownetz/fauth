const Profile = {
    name: 'Profile',
    delimiters: ['[[', ']]'],
    template: `
        <div id="app-profile" class="container-fluid">
            <div class="row">
                <div class="col-12 col-lg-4 pt-5">
                    <div class="row">
                        <div class="col-12" style="max-height: 250px">
                            <div class="row justify-content-center">
                                <label class="candidate-profile">
                                    <img :src="[[user.avatar]]" alt="userImage" style="border-radius: 50%">
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 pt-3 text-center">
                            <h3>[[user.name]]</h3>
                            <small class="text-warning">Fullname</small>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-8 candidateDetails pt-5" style="position: relative" v-if="!edit_mode">
                    <div class="row">
                        <div class="col-12">
                            <div class="col-12">
                                <label for="name">
                                    <i class="fa fa-user"></i>&nbsp; Name
                                </label>
                                <h4>[[user.name]]</h4>
                            </div>
                            <div class="col-12">
                                <label for="name">
                                    <i class="fa fa-envelope"></i>&nbsp; Email
                                </label>
                                <h4>[[user.email]]</h4>
                            </div>
                            <div class="col-12">
                                <label for="phone">
                                    <i class="fa fa-phone-alt"></i>&nbsp; Phone
                                </label>
                                <h4>[[user.phone]]</h4>
                            </div>
                            <div class="col-12 text-center">
                                <button class="btn" @click="edit_mode=true">
                                    <i class="fa fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-8 candidateDetails pt-5" v-else>
                    <div class="row">
                        <div class="col-12">
                            <div class="col-12">
                                <label for="name">
                                    <i class="fa fa-user"></i>&nbsp; Name
                                </label>
                                <input id="name" v-model="user_mod.name" type="text" class="form-control" :class="[!user_mod.name?'field-err': '']" :placeholder="user.name">
                            </div>
                            <div class="col-12">
                                <label for="name">
                                    <i class="fa fa-envelope"></i>&nbsp; Email
                                </label>
                                <input id="email" v-model="user_mod.email" type="email" class="form-control" :class="[(user_mod.email && emailIsValid(user_mod.email))?'': 'field-err']" :placeholder="user.email">
                            </div>
                            <div class="col-12">
                                <label for="phone">
                                    <i class="fa fa-phone-alt"></i>&nbsp; Phone
                                </label>
                                <input id="phone" v-model="user_mod.phone" type="tel" class="form-control" :class="[!user_mod.phone?'field-err': '']" :placeholder="user.phone">
                            </div>
                            <div class="col-12">
                                <label for="pass">
                                    <i class="fa fa-lock"></i>&nbsp; Password 
                                </label>
                                <input id="pass" v-model="user_mod.password" type="password" class="form-control" :class="[(!user_mod.password || user_mod.password.length<8)?'field-err': '']" placeholder="********">
                                <small class="text-warning">Note that once a password is modified you will be logged out and be required to re-login.</small>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-around mt-3">
                        <button class="btn" @click="edit_mode=false">
                           <i class="fa fa-ban"></i> Cancel
                         </button>
                         <button class="btn" @click.prevent="updateUserDetails">
                           <i class="fa fa-save"></i> Save
                         </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    data(){
        return {
            user_details_api: '',
            user_update_api: '',
            user: {
                id: '',
                avatar: '',
                name: '',
                email: '',
                phone: '',
                last_login: '',
                date_created: ''
            },
            user_mod: {
                avatar: '',
                name: '',
                email: '',
                phone: '',
                password: ''
            },
            edit_mode: false,
            emailIsValid: validateEmailAddress
        }
    },
    methods: {
        async getUserDetails(){
            const loader = loading('#app-profile');
            try{
                const {id} = this.user;
                const response = await $.ajax({
                    url: this.user_details_api,
                    type: 'POST',
                    data: {id},
                    dataType: 'json',
                });
                if(response.status){
                    this.user = Object.assign(this.user, response.data)
                }
            }catch (e) {
                console.log('Err while fetching user info:', e)
            }
            loader.hide()
        },
        async updateUserDetails(){
            if(this.verifyCorrectUpdateInputs()){
                const loader = loading('#app-profile');
                try{
                    const {id} = this.user;
                    const response = await $.ajax({
                        url: this.user_update_api,
                        type: 'POST',
                        data: {
                            id,
                            ...Object.assign({}, this.user_mod)
                        },
                        dataType: 'json',
                    });
                    if(response.status){
                        toastr.success("Operation successful");
                        setTimeout(()=>{
                            location.reload();
                        }, 1500)
                    }
                }catch (e) {
                    if(e && (e.message || e.statusText))
                        toastr.error(e.message||e.statusText, "Error");
                    console.log('Unable to complete operation', e)
                }
                loader.hide()
            }
        },
        verifyCorrectUpdateInputs(){
            if(!this.user_mod.name && !this.user_mod.email && !this.user_mod.phone && !this.user_mod.password){
                return toastr.warning("No changes detected!")
            }
            if(this.user_mod.phone || this.user_mod.password){
                if(this.user_mod.phone <= 4){
                    return toastr.error("Invalid phone number detected!")
                }
                if(this.user_mod.password.length < 8){
                    return toastr.warning("Password should be greater than 8 characters!")
                }
            }
            return true
        }
    },
    mounted(){
        setTimeout(()=>{
            this.user.id = $('#api_user_id').val();
            this.user_update_api = $('#api_update_user_info_url').val();
            this.user_details_api = $('#api_fetch_user_info_url').val();
            this.getUserDetails()
        }, 500)
    }
};