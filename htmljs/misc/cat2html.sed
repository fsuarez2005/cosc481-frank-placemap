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
s/\b\(.\)/\U\1/g


# get saved
G




# make html
s/\(.*\)\n\(.*\)/<option value="\2">\1<\/option>/
