const ViewAdmins = {
    name: 'ViewAdmins',
    template: `
<div class="container-fluid" id="app-view-admins">
    <div class="row">
        <div class="col-12 px-0">
            <table v-if="admins.length > 0 && !loading" class="table table-responsive table-striped">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Active</th>
                        <th scope="col">Admin</th>
                        <th scope="col">SuperAdmin</th>
                        <th scope="col">Last Login</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(admin, index) in admins" :key="index">
                        <th scope="row">[[index+1]]</th>
                        <td class="options">
                            <button class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-ellipsis-v"></i>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="javascript:void(0)" @click="s_admin=admin" data-toggle="modal" data-target="#e-admin-modal">Edit</a>
                                <a class="dropdown-item" href="javascript:void(0)" @click="view_delete_modal(admin)">Delete</a>
                            </div>
                        </td>
                        <td>
                            <div class="profile-img" :style="{backgroundImage: 'url('+admin.avatar+')'}">
                                        <div class="img-overlay animate__animated animate__fadeIn text-center" @click="previewImg=admin.avatar" data-toggle="modal" data-target="#v-admin-modal">
                                            <i class="fa fa-eye"></i>
                                        </div>
                             </div> 
                        </td>
                        <td>
                            [[admin.name]]<br>
                            <span class="sl">Added: [[getReadableTimestamp(admin.date_created)]]</span>
                        </td>
                        <td>[[admin.email]]</td>
                        <td>[[admin.phone]]</td>
                        <td>
                            <span v-if="admin.is_active" class="badge badge-success"><i class="fa fa-check"></i></span>
                            <span v-else class="badge badge-danger"><i class="fa fa-window-close"></i></span>
                        </td>
                        <td>
                            <span v-if="admin.is_staff" class="badge badge-success"><i class="fa fa-check"></i></span>
                            <span v-else class="badge badge-danger"><i class="fa fa-window-close"></i></span>
                        </td>
                        <td>
                            <span v-if="admin.is_superuser" class="badge badge-success"><i class="fa fa-check"></i></span>
                            <span v-else class="badge badge-danger"><i class="fa fa-window-close"></i></span>
                        </td>
                        <td>[[getReadableTimestamp(admin.last_login)]]</td>
                    </tr>
              </tbody>
            </table>
            <div class="error_box text-center text-danger p-3" v-else-if="error">
                <h5>[[message]]</h5>
            </div>
            <div class="col-12 text-center" v-else>
                <h4>The Admin List is Empty <i class="fa fa-user-alt-slash"></i></h4>
            </div>
        </div>
        
        
        <!-- View Admin Image Modal -->
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
        
        <!-- Edit Admin Modal -->
        <div class="modal fade" id="e-admin-modal" tabindex="-1" role="dialog" aria-labelledby="e-admin-label-modal" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="e-admin-label-modal">[[s_admin.name]]</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body" id="e-admin-modal-body">
              <div class="container-fluid">
                  <div class="row">
                        <div class="col-12 e-admin-profile-img">
                            <div class="row justify-content-center">
                                <div class="img-block" :style="{backgroundImage: 'url('+s_admin.avatar+')'}">
                                    <label id="admin-image-label" for="admin-image" class="animate__animated animate__fadeIn">
                                        <input type="file" id="admin-image" @change="load_new_profile_img($event)" accept="image/*">
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
                                <label for="admin-name">Name</label>
                                <input type="text" id="admin-name" v-model="s_admin.name" class="form-control" placeholder="Firstname Othername">
                            </div>
                            <div class="form-group">
                                <label for="admin-email">Email</label>
                                <input type="email" id="admin-email" v-model="s_admin.email" class="form-control" placeholder="Email">
                            </div>
                             <div class="form-group">
                                <label for="admin-phone">Phone</label>
                                <input type="tel" id="admin-phone" v-model="s_admin.phone" class="form-control" placeholder="Phone">
                             </div>
                             <div class="form-group">
                                <label>Active</label>
                                <div class="form-check form-check-inline">
                                      <input class="form-check-input" type="radio" name="adminActive" id="adminActive1" v-model="s_admin.is_active" :value="true">
                                      <label class="form-check-label" for="adminActive1">True</label>
                                </div>
                                <div class="form-check form-check-inline">
                                      <input class="form-check-input" type="radio" name="adminActive" id="adminActive2" v-model="s_admin.is_active" :value="false">
                                      <label class="form-check-label" for="adminActive2">False</label>
                                </div>
                             </div>
                             <div class="form-group">
                                <label>Staff</label>
                                <div class="form-check form-check-inline">
                                      <input class="form-check-input" type="radio" name="adminStaff" id="adminStaff1" v-model="s_admin.is_staff" :value="true">
                                      <label class="form-check-label" for="adminStaff1">True</label>
                                </div>
                                <div class="form-check form-check-inline">
                                      <input class="form-check-input" type="radio" name="adminStaff" id="adminStaff2" v-model="s_admin.is_staff" :value="false">
                                      <label class="form-check-label" for="adminStaff2">False</label>
                                </div>
                             </div>
                             <div class="form-group">
                                <label>Super Admin</label>
                                <div class="form-check form-check-inline">
                                      <input class="form-check-input" type="radio" name="adminSuper" id="adminSuper1" v-model="s_admin.is_superuser" :value="true">
                                      <label class="form-check-label" for="adminStaff1">True</label>
                                </div>
                                <div class="form-check form-check-inline">
                                      <input class="form-check-input" type="radio" name="adminSuper" id="adminSuper2" v-model="s_admin.is_superuser" :value="false">
                                      <label class="form-check-label" for="adminStaff2">False</label>
                                </div>
                             </div>
                        </div>
                   </div>
               </div>
                
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click.prevent="updateAdminInfo">Save changes</button>
              </div>
            </div>
          </div>
        </div>
       
        <!-- Delete Admin Modal -->
        <div class="modal animate__animated animate__slideInDown" tabindex="-1" id="d-admin-modal" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h6 class="modal-title">You are about to delete this admin?</h6>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body py-3">
                  <div class="col-12 text-danger text-center"><h6>This can not be undone!</h6></div>
                    <div class="row justify-content-around">
                        <template v-if="!delete_in_progress">
                            <button class="btn btn-primary btn-lg" @click="delete_admin">proceed <i class="fa fa-thumbs-up"></i></button>
                            <button type="button" class="btn btn-secondary btn-lg" data-dismiss="modal">this was a mistake <i class="fa fa-ban"></i></button>
                        </template>
                        <div class="col-12 pd-2" v-else>
                            <progress-bar :curr_value="progress_value" :mount="delete_in_progress"/>
                        </div>
                        
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
            update_admin_url: "",
            delete_admin_url: "",
            loading: true,
            error: false,
            message: '',
            admins: [],
            previewImg: '',
            s_admin: {},
            new_profile_img: null,
            delete_in_progress: false,
            progress_value: 0
        }
    },
    computed: {

    },
    methods: {
        async fetchAdmins(){
            this.loading = true;
            this.error = false;
            let loader = loading('#app-view-admins');
            try{
                let response = await $.ajax({
                    url: this.api_url,
                    type: 'GET',
                    dataType: 'json',
                });
                this.admins = response.data
            }catch (e) {
                this.error = true;
                this.message = e.message
            }
            this.loading = false;
            loader.hide()
        },
        async updateAdminInfo(){
            if(!this.validateInfo())
                return
            let loader = loading('#e-admin-modal-body');
            let update_data = this.s_admin;
            let _image = {image: null};
            if(this.new_profile_img)
                _image.image = this.new_profile_img;
            try{
                let baseURL = location.href.split('/');
                // protocol, host
                baseURL = baseURL[0]+'//'+baseURL[2];
                let response = await $.ajax({
                    url: baseURL+this.update_admin_url,
                    type: 'POST',
                    dataType: 'json',
                    data: {...update_data, ..._image}
                });
                if(response.status){
                    $('#e-admin-modal').modal('hide');
                    this.fetchAdmins();
                    toastr.success("Admin Data Updated", "Success")
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
            $('#admin-image').val('');
            $('.img-block').css('background-image', `url(${this.s_admin.avatar})`)
        },
        validateInfo(){
            let status = true;
            try{
                if(!this.s_admin.name)
                    throw toastr.error("The name field should not be blank");
                if(!this.s_admin.phone)
                    throw toastr.error("Please provide a valid phone number");
                else if(!validateEmailAddress(this.s_admin.email))
                    throw toastr.error("Invalid email address")
            }catch (e) {
                status = false
            }
            return status
        },
        view_delete_modal(_admin){
            this.s_admin = _admin;
            $('#d-admin-modal').modal('show')
        },
        async delete_admin(){
            this.delete_in_progress = true;
            let del_interval = setInterval(()=>{
                if(this.progress_value < 60){
                    this.progress_value += 10;
                }else{
                    clearInterval(del_interval);
                }
            }, 1000);
            try{
                let baseURL = location.href.split('/');
                // protocol, host
                baseURL = baseURL[0]+'//'+baseURL[2];
                let response = await $.ajax({
                    url: baseURL+this.delete_admin_url,
                    type: 'POST',
                    dataType: 'json',
                    data: {id: this.s_admin.id}
                });
                if(response.status){
                    toastr.success("Admin Deleted");
                    this.fetchAdmins();
                }else
                    throw response
            }catch (e) {
                toastr.error('Unable to delete admin:', e.message)
            }finally {
                this.progress_value = 100;
                setTimeout(()=>{
                    this.delete_in_progress = false;
                    this.progress_value = 0;
                    $('#d-admin-modal').modal('hide')
                }, 2000)
            }
        },
    },
    components: {
        progressBar
    },
    created(){
        setTimeout(()=>{
            this.api_url = $('#api_fetch_admin_url').val();
            this.update_admin_url = $('#api_update_admin_url').val();
            this.delete_admin_url = $('#api_delete_admin_url').val();
            this.fetchAdmins();
            $('#d-admin-modal').modal({
                backdrop: 'static',
                show: false
            })
        }, 500)
    }
};