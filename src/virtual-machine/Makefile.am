#SPEL virtual machine
#Copyright (C) 2016  Logan Streondj
#
#This program is free software: you can redistribute it and/or modify
#it under the terms of the GNU Affero General Public License as published by
#the Free Software Foundation, either version 3 of the License, or
#(at your option) any later version.
#
#This program is distributed in the hope that it will be useful,
#but WITHOUT ANY WARRANTY; without even the implied warranty of
#MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#GNU Affero General Public License for more details.
#
#You should have received a copy of the GNU Affero General Public License
#along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
#contact: streondj at gmail dot com
#
SUBDIRS = .

noinst_LIBRARIES =  library/library_programmer.a library/library_seed.a \
                    library/library_prng.a library/library_dictionary.a
library_library_seed_a_SOURCES = source/seed/seed.c source/seed/seed.h
library_library_seed_a_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS)\
         -Wstack-usage=256 # data bytes per warp

library_library_dictionary_a_SOURCES = source/seed/dictionary.c \
                source/seed/dictionary.h
library_library_dictionary_a_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS)\
         -Wstack-usage=32 # data bytes per warp

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
          library/library_programmer.a library/library_prng.a \
          library/library_dictionary.a

# TESTS
#TESTS = check_vm
#check_PROGRAMS = check_vm
#check_vm_SOURCES = check/check_ACC_vm.c \
#    $(top_builddir)/source/seed/seed.h
#check_vm_CFLAGS = @CHECK_CFLAGS@
#check_vm_LDADD = $(top_builddir)/library/library_seed.a @CHECK_LIBS@
