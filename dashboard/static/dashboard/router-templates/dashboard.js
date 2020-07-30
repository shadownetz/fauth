const Dashboard = {
    name: 'Dashboard',
    template: `
<div class="app-dash">
    <div class="dash-content part-1">
        <label class="text-center" id="app-webcam-btn">
            <i class="fa fa-camera-retro fa-5x"></i>
            <input type="hidden" id="id_snapshot" :value="listenToCamImage">
        </label>
        <div class="content-info text-left">
            <p>WebCam</p>
            <p class="text-primary">Take a snapshot of the candidate using your webcam.</p>
        </div>
    </div>
    <div class="dash-content part-2">
        <label class="text-center" for="id_fauth_image_file">
            <i class="fa fa-images fa-5x"></i>
            <input type="file" id="id_fauth_image_file" accept="image/*" @change="assignSnapshotImage($event)">
        </label>
        <div class="content-info text-left">
            <p>Image File</p>
            <p class="text-warning">Upload a single passport photo of the candidate</p>
        </div>
        <transition name="custom-img-err" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
            <div id="fauth_image_err" v-if="fauth_image_err_msg">
                <span class="animate__animated animate__zoomIn">[[fauth_image_err_msg]]</span>
            </div>
        </transition>
    </div>
    <transition name="auth_load_anim" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
        <div id="faceAuthLoadOverlay" v-if="loading">
            <!-- Our custom modal -->
            <div class="authContainer animate__animated animate__zoomIn">
            <div class="close" @click="loading=false">
                <i class="fa fa-window-close"></i>
            </div>
                <!-- when processsing authentication  -->
<!--                <transition name="auth_load" enter-active-class="animate_animated animate_fadeIn" leave-active-class="animate_animated animate_fadeOut">-->
                    <div class="process animate__animated animate__fadeIn" :style="{backgroundImage: 'url('+display_bg+ ')'}" v-if="!loading_done">
                        <div id="process_err" v-if="loading_error">
                            <div class="highlight c1"></div>
                            <div class="highlight c2"></div>
                            <div id="process_err_msg" class="text-center text-uppercase">
                                <h3>[[loading_error_message]]</h3>
                            </div>
                        </div>
                    </div>
<!--                </transition>-->
<!--                <transition name="auth_load_2" enter-active-class="animate_animated animate_slideInLeft" leave-active-class="animate_animated animate_slideOutLeft">-->
                    <div class="process lvl1 animate__animated animate__slideInLeft" v-if="loading_done">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="pro-img-box">
                                    <div class="pro-img" :style="{backgroundImage: 'url('+candidateInfo.image+')'}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
<!--                </transition>-->
<!--                <transition name="auth_load_3" enter-active-class="animate_animated animate_slideInRight" leave-active-class="animate_animated animate_slideOutLeft">-->
                    <div class="process lvl2 animate__animated animate__slideInRight" v-if="loading_done">
                        <div class="container-fluid details">
                            <div class="row">
                                <div class="col-12">
                                    <table class="table table-responsive">
                                        <tr class="animate__animated animate__slideInLeft" style="animation-delay: .2s">
                                            <td class="no-border-top">
                                                <i class="fa fa-user-alt"></i> Name
                                            </td>
                                            <td class="no-border-top">[[candidateInfo.name]]</td>
                                        </tr>
                                        <tr class="animate__animated animate__slideInLeft" style="animation-delay: .3s">
                                            <td><i class="fa fa-envelope-square"></i> Email</td>
                                            <td>[[candidateInfo.email]]</td>
                                        </tr>
                                        <tr class="animate__animated animate__slideInLeft" style="animation-delay: .4s">
                                            <td><i class="fa fa-phone-square"></i> Phone</td>
                                            <td>[[candidateInfo.phone]]</td>
                                        </tr>
                                        <tr class="animate__animated animate__slideInLeft" style="animation-delay: .5s">
                                            <td><i class="fa fa-book"></i> Registeration No</td>
                                            <td>[[candidateInfo.regNo]]</td>
                                        </tr>
                                        <tr class="animate__animated animate__slideInLeft" style="animation-delay: .6s">
                                            <td><i class="fa fa-globe"></i> State of Origin</td>
                                            <td>[[candidateInfo.state]]</td>
                                        </tr>
                                        <tr class="animate__animated animate__slideInLeft" style="animation-delay: .7s">
                                            <td><i class="fa fa-globe"></i> Local Government Area</td>
                                            <td>[[candidateInfo.lga]]</td>
                                        </tr>
                                        <tr class="animate__animated animate__slideInLeft" style="animation-delay: .8s">
                                            <td><i class="fa fa-home"></i> Current Department</td>
                                            <td>[[candidateInfo.department]]</td>
                                        </tr>
                                        <tr class="animate__animated animate__slideInLeft" style="animation-delay: .9s">
                                            <td><i class="fa fa-home"></i> Faculty</td>
                                            <td>[[candidateInfo.faculty]]</td>
                                        </tr>
                                        <tr class="animate__animated animate__slideInLeft" style="animation-delay: 1s">
                                            <td><i class="fa fa-calendar-day"></i> Date of Birth</td>
                                            <td>[[parseDateString(candidateInfo.dob)]]</td>
                                        </tr>
                                        <tr class="animate__animated animate__slideInLeft" style="animation-delay: 1.1s">
                                            <td><i class="fa fa-calendar-week"></i> Date Updated</td>
                                            <td>[[parseDateString(candidateInfo.dateUpdated)]]</td>
                                        </tr>
                                        <tr class="animate__animated animate__slideInLeft" style="animation-delay: 1.2s">
                                            <td><i class="fa fa-calendar-check"></i> Date Created</td>
                                            <td>[[parseDateString(candidateInfo.dateCreated)]]</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
<!--                </transition>-->
                
                <!-- after processing authentication -->
                
            </div>
        </div>
    </transition>
</div>
`,
    delimiters: ['[[', ']]'],
    data(){
        return {
            fauthWebCam: null,
            snapshot_value: '',
            fauth_image_file: '',
            fauth_image_err_msg: '',
            loading: false,
            loading_done: false,
            loading_error: false,
            loading_error_message: '',
            display_bg: '',
            loading_bg: [],
            api_url: '',
            candidateInfo: {},
        }
    },
    watch: {
        loading(newVal){
            if(!newVal){
                this.display_bg = this.loading_bg[0];   // reset loading gif image
                this.loading_done = this.loading_error = false;
                this.loading_error_message = '';
                this.candidateInfo = {}
            }
        }
    },
    computed: {
        listenToCamImage(){
            setInterval(()=>{
                let b64Image = this.fauthWebCam.snapshotValue;
                let changeStatus = this.fauthWebCam.change;
                // new snapshot has been taken
                if(b64Image !== this.snapshot_value && changeStatus){
                    this.fauthWebCam.change = false;    // reset change flag
                    this.snapshot_value = b64Image;
                    this.processAuthentication()
                }
            }, 500);
            return ''
        }
    },
    methods: {
        async processAuthentication(){
            this.loading = true;
            // set face verification success gif image
            // get verification response from server
            try{
                let response = await $.ajax({
                    url: this.api_url,
                    type: 'POST',
                    data: {
                        snapshot: this.snapshot_value
                    },
                    dataType: 'json',
                });
                let status = response.status;
                if(status){
                    // display success animation
                    setTimeout(()=>{
                        this.display_bg = this.loading_bg[1];
                    }, 2000);
                    // display
                    setTimeout(()=>{
                        // view candidate details
                        // the loading done value changes makes the element to display
                        // the candidate details to show up based on the if-else condition already
                        // set on the dashboard template
                        // TODO: Remember to style the candidate display element, table
                        this.loading_done = true;
                        this.candidateInfo = response.candidate;
                        console.log("Candidate Info:", this.candidateInfo)
                    }, 4000)
                }else{
                    // error
                    setTimeout(()=>{
                        this.display_bg = this.loading_bg[2];
                        this.loading_error_message = 'No Match Found';
                        this.loading_error = true;
                    },2000)
                }
            }catch (e) {
                // set error message
                setTimeout(()=>{
                    this.display_bg = this.loading_bg[2];
                    this.loading_error_message = e.message;
                    this.loading_error = true;
                },5000)
            }
        },
        assignSnapshotImage(event){
            let image = event.target.files[0];
            let image_ver = this.validateImageUpload(image);
            if(image_ver){
                let reader = new FileReader();
                reader.onload = (e)=>{
                    this.snapshot_value = e.target.result;
                    this.processAuthentication()
                };
                reader.readAsDataURL(image);
            }else{
                this.fauth_image_err_msg = "Wrong Image Detected!";
                setTimeout(()=>{
                    this.fauth_image_err_msg = ''
                }, 3000);
            }
            // reset image input to further detect change event
            $('#id_fauth_image_file').val("");
        },
        validateImageUpload(image_file){
            let file_type = image_file.name.split('.').pop();
            return $.inArray(file_type, ['jpg', 'png', 'jpeg']) >= 0;
        },
        parseDateString(timestamp){
            let date = new Date(timestamp);
            if(date != 'Invalid Date' && date.getFullYear() !== 1970){
                return `${date.getDate()} ${monthList[date.getMonth()]} ${date.getFullYear()}`
            }
            return 'No Date Specified'
        }
    },
    created(){
        // allow elements to load before initializing
        setTimeout(()=>{
            this.fauthWebCam = new FauthWebCam({
                launchBTN: '#app-webcam-btn',
                bodyID: '.app-dash',
                outputID: '#id_snapshot'
            });
            this.fauthWebCam.initialize();
            let bg1 = $('#auth_loading_img_1').val();   // face verification gif image
            this.loading_bg.push(bg1);
            this.display_bg = bg1;
            this.loading_bg.push($('#auth_loading_img_2').val());
            this.loading_bg.push($('#auth_loading_img_3').val());
            this.loading_bg.push($('#auth_loading_img_4').val());
            this.api_url = $('#api_get_candidate_image_info_url').val();
            $('[data-toggle="tooltip"]').tooltip({
                container: 'body',
            });
        }, 500)
    }
};