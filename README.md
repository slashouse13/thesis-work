# README #

There are 3 main projects in this repo:

1 - RandomNucleo
It is a tool used to create artificial datasets. Firsly generates a number of RNA sequences (FASTA format), it applies 3 labels in the name (seqCat01,02,03) in order to identify which ones will carry a seqeunce+structure motif, a structure motif, and just noise.
The tool is designed in order to work in different steps:
  1)Random nucleotide generation + sequence motif inclusion
  2)After folding with external tools (not included here), inclusion of a structural motif in RNAs with tag 01 and 02 (dot bracket notation)
  3)BEAR structure coding (external tool, not included), inclusion of the same structural motif coded in the same position as the dot bracket.
  
2 - Ushuffle
It is a tool developed by UtahState University that aims to shuffle a sequence, either DNA, RNA or peptides. Originally accepted only one seqeunce per time, now accepts entire files.

3 - BEAM Web Server - First version (10/2016)
This is the project that took the most time during my 1-year thesis. It's developed in Node.js, and probably isn't the best choice for this kind of application due the asynchronous nature of Node.js. BEAM WS intends to provide a full workflow and standardization to RNA motif finding process. It gives the opportunity to the user to upload a dataset file or paste it in a text area. The WS checks whether the dataset needs to undergo to folding process or BEAR codification, then just given as input to the main algorithm (BEAM).
Result files are gathered in order to collect the most important information, also to easier result presentation which includes:
- RNA motif graphical representation
- Statistical measures
- Plots on motif position through the molecules
- Expandable view that shows every molecule that showed the motif highlighting the segment in which such motif has been found
- A full .zip file to be downloaded for a more detailed result analysis.

\\\DETAIL ON SCRIPTS///
BearToDbn.py
  aims to decode from BEAR structure to dot bracket notation, since VARNA doesn't accept a notation that is not dot bracket. Here it is taken care of trimming the motif, since VARNA won't compute well an unbalanced hairpin structure (one of the two stems surrounding the loop is shorter than the other)
cleanEnergies.py
  Cleans the VIENNA output file which carries the free energy immediately after the dot bracket structure
moveResults.sh
  Bash script that moves all the relevant files from BEAM result folder to WS result folder which is accessible from the user
positionVienna.rb
printHist.py
  prints histograms reporting the starting position of the motif in each molecule
rnastruct.sh
  RnaStruct uses a 3-commands workflow to compute the structure, here are included such commands. Needs file name and file output as input parameters.
saveTheTextArea.py
  Since the textArea in the html page considers a return character as '\r' it was needed an additional script to replace it with '\n'.
summaryProcess.rb
  Analyses the summary files in order to extract relevant information on the BEAM run and motif found.
