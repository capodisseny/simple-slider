<?php


add_action('wp_enqueue_scripts',function(){
    

     wp_enqueue_script(
         'sal-client-slider',    
        plugins_url('simple-slider.js', __FILE__) 
     );
     
      wp_enqueue_style(
         'sal-client-slider',    
        plugins_url('simple-slider.css', __FILE__) 
     );
    
    
}, 10);

