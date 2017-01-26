<?php 


$baseUrl = @DATA_URL;
$serviceUrl = "$baseUrl/services/Camicroscope_DataLoader";

$imageUrl = "$serviceUrl/DataLoader";
$templateUrl = "$serviceUrl/AnnotationTemplate";
$markupUrl = "$baseUrl/services/Camicroscope_Annotations";


$tempMarkupUrl = "http://localhost:9099/services/TCGABRCA_Dev";

return array(
    'auth_realm' => "$baseUrl/securityTokenService",

    /*Annotations*/ //(AnnotationLoader)
    'getMultipleAnnotations' => "$markupUrl/MarkupLoader/query/getMultipleMarkups?",
    'algorithmsForImage' => "$markupUrl/MarkupsForImages/query/MarkupsAvilableForImage?",

    /* Image Metadata */ //(DataLoader)
    'getDimensions' => "$imageUrl/query/getDimensionsByIID?api_key=",
    'getFileLocation' => "$imageUrl/query/getFileLocationByIID?api_key=",
    'getMPP' => "$imageUrl/query/getMPPByIID?api_key=",
    'fastcgi_server' => "/fcgi-bin/iipsrv.fcgi",

    /* Others */
    'retrieveTemplate' => "$tempMarkupUrl/AnnotationTemplate/query/RetrieveTemplate",
    'getAllAnnotations' => "$tempMarkupUrl/Annotations/query/byUserAndImageID?iid=",
    'getAnnotationsSpatial' => "$serviceUrl/GeoJSONImageMetaData/query/getMarkups?",
    'getAnnotationSpatialFilter' => "$tempMarkupUrl/Annotations/query/allByFilter?iid=",
    'postAnnotation' => "$tempMarkupUrl/Annotations/submit/singleAnnotation",
    'retrieveAnnotation' => "$tempMarkupUrl/Annotations/query/byAnnotId?annotId=",
    'postJobParameters' => "$tempMarkupUrl/AnalysisJobs/submit/singleJob",
    'deleteAnnotation' => "$tempMarkupUrl/Annotations/delete/singleAnnotation?annotId="

);


?>
