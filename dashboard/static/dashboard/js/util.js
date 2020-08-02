const monthList = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

function loading(ref){
    /**
     * Attach loading overlay to element
     * @type {jQuery.fn.init|jQuery|HTMLElement|Object}
     */
    let element = $(ref);
    element.prepend(`
    <div id="loading">
         <span id="wheel"></span>
     </div>
    `);
    return Object.create({
        hide(){
            // call loading as a function to automatically remove overlay
            $(ref + ' '+ '#loading').fadeOut('slow').remove()
        }
    })
}

function validateImageUpload(files, valid_extensions=[]){
    let status = true;
    for(let file of files){
        let file_type = file.name.split('.').pop();
        status = status && $.inArray(file_type, valid_extensions) >= 0;
    }
    return status
}

function validateEmailAddress(email){
    return !!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}