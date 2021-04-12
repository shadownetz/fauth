const ViewLogs = {
    name: 'ViewLogs',
    template: `
<div class="container-fluid" id="app-view-admins">
    <div class="row">
        <div class="col-12 px-0">
            <table v-if="logs.length > 0 && !loading" class="table table-responsive-md table-striped">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Image</th>
                        <th scope="col">Verification status</th>
                        <th scope="col">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(log, index) in logs" :key="index">
                        <th scope="row">[[index+1]]</th>
                        <td>
                            <div class="profile-img" :style="{backgroundImage: 'url('+log.image+')'}">
                                        <div class="img-overlay animate__animated animate__fadeIn text-center" @click="previewImg=log.image" data-toggle="modal" data-target="#v-admin-modal">
                                            <i class="fa fa-eye"></i>
                                        </div>
                             </div> 
                        </td>
                        <td>
                            <span v-if="log.status" class="badge badge-success"><i class="fa fa-check"></i></span>
                            <span v-else class="badge badge-danger"><i class="fa fa-window-close"></i></span>
                        </td>
                        <td>[[getReadableTimestamp(log.timestamp)]]</td>
                    </tr>
              </tbody>
            </table>
            <div class="error_box text-center text-danger p-3" v-else-if="error">
                <h5>[[message]]</h5>
            </div>
            <div class="col-12 text-center" v-else>
                <h4>The Log List is Empty <i class="fa fa-user-alt-slash"></i></h4>
            </div>
        </div>
        
        
        <!-- View Log Image Modal -->
        <div class="modal animate__animated animate__zoomIn" id="v-admin-modal" tabindex="-1" role="dialog" aria-labelledby="v-admin-modal-title" aria-hidden="true">
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
            previewImg: '',
            logs: [],
        }
    },
    computed: {

    },
    methods: {
        async fetchLogs(){
            this.loading = true;
            this.error = false;
            let loader = loading('#app-view-admins');
            try{
                let response = await $.ajax({
                    url: this.api_url,
                    type: 'GET',
                    dataType: 'json',
                });
                this.logs = response.data
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
        },
    },
    components: {
        progressBar
    },
    created(){
        setTimeout(()=>{
            this.api_url = $('#api_fetch_logs_url').val();
            this.fetchLogs();
        }, 500)
    }
};