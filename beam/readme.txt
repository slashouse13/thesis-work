							|	  README	|
							|_______________________|

This is a Readme file for <your_results>.tar.gz archive.

You will find 2 files and 2 folders in the main directory:
1- /benchmark/ : Detailed run(s) results
2- /weblogo/ : No concrete pictures here, or in its subfolders. 
3- <name_of_input_file>_summary.txt: contains the summary of the analisys;
4- autoBG.txt (Optional): is the background file, automatically choosed from a pool of Rfam sequences;

---------------------------------------------------------------------------------------------------------------------
Benchmark fodler:
---------------------------------------------------------------------------------------------------------------------
Contains one single subfolder (motifs), which includes 3 files per run/motif:
- *.search.txt: has 4 sections. The first one (top) will show the multiple alignment, structured as below:

|---------------------------------------------------------------------------------------------------------------------|
| bear-encoded sequence | name of the sequence | # of the run | start motif position | end motif position | beam score|
|---------------------------------------------------------------------------------------------------------------------|

The second section (starting with "other matches"), is similar to the first one, but instead of the bear-encoded sequence, it will show the nucleotide sequence.

The third section, shows the PSSM. Rows represents each position of the motif, with the descending-order of bear char relative frequency.

The fourth section (bottom), reports a small summary:
Score: the score of the motif found;
seq: number of sequences:
escape: boolean, if true, the run has found the minimum energy;
onStep: exit at iteration number;
minStep: min number of iterations;
maxStep: max number of iterations;

- *.search.txt.gauss: contains two statistical indicators, mean and variance;
- *.txt is a copy of *.search.txt.

-----------------------------------------------------------------------------------------------------------------------
Weblogo folder:
-----------------------------------------------------------------------------------------------------------------------
WebLogoOut contain the folder Motifs. 
For each motif there is a fasta file (like <name_of_input_file>_mX_runY_wl.fa) in which are listed all the sequence given as input with name and the portion of sequence motif in qbear alphabet.

------------------------------------------------------------------------------------------------------------------------
<name_of_input_file>_summary.txt
------------------------------------------------------------------------------------------------------------------------
In the summary file there are information about file input and statistics.
#input: name of input file.
#input_size: number of sequences in the input file.
#background: background file name. If there is no uploaded file it is Auto Background (AutoBG)
#background_size: number of sequences in background file.
#meanLenght: sequences mean length.
#meanStructureContent: statistical structural content value (for the dataset).
#bin: length structuration bin.

The following rows are repeated for each motif found:
- motif in BEAR alphabet
- motif in qBear alphabet
- pvalue
- score
- coverage
- fall-out
- runtime (s)
