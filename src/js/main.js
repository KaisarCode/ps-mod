<?
// Create submenu in modules
jQuery(document).ready(function(){
    
    jQuery('\
    #maintab-AdminParentModules .submenu,\
    #subtab-AdminParentModulesSf .submenu,\
    #collapse-43\
    ').append('\
    <li class="link-leveltwo">\
        <a class="link" href="{$mod->url_conf|escape:'htmlall':'UTF-8'}">{$mod->displayName|escape:'htmlall':'UTF-8'}</a>\
    </li>\
    ');
    
});
?>