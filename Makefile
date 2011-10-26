

# ##########################################
# package building configuration
CLASSPATH = .:lib/*

SRCDIRS := org org/placemap org/placemap/datasource org/placemap/tests org/placemap/entity
CLASSES := $(subst .java,.class,$(foreach d,$(SRCDIRS),$(wildcard $(d)/*.java)))

PACKAGE := org.placemap
PACKAGESRCDIR := org
VERSION := 0
MANIFEST := Manifest.test1
JARFILE := $(subst .,-,$(PACKAGE))-$(VERSION).jar

DOXYFILE := doc/Doxyfile
DOXYDEST := doc/doxygen

# ##########################################

JFLAGS = -g -Xlint:unchecked -classpath $(CLASSPATH)
JC = javac
DOXYGEN := doxygen
FIND := find

.SUFFIXES: .java .class

# builds all classes
default: $(CLASSES)

# rule to build java files
.java.class:
	$(JC) $(JFLAGS) $*.java

# clean only classes
clean:
	$(RM) $(CLASSES)
	$(RM) $(JARFILE)
	$(RM) -r $(DOXYDEST)/*

distclean: clean
	$(FIND) -iname "*~" -delete # bak files
	$(FIND) -iname "#*" -delete # emacs bak files

# doxygen
doxy:
	$(DOXYGEN) $(DOXYFILE)

html: doxy

doc: html


# make jar file for package
jar: $(CLASSES) $(MANIFEST) 
	jar cmf $(MANIFEST) $(JARFILE) $(PACKAGESRCDIR)
