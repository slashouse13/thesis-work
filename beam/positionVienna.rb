#script che restituisce un file in cui salvare le posizioni dei motivi per fare un istogramma delle lunghezze
def position (brenchmark, newfile)
  max=1
  count=0
  f=open(brenchmark).readlines
  new=[]
  new2=[]
  new3=[]
  pos=0
  f.size.times{|e|
    if f[e]== "\n"
      pos=e
      break
    else new.push(f[e])
    end
  }
  
  new.size.times{|j|
      new[j]=new[j].split("\t")
          if max<new[j][2].to_i
            max=new[j][2].to_i
          end
       if new[j][1][-5..-3]=="_bg"
        j+=1
        count=j
      else new2.push(new[j])
    end
  }



new2.size.times{|j|
    new3[j]=[]
    new3[j].push(new2[j][3],new2[j][4],(new2[j][3].to_i*100/new2[j][2].to_i),(new2[j][4].to_i*100/new2[j][2].to_i), (new2[j][2].to_i*100/max))
  }


  c=open(newfile,"w")

  new3.size.times{|k|
     c.write(new3[k].join("\t"))
     c.write("\n")
  } 
end
 
position(ARGV[0], ARGV[1])