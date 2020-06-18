class FauthWebCam {
    constructor(
        {
            launchBTN,
            bodyID,
            outputID
        },
        format='png'
    ){
        this.image_format = format;
        this.outputElement = $(outputID);
        this.bodyID = $(bodyID);
        this.launchBTN = launchBTN
    }
    initialize(){
        this.bodyID.append(`
        <div class="modal fade" id="webCamModal" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content webcam-content">
                    <div class="modal-header webcam-header">
                        <img class="fauth-logo img-fluid" src="/static/home/images/logo/fauth_logo.png" alt="fauth logo">
                        <button type="button" class="close" id="webcam-close-btn" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row justify-content-center">
                                <div class="col-lg-7 webcam-image-block text-left" id="webcam-camera">
                                    <img class="webcam-preview" src="" alt="image preview">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer webcam-footer justify-content-center">
                        <button type="button" class="btn" id="webcam-button">
                            <i class="fa fa-circle-notch"></i>
                        </button>
                        <button id="webcam-button-next" type="button" class="btn" data-toggle="tooltip" data-placement="left" title="continue">
                            <i class="fa fa-forward"></i>
                        </button>
                        <button id="webcam-button-retake" type="button" class="btn" data-toggle="tooltip" data-placement="right" title="retake">
                            <i class="fa fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `);
        this.webCamModal = $('#webCamModal');
        this.webCamFrame = '#webcam-camera';
        this.webCamSnap = $('#webcam-button');
        this.webCamNext = $('#webcam-button-next');
        this.webCamRetake = $('#webcam-button-retake');
        this.webCamCloseBtn = $('#webcam-close-btn');
        this.webCamLaunchBtn = $(this.launchBTN);
        this.webCamPreview = $('<img />', {
            alt: 'image preview',
            class: 'img-fluid webcam-preview'
        });
        Webcam.set({
            width: 350,
            height: 200,
            image_format: this.image_format,
            jpeg_quality: 100,
            flip_horiz: true,
            fps: 60
        });
        // FIXME: validate if user enables access to camera
        /* Load FauthWebCam Modal */
        this.webCamSnap.click(event => this.takeSnapshot(event));
        /* Retake Snapshot */
        this.webCamRetake.click(event => this.retakeSnapshot(event));
        /* Remove FauthWebCam */
        this.webCamNext.click(event => this.destroyWebCam(event));
        /* Close button */
        this.webCamCloseBtn.click(event => this.destroyWebCam(event));
        // launch btn
        this.webCamLaunchBtn.click(event => {
            this.webCamModal.modal({
                backdrop: 'static',
                show: true
            });
            this.attachWebCam()
        })
    }
    attachWebCam(){
        Webcam.attach(this.webCamFrame);
    }
    // FauthWebCam Button Click
    takeSnapshot(event){
        event.stopPropagation();
        Webcam.snap( (dataURI) => {
            // load image data URI
            this.webCamPreview.attr('src', dataURI);
            // attach value to specified element identifier
            this.outputElement.val(dataURI)
        });
        Webcam.reset();
        $(this.webCamFrame).append(this.webCamPreview);
        this.webCamSnap.fadeOut();
        this.addExtraWebCamButtons();
    }
    retakeSnapshot(event){
        event.stopPropagation();
        this.webCamSnap.fadeIn('slow');
        this.attachWebCam();
        this.removeExtraWebCamButtons();
    }
    destroyWebCam(event){
        if(event){event.stopPropagation()}
        try{Webcam.reset()}catch (e) {}
        this.webCamModal.modal('hide');
        this.webCamSnap.fadeIn();
        this.removeExtraWebCamButtons();
    }
    removeExtraWebCamButtons(){
        this.webCamNext.fadeOut();
        this.webCamRetake.fadeOut();
    }
    addExtraWebCamButtons(){
        this.webCamNext.fadeIn("slow");
        this.webCamRetake.fadeIn("slow");
    }
}