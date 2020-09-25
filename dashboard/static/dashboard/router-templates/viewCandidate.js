const ViewCandidate = {
    name: 'ViewCandidate',
    template: `
<div class="container-fluid" id="app-view-candidate">
    <div class="row">
        <div class="col-12 px-0" id="v-candidates">
            <table v-if="candidates.length > 0 && !loading" class="table table-responsive table-striped">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Reg.Number</th>
                        <th scope="col">State</th>
                        <th scope="col">LGA</th>
                        <th scope="col">Department</th>
                        <th scope="col">Faculty</th>
                        <th scope="col">DOB</th>
                        <th scope="col">Updated</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(candidate, index) in candidates" :key="index">
                        <th scope="row">[[index+1]]</th>
                        <td class="options">
                            <button class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-ellipsis-v"></i>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="javascript:void(0)" @click="s_candidate=candidate" data-toggle="modal" data-target="#e-candidate-modal">Edit</a>
                                <a class="dropdown-item" href="javascript:void(0)">Delete</a>
                            </div>
                        </td>
                        <td>
                            <div class="profile-img" :style="{backgroundImage: 'url('+candidate.image+')'}">
                                        <div class="img-overlay animate__animated animate__fadeIn text-center" @click="previewImg=candidate.image" data-toggle="modal" data-target="#v-candidate-modal">
                                            <i class="fa fa-eye"></i>
                                        </div>
                             </div> 
                        </td>
                        <td>
                            [[candidate.name]]<br>
                            <span class="sl">Added: [[getReadableTimestamp(candidate.dateCreated)]]</span>
                        </td>
                        <td>[[candidate.email]]</td>
                        <td>[[candidate.phone]]</td>
                        <td>[[candidate.regNo]]</td>
                        <td>[[candidate.state]]</td>
                        <td>[[candidate.lga]]</td>
                        <td>[[candidate.department]]</td>
                        <td>[[candidate.faculty]]</td>
                        <td>[[getReadableTimestamp(candidate.dob)]]</td>
                        <td>[[getReadableTimestamp(candidate.dateUpdated)]]</td>
                    </tr>
              </tbody>
            </table>
            <div class="error_box text-center text-danger p-3" v-else-if="error">
                <h5>[[message]]</h5>
            </div>
            <div class="col-12 text-center" v-else>
                <h4>The Candidate List is Empty <i class="fa fa-users"></i></h4>
            </div>
        </div>
        
        
        <!-- View Candidate Image Modal -->
        <div class="modal animate__animated animate__zoomIn" id="v-candidate-modal" tabindex="-1" role="dialog" aria-labelledby="v-candidate-modal-title" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
<!--                <button type="button" class="close" data-dismiss="modal" aria-label="Close">-->
<!--                  <span aria-hidden="true">&times;</span>-->
<!--                </button>-->
              </div>
              <div class="modal-body">
                <div class="row justify-content-center">
                    <div class="cand-prev" :style="{backgroundImage:'url('+previewImg+')'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Edit Candidate Modal -->
        <div class="modal fade" id="e-candidate-modal" tabindex="-1" role="dialog" aria-labelledby="e-candidate-label-modal" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="e-candidate-label-modal">[[s_candidate.name]]</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body" id="e-candidate-modal-body">
              <div class="container-fluid">
                  <div class="row">
                        <div class="col-12 e-candidate-profile-img">
                            <div class="row justify-content-center">
                                <div class="img-block" :style="{backgroundImage: 'url('+s_candidate.image+')'}">
                                    <label id="candidate-image-label" for="candidate-image" class="animate__animated animate__fadeIn">
                                        <input type="file" id="candidate-image" @change="load_new_profile_img($event)" accept="image/*">
                                        <i class="fa fa-image fa-2x"></i>
                                    </label>
                                </div>
                                <div class="col-2 pt-5 hover" title="remove image" v-if="new_profile_img" @click="remove_profile_img">
                                    <i class="fa fa-trash"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="candidate-name">Name</label>
                                <input type="text" id="candidate-name" v-model="s_candidate.name" class="form-control" placeholder="Firstname Othername">
                            </div>
                            <div class="form-group">
                                <label for="candidate-email">Email</label>
                                <input type="email" id="candidate-email" v-model="s_candidate.email" class="form-control" placeholder="Email">
                            </div>
                             <div class="form-group">
                                <label for="candidate-phone">Phone</label>
                                <input type="tel" id="candidate-phone" v-model="s_candidate.phone" class="form-control" placeholder="Phone">
                             </div>
                             <div class="form-group">
                                <label for="candidate-dob">Date of Birth</label>
                                <input type="date" id="candidate-dob" v-model="dob" class="form-control" placeholder="DOB">
                             </div>
                             <div class="form-group">
                                <label for="candidate-regno">Registration Number</label>
                                <input type="text" id="candidate-regno" v-model="s_candidate.regNo" class="form-control" placeholder="Reg. No">
                             </div>
                             <div class="form-group">
                                <label for="candidate-state">State</label>
                                <input type="text" id="candidate-state" v-model="s_candidate.state" class="form-control" placeholder="State">
                             </div>
                             <div class="form-group">
                                <label for="candidate-lga">L.G.A</label>
                                <input type="text" id="candidate-lga" v-model="s_candidate.lga" class="form-control" placeholder="LGA">
                             </div>
                             <div class="form-group">
                                <label for="candidate-department">Department</label>
                                <input type="text" id="candidate-department" v-model="s_candidate.department" class="form-control" placeholder="Department">
                             </div>
                             <div class="form-group">
                                <label for="candidate-faculty">Faculty</label>
                                <input type="text" id="candidate-faculty" v-model="s_candidate.faculty" class="form-control" placeholder="Faculty">
                             </div>
                        </div>
                   </div>
               </div>
                
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click.prevent="updateCandidateInfo">Save changes</button>
              </div>
            </div>
          </div>
        </div>
    </div>
</div>
    `,
    delimiters: ['[[', ']]'],
    data(){
        return {
            api_url: "",
            update_candidate_url: "",
            loading: true,
            error: false,
            message: '',
            candidates: [],
            previewImg: '',
            s_candidate: {},
            new_profile_img: null
        }
    },
    computed: {
        dob: {
            get: function(){
                let _date = new Date(this.s_candidate.dob);
                if(_date.getTime() === _date.getTime())
                    return `${_date.getFullYear()}-${_date.getMonth()<10?'0'+_date.getMonth(): _date.getMonth()}-${_date.getDate()<10?'0'+_date.getDate(): _date.getDate()}`;
                return ''
            },
            set: function (new_value){
                this.s_candidate.dob = new_value
            }
        }
    },
    methods: {
        async fetchCandidates(){
            this.loading = true;
            this.error = false;
            let loader = loading('#v-candidates');
            try{
                let response = await $.ajax({
                    url: this.api_url,
                    type: 'GET',
                    dataType: 'json',
                });
                this.candidates = response.candidates
            }catch (e) {
                this.error = true;
                this.message = e.message
            }
            this.loading = false;
            loader.hide()
        },
        async updateCandidateInfo(){
            let loader = loading('#e-candidate-modal-body');
            let update_data = this.s_candidate;
            let _image = {image: null};
            if(update_data.dob.includes('-'))
                update_data.dob = new Date(update_data.dob).toISOString();
            if(this.new_profile_img)
                _image.image = this.new_profile_img;
            try{
                let baseURL = location.href.split('/');
                // protocol, host
                baseURL = baseURL[0]+'//'+baseURL[2];
                let response = await $.ajax({
                    url: baseURL+this.update_candidate_url,
                    type: 'POST',
                    dataType: 'json',
                    data: {...update_data, ..._image}
                });
                if(response.status){
                    $('#e-candidate-modal').modal('hide');
                    this.fetchCandidates();
                    toastr.success("Candidate Data Updated", "Success")
                }else{
                   toastr.error(response.message)
                }
            }catch (e) {
               toastr.error(e.message)
            }finally {
                loader.hide()
            }
        },
        getReadableTimestamp(timestamp){
            if(typeof timestamp === "string"){
                let _date = new Date(timestamp);
                if(_date.getTime() === _date.getTime()){
                    return `${_date.getUTCDate()}/${(_date.getUTCMonth()+1)}/${_date.getUTCFullYear()}`
                }
            }
            return 'no date'
        },
        load_new_profile_img(event){
            let file = event.target.files[0];
            if(validateImageUpload([file], ['jpg', 'png', 'jpeg'])){
                let reader = new FileReader();
                reader.onload = (e)=>{
                    let result = e.target.result;
                    this.new_profile_img = result;
                    $('.img-block').css('background-image', `url(${result})`)
                };
                reader.readAsDataURL(file);
            }else{
                toastr.error("Invalid Image uploaded")
            }
        },
        remove_profile_img(){
            this.new_profile_img = null;
            $('#candidate-image').val('');
            $('.img-block').css('background-image', `url(${this.s_candidate.image})`)
        }
    },
    created(){
        setTimeout(()=>{
            this.api_url = $('#api_fetch_candidates_url').val();
            this.update_candidate_url = $('#api_update_candidate_url').val();
            this.fetchCandidates();
        }, 500)
    }
};