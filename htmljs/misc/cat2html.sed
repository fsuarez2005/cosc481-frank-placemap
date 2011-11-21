# sed script that converts category list to html


1 { 
i\
<select multiple="multiple" name="category">
}

$ {
a\
</select>
}

s@\(.*\)@\t<option value="\1">\1</option>@

