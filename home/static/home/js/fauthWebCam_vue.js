const fauthWebCam = {
    template: `
            <div class="modal fade" id="webCamModal" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content webcam-content">
                    <div class="modal-header webcam-header">
                        <img class="fauth-logo img-fluid" src="/static/home/images/logo/fauth_logo.png" alt="fauth logo">
                        <button type="button" class="close" id="webcam-close-btn" @click.prevent="detach" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row justify-content-center">
                                <div class="col-lg-7 webcam-image-block text-left" id="webcam-camera" style="overflow: hidden;">
                                    <video id="webcam" autoplay playsinline width="350" height="200"></video>
                                    <canvas id="canvas" class="d-none"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer webcam-footer justify-content-center">
                        <button type="button" class="btn" id="webcam-button" @click.prevent="takeSnapshot">
                            <i class="fa fa-circle-notch"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    name: 'FauthWebCam',
    props: {
        show: {type: Boolean, required: true},
        imageFormat: {type: String,default: 'png'}
    },
    data(){
        return {
            webCamModal: '#webCamModal',
            Cam: null
        }
    },
    watch: {
        show(newVal){
            if(newVal){
                this.attachWebCam()
            }else{
                this.Cam.stop()
            }
        }
    },
    methods: {
        takeSnapshot(){
            let dataURI = this.Cam.snap();
            this.$emit('capture', dataURI);
            $(this.webCamModal).modal('hide');
        },
        detach(){
            $(this.webCamModal).modal('hide');
        },
        attachWebCam(){
            // TODO: validate if user enables access to camera
            this.Cam.start()
                .then(result=>{
                    console.log('FAUTH Cam Started')
                })
                .catch(error=>{
                    toastr.error("Error starting cam:", error)
                })
        }
    },
    mounted(){
        const webcamElement = document.getElementById('webcam');
        const canvasElement = document.getElementById('canvas');
        this.Cam = new Webcam(webcamElement, 'user', canvasElement);
    }
};