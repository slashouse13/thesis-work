#script che resituisce un nuovo file in cui sono selezionati i risultati utili da mettere nella pagina dei risultati a partire dal file txt summary di Beam.
def process (summary, newfile)
  vett=[]
  motif_index=1
  qbear_index=4
  pvalue_index=6
  score_index=7
  coverage_index=8
  fall_index=9
  runtime_index=10
  index=0
  ind=0
  f=open(summary).readlines[8..-1]
#p f
  while index <= f.size
      vett[ind]=[]
   vett[ind].push(f[index+motif_index], f[index+qbear_index], f[index+pvalue_index], "\n", f[index+score_index][0..15], "\n", f[index+coverage_index][0..15], "\n", f[index+fall_index], f[index+runtime_index])
      index+=12
      ind+=1
  end
  p f
  c=open(newfile,"w")
  
  vett.each{|i|
      i.each{|j|
        j.size.times{|m|
          if j[m]=="\n"
		p j[m]            
		j[m]="\t"

          end
        }
      }
      c.write(i.join)
      c.write("\n")
  }
#p vett
  
end
 
process(ARGV[0], ARGV[1])
