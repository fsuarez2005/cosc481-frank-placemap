# sed script that converts category list to html


1 { 
i\
<select multiple="multiple" name="category">
}

$ {
a\
</select>
}

# save pattern
h

# convert underscores to spaces
s/_/ /g

# make first letter of word upper
s/ a/ A/g
s/^a/A/g;
s/ b/ B/g
s/^b/B/g;
s/ c/ C/g
s/^c/C/g;
s/ d/ D/g
s/^d/D/g;
s/ e/ E/g
s/^e/E/g;
s/ f/ F/g
s/^f/F/g;
s/ g/ G/g
s/^g/G/g;
s/ h/ H/g
s/^h/H/g;
s/ i/ I/g
s/^i/I/g;
s/ j/ J/g
s/^j/J/g;
s/ k/ K/g
s/^k/K/g;
s/ l/ L/g
s/^l/L/g;
s/ m/ M/g
s/^m/M/g;
s/ n/ N/g
s/^n/N/g;
s/ o/ O/g
s/^o/O/g;
s/ p/ P/g
s/^p/P/g;
s/ q/ Q/g
s/^q/Q/g;
s/ r/ R/g
s/^r/R/g;
s/ s/ S/g
s/^s/S/g;
s/ t/ T/g
s/^t/T/g;
s/ u/ U/g
s/^u/U/g;
s/ v/ V/g
s/^v/V/g;
s/ w/ W/g
s/^w/W/g;
s/ x/ X/g
s/^x/X/g;
s/ y/ Y/g
s/^y/Y/g;
s/ z/ Z/g
s/^z/Z/g;





# get saved
G




# make html
s/\(.*\)\n\(.*\)/<option value="\2">\1<\/option>/
