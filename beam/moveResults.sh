#!/bin/sh
folder=$1
mainFolder=$(pwd)"/"
fromFolder=$mainFolder"risultati/"$folder
toFolder=$mainFolder"results/"$folder
summary=$fromFolder"/"$folder"_summary.txt"
benchmark=$fromFolder"/benchmark/motifs/"
weblogo=$fromFolder"/webLogoOut/motifs/"

cp $summary $toFolder

#cd $benchmark
cp $benchmark/*.search.txt $toFolder
#cd $weblogo
cp $weblogo/*.fa $toFolder
cd $mainFolder
mkdir $toFolder/css
cp public/css/results.css $toFolder/css
cp public/css/generale.css $toFolder/css
