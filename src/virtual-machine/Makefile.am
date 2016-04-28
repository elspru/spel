SUBDIRS = .

noinst_LIBRARIES = library/library_seed.a
library_library_seed_a_SOURCES = source/seed/seed.c
library_library_seed_a_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS)\
         -Wstack-usage=256

# vm 
bin_PROGRAMS = binary/virtual-machine
binary_virtual_machine_SOURCES = \
    source/virtual-machine.c 
binary_virtual_machine_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS) 
binary_virtual_machine_LDADD = library/library_seed.a

# TESTS
#TESTS = check_vm
#check_PROGRAMS = check_vm
#check_vm_SOURCES = check/check_ACC_vm.c \
#    $(top_builddir)/source/seed/seed.h
#check_vm_CFLAGS = @CHECK_CFLAGS@
#check_vm_LDADD = $(top_builddir)/library/library_seed.a @CHECK_LIBS@
