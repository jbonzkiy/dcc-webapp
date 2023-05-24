<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;
$route['pages/(:any)'] = 'dcc_controller/pages/pages/$1';
//$route['navbar'] = 'welcome' ;

$route['comcenter2/logout'] = 'comcenter2_controller/logout';
$route['comcenter2/login'] = 'comcenter2_controller/login';
$route['comcenter2/(:any)'] = 'comcenter2_controller/pages/$1';

$route['ers/(:any)'] = 'ers_controller/pages/$1';
// $route['ers/(:any)/(:any)'] = 'ers_controller/pages/$1/$2';

$route['vehicle/(:any)'] = 'vehicle_controller/pages/$1';

$route['weather/logout'] = 'weather_controller/logout';
$route['weather/login'] = 'weather_controller/login';

$route['ems/logout'] = 'ems_controller/logout';
$route['ems/login'] = 'ems_controller/login';
$route['ems/export'] = 'ems_controller/export2excel';
$route['ems/(:any)'] = 'ems_controller/pages/$1';
$route['ems/report/(:any)'] = 'ems_controller/pages/report/$1';

$route['logistic/logout'] = 'logistic_controller/logout';
$route['logistic/login'] = 'logistic_controller/login';
$route['logistic/(:any)'] = 'logistic_controller/pages/$1';

$route['maps/(:any)'] = 'maps_controller/pages/$1';

$route['covid/(:any)'] = 'covid_controller/pages/$1';
$route['wcms/(:any)'] = 'wcms_controller/pages/$1';
$route['covid_excel'] = 'covid_controller/GetExcelData';
$route['pages/report/(:any)'] = 'report_controller/pages/$1';
$route['weather/(:any)'] = 'weather_controller/pages/$1';
$route['portal/(:any)'] = 'portal_controller/pages/$1';

$route['report/(:any)'] = 'dcc_controller/pages/weather/$1';
$route['earthquake/(:any)'] = 'dcc_controller/pages/earthquake/$1';

$route['ajax/ems/(:any)'] = 'ems_controller/ajax/$1';
$route['ajax/comcenter2/(:any)'] = 'comcenter2_controller/ajax/$1';
$route['ajax/ers/(:any)'] = 'ers_controller/ajax/$1';
$route['ajax/vehicle/(:any)'] = 'vehicle_controller/ajax/$1';
$route['ajax/report/(:any)'] = 'report_controller/ajax/$1';
$route['ajax/covid/(:any)'] = 'covid_controller/ajax/$1';
$route['ajax/wcms/(:any)'] = 'wcms_controller/ajax/$1';
$route['ajax/weather/(:any)'] = 'weather_controller/ajax/$1';
$route['ajax/portal/(:any)'] = 'portal_controller/ajax/$1';
$route['ajax/logistic/(:any)'] = 'logistic_controller/ajax/$1';
$route['ajax/maps/(:any)'] = 'maps_controller/ajax/$1';

// $route['ajax/(:any)/(:any)'] = 'dcc_controller/ajax/$1/$2';

