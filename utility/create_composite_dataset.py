from pymongo import MongoClient
from shapely.geometry import LineString
from shapely.geometry.polygon import LinearRing
from shapely.geometry import Polygon
from bson import json_util 
import numpy as np
import time
import pprint
import json 
import csv
import sys
import os
import shutil
import subprocess
import pipes
import shlex
    
    
if __name__ == '__main__':
  if len(sys.argv)<1:
    print "usage:python create_composite_dataset.py config.json";
    exit();  
  
  start_time = time.time(); 
  csv.field_size_limit(sys.maxsize); 
  
  #read config.json file
  config_json_file = sys.argv[-1];
  #print config_json_file;
  with open(config_json_file) as json_data:
    d = json.load(json_data)
    #print(d);
    segment_results_folder = d['segment_results_folder'];
    if not os.path.exists(segment_results_folder):
      print "segment results folder is not available."
      exit();
       
    quip_application_folder = d['quip_application_folder'];
    if not os.path.exists(quip_application_folder):
      print "quip application folder is not available."
      exit(); 
       
    image_user_list_file = d['image_user_list'];      
    if not os.path.isfile(image_user_list_file):
      print "image user list_file is not available."
      exit();     
      
    composite_results_folder = os.path.join(quip_application_folder, "img/composite_results");
    if not os.path.exists(composite_results_folder):
      print "img/composite_results folder is NOT available, then create it."
      os.makedirs(composite_results_folder);   
       
    composite_results_zip_folder = os.path.join(quip_application_folder, "composite_results");            
    if not os.path.exists(composite_results_zip_folder):
      print "composite_results folder is NOT available, then create it."
      os.makedirs(composite_results_zip_folder);     
    
    db_host = d['db_host'];
    db_port = d['db_port'];
    db1_name = d['db1_name'];
    db2_name = d['db2_name'];  
    #print segment_results_folder,image_prefix_algorithm_file;
  #exit();
  
  print '--- read image_user_list file ---- ';  
  index=0;
  image_user_list=[];  
  with open(image_user_list_file, 'r') as my_file:
    reader = csv.reader(my_file, delimiter=',')
    my_list = list(reader);
    for each_row in my_list:      
      tmp_image_user_list=[[],[]]; 
      tmp_image_user_list[0]= each_row[0];#image case_id
      tmp_image_user_list[1]= each_row[1];#user       
      image_user_list.append(tmp_image_user_list);                
  print "total rows from image_user_list file is %d " % len(image_user_list) ; 
  print image_user_list;
  #exit();
  
  print '--- build image_prefix_algorithm lookup table ---- ';
  analysis_list=[]; 
  for item in image_user_list: 
    case_id=item[0];
    user=item[1];
    case_id_folder = os.path.join(segment_results_folder,case_id);
    prefix_list=os.listdir(case_id_folder);  # list of subdirectories and files
    #print  prefix_list; 
    for prefix in prefix_list: #-algmeta.json
      prefix_folder = os.path.join(case_id_folder,prefix);
      if os.path.isdir(prefix_folder) and len(os.listdir(prefix_folder)) > 0:                            
        json_filename_list = [f for f in os.listdir(prefix_folder) if f.endswith('.json')] ;
        #print 'there are %d json files in this folder.' % len(json_filename_list);
        first_json_filename = json_filename_list[0];             
        with open(os.path.join(prefix_folder, first_json_filename)) as f:
          data = json.load(f);
          analysis_id=data["analysis_id"];
          #print case_id,prefix_folder,analysis_id;
          tmp_analysis_list=[[],[],[]]; 
          tmp_analysis_list[0]= case_id;#image case_id
          tmp_analysis_list[1]= prefix;#prefix
          tmp_analysis_list[2]= analysis_id;#algorithm   
          analysis_list.append(tmp_analysis_list);  
  print analysis_list;
  #exit();  
   
  client = MongoClient('mongodb://'+db_host+':'+db_port+'/');    
  #db = client.quip;  
  #db2 = client.quip_comp;  
  db = client[db1_name];  
  db2 = client[db2_name];
  images =db.images; 
  metadata=db.metadata;
  objects = db.objects;  
  images2 =db2.images; 
  metadata2=db2.metadata;
  objects2 = db2.objects;  
    
  def getPrefix(case_id,algorithm):
    prefix="";    
    for tmp in analysis_list:
      case_id_row=tmp[0];
      prefix_row=tmp[1];
      algorithm_row=tmp[2];
      if (case_id_row == case_id and algorithm_row == algorithm):
          prefix =prefix_row;     
          break
    return  prefix; 
    
  process_list =[];    
  for item in image_user_list:  
    case_id=item[0];
    user=item[1];
    subject_id=case_id;  
    #user_list =[];
    tmp_process_list_item=[[],[],[],[],[]];    
    prefixs_algorithm=[];
    polygon_algorithm=[[0 for y in xrange(2)] for x in xrange(1000)]; 
    #polygon_algorithm=[[0 for y in xrange(2)] for x in xrange(1000)]; 
    tmp_process_list_item[0]=case_id;
    tmp_process_list_item[1]=user;
    
    execution_id=user +"_composite_input";                                         
    tmp_algorithm_list=[];
    annotation_count=0; 
    print '----- get human markups for this image and this user -----';   
    print case_id, execution_id;                                     
    for annotation in objects.find({"provenance.image.case_id":case_id,                                    
                                    "provenance.analysis.execution_id": execution_id},{"_id":0,"geometry.coordinates":1,"algorithm":1}):
      polygon=annotation["geometry"]["coordinates"][0]; 
      algorithm=annotation["algorithm"];  
      tmp_algorithm_list.append(algorithm);                                         
      x=polygon[0][0];
      y=polygon[0][1];
      if(x<0.0 or x>1.0):
        continue;
      if(y<0.0 or y>1.0):
        continue;  
      polygon_algorithm[annotation_count][0]=algorithm;
      polygon_algorithm[annotation_count][1]=polygon;       
      annotation_count+=1;      
    print 'total annotation number is %d' % annotation_count; 
    total_annotation_count = annotation_count;      
    algorithm_list = sorted(set(tmp_algorithm_list)); 
    for algorithm in algorithm_list:
      prefix=getPrefix(case_id,algorithm);
      tmp_prefixs_algorithm =[[],[]];      
      tmp_prefixs_algorithm[0]=prefix;
      tmp_prefixs_algorithm[1]=algorithm;        
      prefixs_algorithm.append(tmp_prefixs_algorithm);                                                
    tmp_process_list_item[2]=prefixs_algorithm;  
    tmp_process_list_item[3]=total_annotation_count;  
    tmp_process_list_item[4]=polygon_algorithm;                                                  
    process_list.append(tmp_process_list_item);               
  print "final user and case_id combination is  %d " % len(process_list) ; 
  print "-----------------------------------------";
  #print process_list;
  #exit();   
              
  print " --- ----  start the loop of  case_id  and user combination ----";  
  for user_case_id in  process_list:
    loop_index=process_list.index(user_case_id);
    case_id=user_case_id[0];
    subject_id=case_id;
    user=user_case_id[1];    
    prefixs_algorithm=user_case_id[2];    
    total_annotation_count=user_case_id[3];  
    polygon_algorithm=user_case_id[4]; 
    new_execution_id=user +"_composite_dataset";      
    
    print '-- find all annotations NOT within another annotation  -- ';
    polygon_algorithm_final=[[0 for y in xrange(5)] for x in xrange(1000)]; 
    index3=0
    for index1 in range(0, total_annotation_count):
      algorithm = polygon_algorithm[index1][0]; 
      annotation = polygon_algorithm[index1][1]; 
      tmp_poly=[tuple(i) for i in annotation];
      annotation_polygon1 = Polygon(tmp_poly);
      annotation_polygon_1 = annotation_polygon1.buffer(0);
      polygonBound= annotation_polygon_1.bounds;
      array_size=len(annotation);
      print '-----------------------------------------------------------------';
      print "annotation index %d and annotation point size %d" % (index1, array_size) ;
      is_within=False;
      is_same_algorithm=False;
      match_index='';
      for index2 in range(0, total_annotation_count):
        algorithm2 = polygon_algorithm[index2][0];
        annotation2 = polygon_algorithm[index2][1]; 
        tmp_poly2=[tuple(j) for j in annotation2];
        annotation_polygon2 = Polygon(tmp_poly2);
        annotation_polygon_2 = annotation_polygon2.buffer(0);       
        if index1 <> index2 and not annotation_polygon_1.equals(annotation_polygon_2):  
          if (annotation_polygon_1.within(annotation_polygon_2)):    
            is_within=True;
            polygonBound2= annotation_polygon_2.bounds;
            array_size2=len(annotation2); 
            if(algorithm == algorithm2):  
              is_same_algorithm=True;  
            match_index = index2;       
            break              
      if not is_within:
        print 'add annotation of index %d' % index1;
        polygon_algorithm_final[index3][0]=algorithm; 
        polygon_algorithm_final[index3][1]=annotation;
        polygon_algorithm_final[index3][2]=index1;
        polygon_algorithm_final[index3][3]=0; #means that  this polygon is not within any polygon
        polygon_algorithm_final[index3][4]='';
        index3+=1; 
      if is_within and not is_same_algorithm :
        print 'add annotation of index %d' % index1;
        polygon_algorithm_final[index3][0]=algorithm; 
        polygon_algorithm_final[index3][1]=annotation;
        polygon_algorithm_final[index3][2]=index1;
        polygon_algorithm_final[index3][3]=1; #means that  this polygon is within aother polygon with different algorithm
        polygon_algorithm_final[index3][4]=match_index;
        index3+=1;         
    print 'final annotation number is %d' % index3;      
    final_total_annotation_count=index3; 
    #print polygon_algorithm_final; 
    for item in polygon_algorithm_final[:final_total_annotation_count]:
      print item[2],item[3],item[0],item[4];
    composite_polygon_list=[];
    print '===========================';
    for item in polygon_algorithm_final[:final_total_annotation_count]:
      if (item[4] !=''):
        print item[2],item[3],item[0],item[4]; 
        composite_polygon_list.append(item[4]); 
    composite_polygon_list = sorted(set(composite_polygon_list));     
    print composite_polygon_list;    
    
    ########        
    def find_included_polygons(local_dex): 
      within_polygon_list=[];
      for item in polygon_algorithm_final[:final_total_annotation_count]:
        if (item[4] == local_dex): 
          within_polygon_list.append(item[2]) ;
      return within_polygon_list;
    #######
    
    ########        
    def find_polygon(local_dex):      
      for item in polygon_algorithm_final[:final_total_annotation_count]:
        if (item[2] == local_dex): 
          return item;
    #######
    
    for  composite_index in  composite_polygon_list:
      for idex, item in enumerate(polygon_algorithm_final[:final_total_annotation_count]): 
        if (item[2] == composite_index):
          polygon_algorithm_final[idex][4]=find_included_polygons(composite_index);
    
    print '===========================';
    for item in polygon_algorithm_final[:final_total_annotation_count]:
      print item[2],item[3],item[0],item[4];
                           
    #exit();         
  
    print '------ get all tiles as polygon ------ ';
    title_polygon_algorithm_final=[[0 for y in xrange(3)] for x in xrange(10000)];
    print 'total_algorithms is %s' % len(prefixs_algorithm);  
    for index1 in range (0,len(prefixs_algorithm)):
      prefix = prefixs_algorithm[index1][0];  
      algorithm = prefixs_algorithm[index1][1];
      img_folder = os.path.join(segment_results_folder, case_id);    
      algorithm_folder = os.path.join(img_folder, prefix);  
      #print '----------------------------------------------------';   
      print 'algorithm data files location %s' % algorithm_folder;    
      if os.path.isdir(algorithm_folder) and len(os.listdir(algorithm_folder)) > 0:                            
        json_filename_list = [f for f in os.listdir(algorithm_folder) if f.endswith('.json')] ;
        print 'there are %d json files in this folder.' % len(json_filename_list);
        tmp_title_polygon=[];      
        for json_filename in json_filename_list:             
          with open(os.path.join(algorithm_folder, json_filename)) as f:
            data = json.load(f);
            analysis_id=data["analysis_id"];
            image_width=data["image_width"];
            image_height=data["image_height"];
            tile_minx=data["tile_minx"];
            tile_miny=data["tile_miny"];
            tile_width=data["tile_width"];
            tile_height=data["tile_height"];
            title_polygon=[[float(tile_minx)/float(image_width),float(tile_miny)/float(image_height)],[float(tile_minx+tile_width)/float(image_width),float(tile_miny)/float(image_height)],[float(tile_minx+tile_width)/float(image_width),float(tile_miny+tile_height)/float(image_height)],[float(tile_minx)/float(image_width),float(tile_miny+tile_height)/float(image_height)],[float(tile_minx)/float(image_width),float(tile_miny)/float(image_height)]];
            tmp_list=[[],[]];
            tmp_list[0]=json_filename;
            tmp_list[1]=title_polygon;
            tmp_title_polygon.append(tmp_list);
        print 'tmp title polygon length %d' % len(tmp_title_polygon);        
      title_polygon_algorithm_final[index1][0]=prefix;
      title_polygon_algorithm_final[index1][1]=algorithm;
      title_polygon_algorithm_final[index1][2]=tmp_title_polygon ;    
      print 'index1 is %d '% index1;     
      print  'there are %d titles in folder %s .' % (len(title_polygon_algorithm_final[index1][2]) ,algorithm_folder);         
      
      
    # ---- process_one_tile function  ---    
    def process_one_tile(title_index,algorithm,title_array,algorithm_folder_in,algorithm_folder_out):
      is_intersects=False;
      is_within=False; 
      is_exclued=False; 
      json_filename=title_array[0];
      csv_filename=json_filename.replace('algmeta.json','features.csv');
      tmp_polygon=title_array[1];	
      print  '--- current title_index is %d' % title_index; 
      annotation_title_intersect_list =[];
      exclude_annotation_intersect_list =[];	
      for index2 in range (0,final_total_annotation_count):
        algorithm2=polygon_algorithm_final[index2][0];         
        local_index= polygon_algorithm_final[index2][2]; 
        polygon_type= polygon_algorithm_final[index2][3];  
        included_polygon_list= polygon_algorithm_final[index2][4];   
                 
        if (algorithm == algorithm2):                
          tmp_poly=[tuple(i) for i in tmp_polygon];
          title_polygon = Polygon(tmp_poly);
          title_polygon = title_polygon.buffer(0);
          annotation=polygon_algorithm_final[index2][1];        
          tmp_poly2=[tuple(j) for j in annotation];
          annotation_polygon = Polygon(tmp_poly2);
          annotation_polygon = annotation_polygon.buffer(0);  
                               
          
          if (polygon_type==0 and len(included_polygon_list)>0):#this annotation include others annotations with different algorithm
            for exluded_polygon_index in included_polygon_list: 
              item=find_polygon(exluded_polygon_index);
              excluded_annotation=item[1];
              excl_poly=[tuple(j) for j in excluded_annotation];
              excl_polygon = Polygon(excl_poly);
              excl_polygon = excl_polygon.buffer(0);            
              if (title_polygon.within(excl_polygon)): 
                is_intersects=False;
                is_within=False;
                is_exclued=True;
                break;
              elif (title_polygon.intersects(excl_polygon)): 
                exclude_annotation_intersect_list.append(item);               
                               
          if is_exclued:
            break;
          if (title_polygon.within(annotation_polygon)): 
              is_within=True;
              break;
          elif (title_polygon.intersects(annotation_polygon)): 
              is_intersects=True;
              annotation_title_intersect_list.append(annotation);
                            
      if(is_within or is_intersects):      
        if is_intersects: 
          print '       title %d intersects with human markup %d' % (title_index,index2);
        if is_within:  
          print '       title %d is within with human markup %d' % (title_index,index2);        
        print '       json_filename is %s' % json_filename; 
        print '       csv_filename is %s' % csv_filename;        
        json_source_file = os.path.join(algorithm_folder_in, json_filename);
        csv_source_file = os.path.join(algorithm_folder_in, csv_filename);
        json_dest_file = os.path.join(algorithm_folder_out, json_filename);
        csv_dest_file = os.path.join(algorithm_folder_out, csv_filename);         
        if not os.path.isfile(json_dest_file):
          shutil.copy2(json_source_file,json_dest_file) ;         
        if not os.path.isfile(csv_dest_file):  
          shutil.copy2(csv_source_file,csv_dest_file) ;       
        #update analysis_id info in json file    
        with open(json_dest_file, 'r') as f:
         json_data = json.load(f)
         analysis_id = json_data['analysis_id'];
         image_width=json_data["image_width"];
         image_height=json_data["image_height"];
         json_data['analysis_id'] = new_execution_id;
         json_data['analysis_desc'] = analysis_id;
        with open(json_dest_file, 'w') as f2:
          f2.write(json.dumps(json_data));        
          
      if (is_intersects and len(exclude_annotation_intersect_list)==0):    
        #print 'intersect annotation number is %d.' % len(annotation_title_intersect_list);                    
        json_dest_file = os.path.join(algorithm_folder_out, json_filename);
        csv_dest_file = os.path.join(algorithm_folder_out, csv_filename);
        my_tem_file ='tmp_file_'+ str(title_index)+'.csv';      
        tmp_file = os.path.join(algorithm_folder_out, my_tem_file);
        with open(csv_dest_file, 'rb') as csv_read, open(tmp_file, 'wb') as csv_write:
          reader = csv.reader(csv_read);
          headers = reader.next();          
          #write header to tmp file
          csv_writer = csv.writer(csv_write);
          csv_writer.writerow(headers);                      
          polygon_index= headers.index('Polygon');         
          for row in reader:            
            current_polygon=row[polygon_index] ;        
            new_polygon=[];            
            tmp_str=str(current_polygon);            
            tmp_str=tmp_str.replace('[','');
            tmp_str=tmp_str.replace(']','');
            split_str=tmp_str.split(':');
            for i in range(0, len(split_str)-1, 2):
              point=[float(split_str[i])/float(image_width),float(split_str[i+1])/float(image_height)];
              new_polygon.append(point);              
            tmp_poly=[tuple(i) for i in new_polygon];
            computer_polygon = Polygon(tmp_poly);
            computer_polygon = computer_polygon.buffer(0);
            has_intersects=False;
            for annotation in annotation_title_intersect_list:
              tmp_poly2=[tuple(j) for j in annotation];
              annotation_polygon = Polygon(tmp_poly2);
              annotation_polygon = annotation_polygon.buffer(0);
              if (computer_polygon.intersects(annotation_polygon)): 
                has_intersects=True;
                break;
            #write each row to the tmp csv file
            if has_intersects:  
              csv_writer.writerow(row) ;                           
        shutil.move(tmp_file,csv_dest_file); 
        print 'change tem file of %s  to file %s' % (tmp_file,csv_dest_file);   
      
      if ((is_within or is_intersects) and len(exclude_annotation_intersect_list)>0): 
        print " -- len(exclude_annotation_intersect_list) is %d" % len(exclude_annotation_intersect_list);   
        json_dest_file = os.path.join(algorithm_folder_out, json_filename);
        csv_dest_file = os.path.join(algorithm_folder_out, csv_filename);
        my_tem_file ='tmp_file_'+ str(title_index)+'.csv';      
        tmp_file = os.path.join(algorithm_folder_out, my_tem_file);
        with open(csv_dest_file, 'rb') as csv_read, open(tmp_file, 'wb') as csv_write:
          reader = csv.reader(csv_read);
          headers = reader.next();          
          #write header to tmp file
          csv_writer = csv.writer(csv_write);
          csv_writer.writerow(headers);                      
          polygon_index= headers.index('Polygon');         
          for row in reader:            
            current_polygon=row[polygon_index] ;        
            new_polygon=[];            
            tmp_str=str(current_polygon);            
            tmp_str=tmp_str.replace('[','');
            tmp_str=tmp_str.replace(']','');
            split_str=tmp_str.split(':');
            for i in range(0, len(split_str)-1, 2):
              point=[float(split_str[i])/float(image_width),float(split_str[i+1])/float(image_height)];
              new_polygon.append(point);              
            tmp_poly=[tuple(i) for i in new_polygon];
            computer_polygon = Polygon(tmp_poly);
            computer_polygon = computer_polygon.buffer(0);
            has_intersects=False;
            for annotation in annotation_title_intersect_list:
              tmp_poly2=[tuple(j) for j in annotation];
              annotation_polygon = Polygon(tmp_poly2);
              annotation_polygon = annotation_polygon.buffer(0);
              if (computer_polygon.intersects(annotation_polygon)): 
                has_intersects=True;
                break;                
            has_intersects_excluded=False;
            for annotation_excluded in exclude_annotation_intersect_list:
              excluded_annotation=annotation_excluded[1];
              #print "--- excluded_annotation is ---";
              #print excluded_annotation;
              tmp_poly3=[tuple(j) for j in excluded_annotation];
              annotation_excluded_poly = Polygon(tmp_poly3);
              annotation_excluded_poly = annotation_excluded_poly.buffer(0);
              if (computer_polygon.intersects(annotation_excluded_poly)): 
                has_intersects_excluded=True;
                #print "has_intersects_excluded is true.";
                break;
            #write each row to the tmp csv file
            if ( has_intersects and not has_intersects_excluded):  
              csv_writer.writerow(row) ;                           
        shutil.move(tmp_file,csv_dest_file); 
        print 'change tem file of %s  to file %s' % (tmp_file,csv_dest_file);  
              
    # ---- end of process_one_tile function  ---
    
    #exit();    
    print" ---- find all title intersect with human markups ---- ";       
    start_time2 = time.time();  
    for index1 in range (0,len(prefixs_algorithm)):
      prefix=title_polygon_algorithm_final[index1][0];
      algorithm=title_polygon_algorithm_final[index1][1];
      tmp_title_polygon_list=title_polygon_algorithm_final[index1][2];
      img_folder = os.path.join(segment_results_folder, case_id);
      algorithm_folder = os.path.join(img_folder, prefix);
      out_folder = os.path.join(composite_results_folder, case_id);
      out_algorithm_folder = os.path.join(out_folder, prefix);
      if not os.path.exists(out_algorithm_folder):
        os.makedirs(out_algorithm_folder);    
      print " --------- deal with algorithm %s -------------- " % algorithm; 
      title_index=0;    
      #--- apply multiple process method ---  
      #with concurrent.futures.ProcessPoolExecutor(max_workers=max_workers) as executor:
      for tmp_title_polygon in tmp_title_polygon_list:
        process_one_tile(title_index,algorithm,tmp_title_polygon,algorithm_folder,out_algorithm_folder);        
        title_index+=1;         
  #end of  process_list 
  print " --- ----  End of loop for case_id and user combination ----"; 
  
  
  print '--- zip composite_results and move to another folder ---- '; 
  for item in image_user_list:  
    case_id=item[0];
    composite_results_case_id_folder = os.path.join(composite_results_folder, case_id);   
    zip_file_path = os.path.join(composite_results_zip_folder, case_id); 
    shutil.make_archive(zip_file_path, 'zip', composite_results_case_id_folder);
  print 'end of  zip composite_results data --- '; 
  #exit();
  
  print ' -- syn quip and quip_comp database ---- ';
  for item in image_user_list:  
    case_id=item[0];
    #subject_id =case_id; 
    user=item[1]; 
    execution_id=user +"_composite_input";
    execution_id2=user +"_composite_dataset";
    
    print "--------syn  images collection ----"  
    dest_images_count= images2.find({"case_id":case_id}).count();
    if (dest_images_count ==0):
      for image_record in images.find({"case_id":case_id},{"_id":0}):
        images2.insert_one(image_record);
      print str(case_id)+ "has been added now.";
    else:
      print str(case_id) +" is Not empty in db quip_comp images collection";    
    
    print "---- syn  metadata collection ----"        
    dest_metadata_count= metadata2.find({"image.case_id":case_id}).count();
    if (dest_metadata_count ==0):
      for metadata_record in metadata.find({"image.case_id":case_id,"provenance.analysis_execution_id":execution_id},{"_id":0}):           
        metadata2.insert_one(metadata_record);    
      print str(case_id)+ " has been added now for execution_id.";
    else:
      print str(case_id) +" is Not empty in  db quip_comp metadata collection";    
    
    print "--- syn human markup annotations ----- "  
    print "remove composite input"
    objects2.remove({"provenance.image.case_id":case_id,                                      
                     "provenance.analysis.execution_id": execution_id}); 
   
    for annotation in objects.find({"provenance.image.case_id":case_id,                                      
                                    "provenance.analysis.execution_id": execution_id
                                     },{"_id":0}):                                                
      objects2.insert_one(annotation);
    print str(case_id)+ " human markup has been added."; 
      
    print "remove composite dataset"
    objects2.remove({"provenance.image.case_id":case_id,                                      
                     "provenance.analysis.execution_id": execution_id2});
  #exit(); 
  
  print ' -- load composite results into quip_comp database ---- ';
  for item in image_user_list:  
    case_id=item[0]; 
    print case_id ,composite_results_folder;
    subprocess.call(shlex.split('./load_composite_results.sh' + ' ' + case_id + ' ' + composite_results_folder ));
  print ' -- End of loading composite results into quip_comp database ---- ';
  
  print "--- end of program --- ";
  elapsed_time = time.time() - start_time  
  print "total time to run whole program is "+str(elapsed_time/60.00)+ ' minutes.'; 
  exit();
  
