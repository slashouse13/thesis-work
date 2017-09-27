#!/bin/bash

start=$1
out=$2
folder=$3
mkdir $folder/test
#mantengo il file originale start e su quello di input elimino man mano le sequenze.
cp $start $folder/test/input.fa

NUMRIGHE=$(cat $start |wc -l)
echo $NUMRIGHE

for ((i=1; i<=$NUMRIGHE; i=i+2)) do

head -2 $folder/test/input.fa > $folder/test/seq.fa

RNAstructure/exe/partition $folder/test/seq.fa $folder/test/file_pfs.pfs && RNAstructure/exe/MaxExpect $folder/test/file_pfs.pfs $folder/test/file_ct.ct && RNAstructure/exe/ct2dot $folder/test/file_ct.ct 1 $folder/test/seq_out.fa
FILE=$(<$folder/test/seq_out.fa)
#sleep 10
if ( [[ $FILE = '>-v' ]] || [[ $FILE = '>' ]] || [[ $FILE = '' ]] ); then
	cat $folder/test/seq.fa >> $folder/not_folded.fa
else
	cat $folder/test/seq_out.fa >> $out
fi
#elimino la sequenza appena analizzata
sed -i -e '1,2d' $folder/test/input.fa


rm $folder/test/seq_out.fa $folder/test/file_ct.ct $folder/test/file_pfs.pfs
done
