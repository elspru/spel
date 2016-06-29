SUBDIRS = .

noinst_LIBRARIES =  library/library_programmer.a library/library_seed.a \
                    library/library_prng.a
library_library_seed_a_SOURCES = source/seed/seed.c
library_library_seed_a_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS)\
         -Wstack-usage=256 # data bytes per warp

library_library_programmer_a_SOURCES = source/machine_programmer/programmer.c
library_library_programmer_a_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS)\
         -Wstack-usage=256 # data bytes per warp

library_library_prng_a_SOURCES = source/machine_programmer/prng.c
library_library_prng_a_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS)\
         -Wstack-usage=256 # data bytes per warp

# vm 
bin_PROGRAMS = binary/virtual-machine
binary_virtual_machine_SOURCES = source/virtual-machine.c 
binary_virtual_machine_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS) \
         -Wstack-usage=32768  #L1 Cache
binary_virtual_machine_LDADD = library/library_seed.a \
          library/library_programmer.a library/library_prng.a

# TESTS
#TESTS = check_vm
#check_PROGRAMS = check_vm
#check_vm_SOURCES = check/check_ACC_vm.c \
#    $(top_builddir)/source/seed/seed.h
#check_vm_CFLAGS = @CHECK_CFLAGS@
#check_vm_LDADD = $(top_builddir)/library/library_seed.a @CHECK_LIBS@
