#!/usr/bin/env bash

exitStatus=0

# TEST THAT THE BRANCH NAME MATCHES THE SCRIPT NAME
# TODO: (REVISE TEST IF THAT CHANGES)
testEquality() {
    branch_name=$(git rev-parse --abbrev-ref HEAD)

    script_name=$(find . -name 'run_containers_*.sh')
    substring=$(echo $script_name| cut -d'_' -f 3)
    name=$(echo $substring| cut -d'.' -f 1)

    echo "assertEquals $branch_name $name"
	assertEquals $branch_name $name
	[[ $? == 1 ]] && exitStatus=1

	script_name=$(find ../build -name 'build_containers_*.sh')
	substring=$(echo $script_name| cut -d'_' -f 3)
    name=$(echo $substring| cut -d'.' -f 1)

    echo "assertEquals $branch_name $name"
	assertEquals $branch_name $name
	[[ $? == 1 ]] && exitStatus=1
}

. shunit2-2.1.6/src/shunit2

exit $exitStatus