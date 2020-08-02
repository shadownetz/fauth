const AddCandidate = {
    name: 'AddCandidate',
    template: `
<div id="app-add-candidate" class="container-fluid">
    <div class="row">
        <div class="col-12 col-lg-4 pt-5 profile">
            <div class="row">
                <div class="col-12 hide-overflow" style="max-height: 250px">
                    <div class="row justify-content-center text-center">
                        <transition name="profileError" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
                            <div class="profile-err" v-if="file_err_msg">
                               [[file_err_msg]]
                            </div>
                        </transition>
                        <transition name="candidateProfile" enter-active-class="animate__animated animate__fadeInRight animate__delay-1s" leave-active-class="animate__animated animate__fadeOutLeft">
                            <label class="candidate-profile text-center" :class="[snapshot_value?'p-0':'']" id="js-cand-prof" @click="displayCam" :key="'cam'" v-if="is_cam">
                                <img :src="snapshot_value" alt="candidateImage" v-if="snapshot_value" style="border-radius: 50%">
<!--                                <input type="hidden" id="id_snapshot" :value="listenToCamImage">-->
                                <span v-if="!snapshot_value">
                                    <i class="fa fa-camera fa-5x"></i>
                                </span>
                            </label>
                            <label class="candidate-profile text-center" :class="[snapshot_value?'p-0':'']" for="js-file-upload" v-else :key="'file'">
                                <img :src="snapshot_value" alt="candidateImage" v-if="snapshot_value" style="border-radius: 50%">
                                <input type="file" id="js-file-upload" @change="saveProfileImage($event)" accept="image/*">
                                 <span v-if="!snapshot_value">
                                    <i class="fa fa-images fa-5x"></i>
                                </span>
                            </label>
                        </transition>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 pt-3 text-center" @click="is_cam = !is_cam">
                    <div class="col-8 offset-2 offset-lg-2 profile-toggle hover" v-if="!is_cam" :key="'profile-on'">
                        <i class="fa fa-camera"></i> <i class="fa fa-toggle-on fa-3x"></i> <i class="fa fa-image"></i>
                    </div>
                    <div class="col-8 offset-2 offset-lg-2 profile-toggle hover" :key="'profile-off'" v-else>
                        <i class="fa fa-camera"></i> <i class="fa fa-toggle-off fa-3x"></i> <i class="fa fa-image"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-8 candidateDetails pt-5">
            <div class="row">
                <div class="col-12 col-lg-6">
                    <div class="col-12">
                        <label for="name">
                            <i class="fa fa-user"></i>&nbsp; Name
                        </label>
                        <input id="name" v-model="candidate.name" type="text" class="form-control" :class="[!candidate.name?'field-err': '']" placeholder="firstname lastname">
                    </div>
                    <div class="col-12">
                        <label for="name">
                            <i class="fa fa-envelope"></i>&nbsp; Email
                        </label>
                        <input id="email" v-model="candidate.email" type="email" class="form-control" :class="[(candidate.email && emailIsValid(candidate.email))?'': 'field-err']" placeholder="email address">
                    </div>
                    <div class="col-12">
                        <label for="phone">
                            <i class="fa fa-phone-alt"></i>&nbsp; Phone
                        </label>
                        <input id="phone" v-model="candidate.phone" type="tel" class="form-control" :class="[!candidate.phone?'field-err': '']" placeholder="telephone number">
                    </div>
                    <div class="col-12">
                        <label for="dob">
                            <i class="fa fa-calendar"></i>&nbsp; Date of Birth
                        </label>
                        <input id="dob" v-model="candidate.dob" type="date" class="form-control" :class="[(!candidate.dob || !candidate.dob.includes('-'))?'field-err': '']">
                    </div>
                    <div class="col-12">
                            <label for="regNo">
                                <i class="fa fa-book"></i>&nbsp; Registration Number
                            </label>
                            <input id="regNo" v-model="candidate.reg_no" type="text" class="form-control" :class="[!candidate.reg_no?'field-err': '']" placeholder="(unique)">
                        </div>
                </div>
                <div class="col-12 col-lg-6">
                <div class="col-12">
                    <label for="state">
                        <i class="fa fa-globe-africa"></i>&nbsp; State
                    </label>
                    <input id="state" v-model="candidate.state" type="text" class="form-control" :class="[!candidate.state?'field-err': '']" placeholder="state of origin">
                </div>
                <div class="col-12">
                    <label for="lga">
                        <i class="fa fa-globe-africa"></i>&nbsp; Local Government Area
                    </label>
                    <input id="lga" v-model="candidate.lga" type="text" class="form-control" :class="[!candidate.lga?'field-err': '']" placeholder="local government area">
                </div>
                <div class="col-12">
                    <label for="department">
                        <i class="fa fa-home"></i>&nbsp; Department
                    </label>
                    <input id="department" v-model="candidate.department" type="text" class="form-control" :class="[!candidate.department?'field-err': '']" placeholder="department">
                </div>
                
                <div class="col-12">
                    <label for="faculty">
                        <i class="fa fa-home"></i>&nbsp; Faculty
                    </label>
                    <input id="faculty" v-model="candidate.faculty" type="text" class="form-control" :class="[!candidate.faculty?'field-err': '']" placeholder="faculty">
                </div>
            </div>
            </div>
        </div>
        <div class="saveBox hover" :class="[loading?'hide':'']" @click="saveCandidate"><i class="fa fa-save"></i> Save</div>
    </div>
    <web-cam :show="display_cam" @capture="snapshot_value=$event"></web-cam>
</div>
    `,
    delimiters: ['[[', ']]'],
    data(){
        return {
            display_cam: false,
            snapshot_value: '',
            is_cam: false,
            file_err_msg: '',
            emailIsValid: validateEmailAddress,
            candidate: {
                name: '',
                email: '',
                phone: '',
                reg_no: '',
                state: '',
                lga: '',
                department: '',
                faculty: '',
                dob: ''
            },
            loading: false
        }
    },
    watch: {
        file_err_msg(newVal){
            if(newVal)
                setTimeout(()=>{
                    this.file_err_msg = ''
                }, 3000);
        },
    },
    methods: {
        saveProfileImage(event){
            let image = event.target.files[0];
            let image_ver = validateImageUpload([image], ['jpg', 'png', 'jpeg']);
            if(image_ver){
                let reader = new FileReader();
                reader.onload = (e)=>{
                    this.snapshot_value = e.target.result;
                };
                reader.readAsDataURL(image);
            }else{
                this.file_err_msg = "Wrong Image Detected!";
            }
            // reset image input to further detect change event
            $('#js-file-upload').val("");
        },
        async saveCandidate(){
            this.loading = true;
            let loader = loading('#app-add-candidate');
            let baseURL = location.href.split('/');
            // protocol, host
            baseURL = baseURL[0]+'//'+baseURL[2];
            try{
                if(!this.snapshot_value){
                    this.file_err_msg = "Please upload an image file or take a snapshot to continue";
                    throw null
                }
                let candidate = this.candidate;
                if(!candidate.name || !candidate.email ||
                    !candidate.phone || !candidate.reg_no ||
                    !candidate.state || !candidate.lga ||
                    !candidate.department || !candidate.faculty ||
                    (!candidate.dob || !candidate.dob.includes('-')) || !this.emailIsValid(candidate.email)){
                    throw null
                }
                // Does email already exist
                let email_exist_url = $('#js-email-exist-url').val();
                let email_validate_response = await $.ajax({
                    url: baseURL+email_exist_url,
                    type: 'POST',
                    data: {email: this.candidate.email},
                    dataType: 'json',
                });
                if(email_validate_response.status){
                    throw {message: email_validate_response.message}
                }
                // Does image already exist
                let image_exist_url = $('#js-image-exist-url').val();
                let image_response = await $.ajax({
                    url: baseURL+image_exist_url,
                    type: 'POST',
                    data: {snapshot: this.snapshot_value},
                    dataType: 'json',
                });
                if(image_response.status){
                    throw {message: "A record already exist for this candidate"}
                }
                // make sure valid passport is uploaded and has a single face
                let image_single_face_url = $('#js-image-singleface-url').val();
                let image_validate_response = await $.ajax({
                    url: baseURL+image_single_face_url,
                    type: 'POST',
                    data: {image: this.snapshot_value},
                    dataType: 'json',
                });
                if(!image_validate_response.status){
                    throw {message: image_validate_response.message}
                }

                let request = this.candidate;
                request.dob = new Date(this.candidate.dob).toISOString();
                request.snapshot_value = this.snapshot_value;
                let response = await $.ajax({
                    url: baseURL+$('#api_add_candidate_url').val(),
                    type: 'POST',
                    data: request,
                    dataType: 'json',
                });
                if(response.status){
                    toastr.success("Candidate Saved", "Success");
                    this.$router.push({name: 'Dashboard'})
                }else{
                    throw {message: response.message}
                }
            }catch (e) {
                this.loading = false;
                loader.hide();
                if(e && (e.message || e.statusText))
                    toastr.error(e.message||e.statusText, "Error");
                console.log(e)
            }
        },
        displayCam(){
            $('#webCamModal').modal({
                backdrop: 'static',
                show: true
            });
            this.display_cam = true
        }
    },
    components: {webCam: fauthWebCam},
    beforeRouteLeave(to, from, next) {
        this.display_cam = false;
        setTimeout(()=>{
            next();
        }, 500)
    }
};