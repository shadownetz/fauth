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