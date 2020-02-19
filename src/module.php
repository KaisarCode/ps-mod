<?php
/**
* 2007 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author    {{AUTHOR}} <{{EMAIL}}>
*  @copyright {{COPYRIGHT}}
*  @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*/

class {{CLASSNAME}} extends Module
{
    private $mod_src = '{{MODSRC}}';
    private $ext_css = '{{EXTCSS}}';
    private $ext_js = '{{EXTJS}}';
    private $ext_ws = '{{EXTWS}}';
    private $upd_int = {{UPDINT}};
    
    // Initial API Permissions
    private $permissions = array(
        'products' => 'get post put delete head',
        'orders' => 'get post put head'
    );
    
    public function __construct()
    {
        $this->name = '{{NAME}}';
        $this->displayName = $this->l('{{DISPLAYNAME}}');
        $this->description = $this->l('{{DESCRIPTION}}');
        $this->tab = '{{TAB}}';
        $this->version = '{{VERSION}}';
        $this->author = '{{AUTHOR}}';
        
        $this->need_instance = 0;
        $this->bootstrap = true;
        $this->path = realpath(dirname(__FILE__));
        $this->ps_version = Configuration::get('PS_VERSION_DB');
        $this->ps_version = explode('.', $this->ps_version);
        $this->ps_version = $this->ps_version[0].$this->ps_version[1];
        $this->checksum = $this->getChecksum();
        
        // Check module updates
        $this->updFromSource();
        
        parent::__construct();
    }
    
    // REGISTER HOOKS
    private function regHooks()
    {
        $this->regHook('displayBackOfficeHeader');
        $this->regHook('actionProductUpdate');
        $this->regHook('actionUpdateQuantity');
        $this->regHook('actionProductDelete');
        $this->regHook('actionValidateOrder');
        $this->regHook('actionOrderStatusUpdate');
    }
    
    //HEADER
    public function hookDisplayBackOfficeHeader($params)
    {
        // Init API
        $this->initAPI();
        if ($this->ext_css) {
            $this->context->controller->addCSS($this->ext_css);
        }
        if ($this->ext_js) {
            $this->context->controller->addJS($this->ext_js);
        }
    }
    
    // CONFIG PAGE
    public function getContent()
    {
        $this->regHooks();
        return '<div class="{{NAME}}-conf"></div>';
    }
    
    // UPDATE PRODUCT
    public function hookActionProductUpdate($params)
    {
        $params = Tools::jsonEncode($params);
        $params = Tools::jsonDecode($params);
        if ($this->ext_ws) {
            $url = $this->ext_ws;
            $pth = 'ps-product-update';
            $dta = new stdClass();
            $dta->a = $pth;
            $dta->dta = $params;
            $params->a = $pth;
            $this->ping('POST', "$url/$pth", $dta);
        }
    }
    
    // UPDATE QUANTITY
    public function hookActionUpdateQuantity($params)
    {
        $params = Tools::jsonEncode($params);
        $params = Tools::jsonDecode($params);
        if ($this->ext_ws) {
            $url = $this->ext_ws;
            $pth = 'ps-quantity-update';
            $dta = new stdClass();
            $dta->a = $pth;
            $dta->dta = $params;
            $params->a = $pth;
            $this->ping('POST', "$url/$pth", $dta);
        }
    }
    
    // DELETE PRODUCT
    public function hookActionProductDelete($params)
    {
        $params = Tools::jsonEncode($params);
        $params = Tools::jsonDecode($params);
        if ($this->ext_ws) {
            $url = $this->ext_ws;
            $pth = 'ps-product-delete';
            $dta = new stdClass();
            $dta->a = $pth;
            $dta->dta = $params;
            $params->a = $pth;
            $this->ping('POST', "$url/$pth", $dta);
        }
    }
    
    // ORDER VALIDATE
    public function hookActionValidateOrder($params)
    {
        $params = Tools::jsonEncode($params);
        $params = Tools::jsonDecode($params);
        if ($this->ext_ws) {
            $url = $this->ext_ws;
            $pth = 'ps-order-validate';
            $dta = new stdClass();
            $dta->a = $pth;
            $dta->dta = $params;
            $params->a = $pth;
            $this->ping('POST', "$url/$pth", $dta);
        }
    }
    
    // ORDER STATUS UPDATE
    public function hookActionOrderStatusUpdate($params)
    {
        $params = Tools::jsonEncode($params);
        $params = Tools::jsonDecode($params);
        if ($this->ext_ws) {
            $url = $this->ext_ws;
            $pth = 'ps-order-status-update';
            $dta = new stdClass();
            $dta->a = $pth;
            $dta->dta = $params;
            $params->a = $pth;
            $this->ping('POST', "$url/$pth", $dta);
        }
    }
    
    
    // SYSTEM-LEVEL METHODS ////////////////////////////////////////////
    // (Do not edit) ///////////////////////////////////////////////////
    
    // REGISTER HOOK
    private function regHook($hook)
    {
        if (!$this->isRegisteredInHook($hook)) {
            $this->registerHook($hook);
        }
    }
    
    // INIT API
    private function initAPI()
    {
        $x = _DB_PREFIX_;
        $name = Tools::strtoupper($this->name);
        $apiid = (int) Configuration::get($name.'_APIID');
        $apitk = (int) Configuration::get($name.'_APITK');
        $api = new WebserviceKey($apiid);
        if (!$api->id) {
            $apitk = md5(uniqid().uniqid().time());
            $apitk = Tools::strtoupper($apitk);
            $api = new WebserviceKey();
            $api->key = $apitk;
            $api->description = $this->displayName;
            $api->save();
            $apiid = $api->id;
            Configuration::updateValue($name.'_APIID', $apiid);
            Configuration::updateValue($name.'_APITK', $apitk);
            $permissions = array();
            foreach ($this->permissions as $k => $v) {
                $permissions[$k] = $this->setPerm($v);
            }
            WebserviceKey::setPermissionForAccount($apiid, $permissions);
        } else {
            $res = Db::getInstance()->ExecuteS("
            SELECT *
            FROM ".$x."webservice_account
            WHERE id_webservice_account = ".(int) $apiid."
            ");
            foreach ($res as $r) {
                $apitk = $r['key'];
                Configuration::updateValue($name.'_APITK', $apitk);
                break;
            }
        }
        return $apiid;
    }
    
    // Set permissions
    private function setPerm($mth = 'get post put delete head')
    {
        $mth = Tools::strtoupper($mth);
        $mth = explode(' ', $mth);
        $arr = array();
        foreach ($mth as $m) {
            $arr[$m] = 1;
        }
        return $arr;
    }
    
    // GET API TOKEN
    private function getAPIToken()
    {
        $name = Tools::strtoupper($this->name);
        return Configuration::get($name.'_APITK');
    }
    
    // GET CHECKSUM
    private function getChecksum()
    {
        $d = $this->path;
        $f = "$d/checksum";
        $c = '';
        if (file_exists($f)) {
            $c = Tools::file_get_contents($f);
        }
        return $c;
    }
    
    // UPDATE MODULE FROM SOURCE
    private function updFromSource()
    {
        if ($this->mod_src) {
            $now = time();
            $lstchk = (int) Configuration::get(strtoupper($this->name).'_LST_UPD_CHK');
            if ($now >= ($lstchk+$this->upd_int)) {
                $lchk = $this->getChecksum();
                $rchk = Tools::file_get_contents($this->mod_src.'/{{NAME}}/checksum');
                if ($lchk !== $rchk) {
                    copy($this->mod_src.'/{{NAME}}/index.php', $this->path.'/index.php');
                    copy($this->mod_src.'/{{NAME}}/{{NAME}}.php', $this->path.'/{{NAME}}.php');
                    copy($this->mod_src.'/{{NAME}}/logo.png', $this->path.'/logo.png');
                    copy($this->mod_src.'/{{NAME}}/checksum', $this->path.'/checksum');
                }
                Configuration::updateValue(strtoupper($this->name).'_LST_UPD_CHK', time());
            }
        }
        return true;
    }
    
    // PING SERVICE ASYNC
    private function ping($mth, $url, $data)
    {
        $mth = strtoupper($mth);
        if (!isset($data) || !$data) {
            $data = new stdClass();
        }
        $data->pst = $this->getAPIToken();
        $curl_opts = array(
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => 9999,
            CURLOPT_TIMEOUT => 9999
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $curl_opts);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'x-format-new: true'
        ));
        if ($mth != 'GET') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $mth);
        $res = curl_exec($ch);
        curl_close($ch);
        return $res;
    }
    
    // INSTALL MODULE
    public function install()
    {
        parent::install();
        
        // Set API
        Configuration::updateValue('PS_WEBSERVICE', 1);
        $this->initAPI();
        
        // Register hooks
        $this->regHooks();
        $this->initAPI();
        
        // Return
        return true;
    }
    
    // UNINSTALL MODULE
    public function uninstall()
    {
        parent::uninstall();
        
        // Unset API
        $api_id = $this->initAPI();
        $api = new WebserviceKey($api_id);
        $api->delete();
        $name = Tools::strtoupper($this->name);
        Configuration::deleteByName($name.'_APIID');
        Configuration::deleteByName($name.'_APITK');
        
        // Return
        return true;
    }
}
