const candidateImages = {
    name: 'ViewCandidateImages',
    delimiters: ['[[', ']]'],
    template: `
<div class="container-fluid" id="app-candidate-images">
    <div class="row">
        <template v-if="!loading && images.length > 0">
            <div class="col col-md-6 col-lg-3" v-for="(image, index) in images" :key="index">
                <div class="card">
                  <div v-if="images.length>1" class="delete-btn text-center" @click="toogle_action(index)"><i class="fa fa-trash"></i></div>
                  <div class="card-img-top" :style="{backgroundImage: 'url('+image.path+')'}">
                    <div v-if="images.length>1" :id="'action'+index" class="action-block pt-3">
                        <div class="row justify-content-around align-content-center" v-if="!delete_in_progress">
                            <a href="javascript:void(0)" class="text-success" @click="deleteImage(image.id, index)"><i class="fa fa-check-circle"></i>&nbsp;affirm</a>
                            <a href="javascript:void(0)" class="text-danger" @click="toogle_action(index,'hide')"><i class="fa fa-window-close"></i>&nbsp;never mind</a>
                        </div>
                        <div class="row justify-content-center align-content-center" v-else>
                            <div class="col-6">
                                <progress-bar :mount="delete_in_progress" :curr_value="progress_value"></progress-bar>
                            </div>
                        </div>
                    </div>
                   </div>
                  <div class="card-body">
                    <p class="card-text text-center font-weight-bold">Fauth Candidate</p>
                  </div>
                </div>
            </div>
        </template>
         <template v-else-if="error">
            <div class="col-12 text-center p-4">
                <h4>[[message]]</h4>
            </div>
        </template>
        <template v-else>
            <div class="col-12 text-center p-4">
                <h4>There are no images associated with the specified candidate</h4>
            </div>
        </template>
    </div>
    
    <!-- Imade Modal Info-->
    <div class="modal fade" id="candidateImageModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Information</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-center">
            <p>
                You are about to upload image that will be used as an extra layer 
                of <span class="text-warning">efficiency</span> when <span class="text-primary">recognizing</span> [[candidate.name]].
            </p>
            <div class="row justify-content-center align-content-center" v-if="upload_in_progress">
                <div class="col-6">
                    <progress-bar :mount="upload_in_progress" :curr_value="progress_value"></progress-bar>
                </div>
             </div>
          </div>
          <div class="modal-footer">
            <label id="upload-candidate-img-label" type="button" class="btn btn-primary" for="upload-candidate-img-btn">
                <input type="file" id="upload-candidate-img-btn" @change="uploadImage">Continue
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="add-image-btn p-3" data-toggle="modal" data-target="#candidateImageModal">
        <i class="fa fa-image"></i>&nbsp;Upload Image
    </div>
</div>
    `,
    data(){
        return {
            loading: false,
            error: false,
            delete_in_progress: false,
            upload_in_progress: false,
            progress_value: 0,
            message: '',
            fetch_images_url: '',
            delete_images_url: '',
            add_image_url: '',
            images: [],
            candidate: {},
            imageDataURIToBeUploaded: ''
        }
    },
    watch: {
        $route(to, from){
            this.fetchImages(this.$route.params.id)
        }
    },
    methods: {
        async fetchImages(candidate_id){
            this.loading = true;
            this.error = false;
            let loader = loading('#app-candidate-images');
            try{
                let response = await $.ajax({
                    url: this.fetch_images_url,
                    type: 'POST',
                    data: {id: candidate_id},
                    dataType: 'json',
                });
                this.images = response.images;
                this.candidate = response.candidate
            }catch (e) {
                this.error = true;
                this.message = e.message
            }
            this.loading = false;
            loader.hide()
        },
        toogle_action(action_index, action='show'){
            for(let i=0; i<this.images.length; i++){
                $('#action'+i).fadeOut('fast');
            }
            if(action === 'show')
                $('#action'+action_index).fadeIn('slow');
            else
                $('#action'+action_index).fadeOut('slow')
        },
        async deleteImage(image_id, action_index){
            this.delete_in_progress = true;
            let del_interval = setInterval(()=>{
                if(this.progress_value < 50){
                    this.progress_value += 10;
                }else{
                    clearInterval(del_interval)
                }
            },500);
            try{
                let response = await $.ajax({
                    url: this.delete_images_url,
                    type: 'POST',
                    data: {id: image_id},
                    dataType: 'json',
                });
                if(response.status){
                    this.images.splice(action_index, 1);
                    for(let i=0; i<this.images.length; i++){
                        $('#action'+i).fadeOut('fast');
                    }
                    toastr.success('Image Deleted')
                }
                else throw response
            }catch (e) {
                toastr.error(e.message, 'Unable to Complete Request')
            }finally {
                this.progress_value = 100;
                setTimeout(()=>{
                    this.delete_in_progress = false;
                    this.progress_value = 0;
                },1000);
            }
        },
        async uploadImage(event){
            const file = event.target.files[0];
            const fileUploadElem = $('#upload-candidate-img-btn');
            const imageModal = $('#candidateImageModal');
            if(!validateImageUpload([file], ['jpg', 'png', 'jpeg'])){
                fileUploadElem.val("");
                return toastr.warning("Please upload a valid image", 'Hey there!')
            }
            this.upload_in_progress = true;
            let upload_interval = setInterval(()=>{
                if(this.progress_value < 50){
                    this.progress_value += 10;
                }else{
                    clearInterval(upload_interval)
                }
            },500);

            let reader = new FileReader();
            reader.onload = async (e)=>{
                let imageURI = e.target.result;
                try{
                    let response = await $.ajax({
                        url: this.add_image_url,
                        type: 'POST',
                        data: {
                            id: this.$route.params.id,
                            image: imageURI
                        },
                        dataType: 'json',
                    });
                    if(response.status){
                        fileUploadElem.val('');
                        imageModal.modal('hide');
                        toastr.success('Candidate Images Updated');
                        return this.fetchImages(this.$route.params.id)
                    }
                    else throw response
                }catch (e) {
                    fileUploadElem.val('');
                    toastr.error(e.message, "Error while uploading image");
                }finally {
                    this.progress_value = 100;
                    setTimeout(()=>{
                        this.upload_in_progress = false;
                        this.progress_value = 0;
                    },1000);
                }
            };
            reader.readAsDataURL(file);
        }
    },
    components: {
        progressBar
    },
    created(){
        setTimeout(()=>{
            this.fetch_images_url = $('#api_fetch_candidate_images_url').val();
            this.delete_images_url = $('#api_delete_candidate_images_url').val();
            this.add_image_url = $('#api_add_candidate_image_url').val();
            this.fetchImages(this.$route.params.id);
        }, 500)
    },
    mounted(){
        setTimeout(()=>{
            let imageModal = $('#candidateImageModal');
            imageModal.modal({
                backdrop: 'static',
                show: false
            })
        }, 1000)
    }
};