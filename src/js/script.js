setTimeout(function(){
    
    jQuery(document).ready(function(){
        
        // Create submenu in modules
        jQuery('\
        #maintab-AdminParentModules .submenu,\
        #subtab-AdminParentModulesSf .submenu,\
        #collapse-43\
        ').append('\
        <li class="link-leveltwo">\
            <a class="link" href="'+PSMOD_URLC+'">'+PSMOD_DNAM+'</a>\
        </li>\
        ');
        
    });
    
},0);
