#!/bin/python
# coding: utf-8
# This script part of usv project
# author: fe3dback@yandex.ru
# version: 2.0

import os
import distutils.spawn
import subprocess
import shutil


class ConType:
    NORMAL = 1
    INFO = 2
    SUCCESS = 3
    WARNING = 4
    HIGH_LIGHT = 5


class BGColor:
    HEADER = '\033[95m'
    OK_BLUE = '\033[94m'
    OK_GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    END_C = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def con_print(message, msg_type=ConType.NORMAL):
    _str = ""

    # open
    if msg_type == ConType.NORMAL:
        _str += BGColor.END_C

    if msg_type == ConType.INFO:
        _str += BGColor.OK_BLUE

    if msg_type == ConType.SUCCESS:
        _str += BGColor.OK_GREEN

    if msg_type == ConType.WARNING:
        _str += BGColor.FAIL

    if msg_type == ConType.HIGH_LIGHT:
        _str += BGColor.WARNING

    # format line
    _str += message

    # close
    _str += BGColor.END_C

    print(_str)
    return _str


def con_println():
    print("")


def con_clear():
    os.system('cls' if os.name == 'nt' else 'clear')


def is_tool_installed(name):
    return distutils.spawn.find_executable(name) is not None


def is_module_installed(name):

    test = subprocess.Popen(["npm", "list", "-g", "|", "grep", name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output = test.communicate()[0]

    return name in output


def install_module(name):

    p = subprocess.Popen(["sudo", "npm", "install", name, "-g"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = p.communicate()

    if len(err) >= 1:
        con_print(err, ConType.WARNING)
        exit()


# Vars
# ====================
D_WORKING = os.path.dirname(os.path.abspath(__file__))
D_ROOT = os.path.dirname(D_WORKING)
D_USV = D_ROOT + "/usv"
D_BUILD = D_ROOT + "/build"
D_GIT = D_ROOT + "/.git"
D_MODULES = D_USV + "/node_modules"


# Start execution of installer
con_clear()

con_print("Welcome to " + BGColor.HEADER + "USV(v2)" + BGColor.END_C + " Setup script.")
con_print("Now we check all requirements and setup necessary packages.")
con_println()

# Check global apps
# ==========================================================

con_print("1. Check global installed apps:", ConType.HIGH_LIGHT)
con_println()

globalCheck = True
apps = ["node", "npm"]

for app in apps:

    if is_tool_installed(app):
        con_print("  ✔ "+app+" installed.", ConType.SUCCESS)
    else:
        globalCheck = False
        con_print("  ✗ "+app+" not installed.", ConType.WARNING)

con_println()

if not globalCheck:
    con_print("Global apps not installed. Please install node first:", ConType.WARNING)
    con_print("https://nodejs.org/en/", ConType.WARNING)
    con_println()
    exit()

# Check npm modules
# ==========================================================

modules = ["less", "coffee-script", "grunt-cli"]

con_print("2. Check npm global modules:", ConType.HIGH_LIGHT)
con_println()

ind = 0
for module in modules:

    ind += 1

    con_print(" 2."+str(ind)+". Check "+module+" module:", ConType.HIGH_LIGHT)

    if is_module_installed(module):
        con_print("  ✔ "+module+" already installed.", ConType.SUCCESS)
        con_println()
    else:
        con_print("  ❓ "+module+" not installed. Installing...", ConType.INFO)
        con_print("    this action require root access", ConType.INFO)
        install_module(module)
        con_print("  ✔ " + module + " has been installed.", ConType.SUCCESS)
        con_println()

# Setup project
# ==========================================================

con_print("============================", ConType.HIGH_LIGHT)
con_print("Setup project", ConType.HIGH_LIGHT)
con_print("============================", ConType.HIGH_LIGHT)
con_println()

# make build
# ==========================================================

con_print("1. Make build folder:", ConType.HIGH_LIGHT)

if os.path.isdir(D_BUILD):
    con_print("  build exist. Skip step.", ConType.INFO)
else:
    os.mkdir(D_BUILD)
    os.mkdir(D_BUILD + "/assets")
    os.mkdir(D_BUILD + "/assets/fonts")
    os.mkdir(D_BUILD + "/assets/less")
    os.mkdir(D_BUILD + "/assets/coffee")
    os.mkdir(D_BUILD + "/assets/img")
    os.mkdir(D_BUILD + "/assets/vendor")
    os.mkdir(D_BUILD + "/tmp")

    con_print("  ✔ build directory ready.", ConType.SUCCESS)

con_println()

# check git
# ==========================================================

con_print("2. Check git repo:", ConType.HIGH_LIGHT)

if os.path.isdir(D_GIT):
    con_print("  git exist. Skip step.", ConType.INFO)
else:
    con_print("  git not exist. Initializing.")

    curGit = D_USV + "/.git"
    if os.path.isdir(curGit):
        con_print("  Detaching git from usv..")
        shutil.rmtree(curGit)
        con_print("  ✔ Git detached from usv.", ConType.SUCCESS)

    con_print("  init git in project..")

    os.chdir(D_ROOT)
    os.system("git init .")

    con_print("  ✔ Git initialized", ConType.SUCCESS)

con_println()

# Install modules
# ==========================================================

con_print("3. Check project node modules:", ConType.HIGH_LIGHT)

if os.path.isdir(D_MODULES):
    con_print("  modules already installed. Skip step.", ConType.INFO)
else:

    con_print("  install modules..")

    os.chdir(D_USV)
    os.system("npm install")

    con_print("  ✔ Modules installed", ConType.SUCCESS)

con_println()

# first time compile
# ==========================================================

con_print("4. Compile sources:", ConType.HIGH_LIGHT)

os.chdir(D_USV)
os.system("grunt pug less coffee")

con_println()

# Done
# ==========================================================

con_print("============================", ConType.HIGH_LIGHT)
con_print("All done", ConType.HIGH_LIGHT)
con_print("============================", ConType.HIGH_LIGHT)
con_println()

con_print("For work (compiling sources) use grunt:")
con_print(BGColor.WARNING+"$ "+BGColor.END_C+"cd "+str(D_USV))
con_print(BGColor.WARNING+"$ "+BGColor.END_C+"grunt")
con_println()
con_print("read README.md for detail")

con_println()
con_println()