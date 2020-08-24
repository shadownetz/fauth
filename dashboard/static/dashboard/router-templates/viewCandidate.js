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
                                <a class="dropdown-item" href="javascript:void(0)">Edit</a>
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
            <div class="error_box text-center text-danger p-3" v-if="error">
                <h5>[[message]]</h5>
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
    </div>
</div>
    `,
    delimiters: ['[[', ']]'],
    data(){
        return {
            api_url: "",
            loading: true,
            error: false,
            message: '',
            candidates: [],
            previewImg: ''
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
        getReadableTimestamp(timestamp){
            if(typeof timestamp === "string"){
                let _date = new Date(timestamp);
                if(_date.getTime() === _date.getTime()){
                    return `${_date.getUTCDate()}/${(_date.getUTCMonth()+1)}/${_date.getUTCFullYear()}`
                }
            }
            return 'no date'
        }
    },
    created(){
        setTimeout(()=>{
            this.api_url = $('#api_fetch_candidates_url').val();
            this.fetchCandidates();
        }, 500)
    }
};