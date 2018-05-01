#!/bin/bash
echo "-----------------------------------------------------"
echo "Date: $(date)                     Host:$(hostname)"
echo "-----------------------------------------------------"

case_id="$1"
composite_results_folder="$2"
container_datapath="/data/images/composite_results" 
record_count=0

for prefix in $(find  $composite_results_folder/$case_id/* -type d );
    do
        echo "$prefix"; 
        new_path="${prefix/"$composite_results_folder"/$container_datapath}"
        echo "$new_path";
        echo "------------------------------------------------------------------------------"
        docker exec -it quip-loader /usr/local/pathomics_featuredb/src/build/install/featuredb-loader/bin/featuredb-loader \
          --inptype csv --fromdb --dbname quip_comp --dbhost  quip-data --quip $new_path/
         record_count=$(($record_count+1))
        #echo "========="             
   done;    

echo $record_count

echo "-----------------------------------------------------"
echo "Date: $(date)"
echo "-----------------------------------------------------"


