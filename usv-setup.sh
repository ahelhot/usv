#!/bin/bash

# This script part of usv project
# author: fe3dback@yandex.ru

###############################################################

curDir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

DRN_USV="usv2"
DRN_BUILD="build2"

D_PROJECT=${curDir}"/.."
D_GIT=${D_PROJECT}"/.git"
D_BUILD=${D_PROJECT}"/${DRN_BUILD}"
D_USV=${D_PROJECT}"/${DRN_USV}"
D_MODULES=${D_USV}"/node_modules"

# vars
DEF='\033[0m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'

###############################################################

# return 1 if global command line program installed, else 0
# example
# echo "node: $(program_is_installed node)"
function program_is_installed {
  # set to 1 initially
  local return_=1
  # set to 0 if not found
  type $1 >/dev/null 2>&1 || { local return_=0; }
  # return value
  echo "$return_"
}

# display a message in red with a cross by it
# example
# echo echo_fail "No"
function echo_fail {
  printf "${RED}✘ ${DEF}"
}

# display a message in green with a tick by it
# example
# echo echo_fail "Yes"
function echo_pass {
  printf "${GREEN}✔ ${DEF}"
}

# echo pass or fail
# example
# echo echo_if 1 "Passed"
# echo echo_if 0 "Failed"
function echo_if {
  if [ $1 == 1 ]; then
    echo_pass $2
  else
    echo_fail $2
  fi
}

###############################################################

CHK_APPS_OK=1

clear

printf "Welcome to ${YELLOW}USV(v1)${DEF} Setup script.\n"
printf "Now we check all requirements and setup necessary packages.\n\n"
printf "Check global installed apps: \n\n"

echo "node          $(echo_if $(program_is_installed node))"
echo "npm           $(echo_if $(program_is_installed grunt))"
echo "grunt         $(echo_if $(program_is_installed grunt))"

if [ $(program_is_installed node) == 0 ]; then

    CHK_APPS_OK=0
    printf "\n${RED}Node is not installed. Please install nodejs first.${DEF}\n"
    printf "https://nodejs.org/en/\n"

fi

if [ $(program_is_installed npm) == 0 ]; then

    CHK_APPS_OK=0
    printf "\n${RED}npm is not installed. Check node installation.${DEF}\n"
    printf "check: npm -v\n"

fi

if [ $(program_is_installed grunt) == 0 ]; then

    CHK_APPS_OK=0
    printf "\n${RED}Grunt-cli is not installed. Please install grunt-cli first.${DEF}\n"
    printf "npm install grunt-cli -g (as superuser)\n"

fi

if [ ${CHK_APPS_OK} == 0 ]; then

    printf "\n\n${RED}# Can't continue setup. Install global apps first!\n\n${DEF}"
    exit;

fi

printf "\nCheck global modules: \n\n"

printf "1. Check coffee-script: \n"
if [ -z "$(npm list -g | grep coffee-script)" ]; then
    echo "coffee-script not installed. Install.."
    echo "This need root permission to continue."
    sudo npm install coffee-script -g
    coffee -v
    echo -e "${YELLOW}- done. Coffee script compiler installed.${DEF}"
else
    echo -e "- ${GREEN}✔${DEF} ${YELLOW}Coffee script compiler exist${DEF}"
fi

printf "2. Check less: \n"
if [ -z "$(npm list -g | grep less)" ]; then
    echo "Less not installed. Install.."
    echo "This need root permission to continue."
    sudo npm install less -g
    less --version
    echo -e "${YELLOW}- done. Less compiler installed.${DEF}"
else
    echo -e "- ${GREEN}✔${DEF} ${YELLOW}Less compiler exist${DEF}"
fi

printf "2. Check grunt-cli: \n"
if [ -z "$(npm list -g | grep grunt-cli)" ]; then
    echo "Grunt CLI not installed. Install.."
    echo "This need root permission to continue."
    sudo npm install grunt-cli -g
    grunt --version
    echo -e "${YELLOW}- done. Grunt CLI installed.${DEF}"
else
    echo -e "- ${GREEN}✔${DEF} ${YELLOW}Grunt CLI exist${DEF}"
fi

printf "\n\n${GREEN}==============\nSetup project:\n==============${DEF}\n\n"

echo "1. Check build"

if [ -d "$D_BUILD" ]; then

    echo -e "${RED}Directory build/ exist, project in use. Skip this step${DEF}"

else

    echo -e "${YELLOW}- Making build folder..${DEF}"

    # make default build folder
    cd ${D_PROJECT}
    mkdir ${DRN_BUILD}
    cd ${D_BUILD}
    mkdir assets
    mkdir tmp
    cd ${D_BUILD}"/assets"
    mkdir fonts
    mkdir less
    mkdir js
    mkdir img
    mkdir vendor

    echo -e "${YELLOW}- done${DEF}"

fi


echo -e "2. Check node modules"

if [ -d "$D_MODULES" ]; then

    echo -e "${RED}Modules already exist, skip this step${DEF}"

else

    echo -e "${YELLOW}- Modules not exist, install..${DEF}"

    cd ${D_USV}
    npm install

    echo -e "${YELLOW}- done${DEF}"

fi

echo -e "3. Check git repo"

if [ -d "$D_GIT" ]; then

    echo -e "${RED}Git exist, skip this step${DEF}"

else

    echo -e "${YELLOW}- Git not exist, initializing..${DEF}"

    echo -e "${YELLOW}-- Detaching git from usv..${DEF}"

    cd ${D_USV}
    rm -rf ${D_USV}"/.git/"

    echo -e "${YELLOW}-- Init git in project..${DEF}"

    cd ${D_PROJECT}
    git init .
    touch .gitignore

    echo -e "${YELLOW}- done${DEF}"

fi

printf "\n\n";
echo -e "${YELLOW}All operations done.${DEF}"
echo -e "${YELLOW}For work (compiling templates) use grunt:${DEF}"
echo -e "${YELLOW} $ ${GREEN}cd ${curDir}${DEF}"
echo -e "${YELLOW} $ ${GREEN}grunt.${DEF}"