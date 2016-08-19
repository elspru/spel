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

noinst_LIBRARIES =  library/library_seed.a \
                    library/library_generic.a \
                    library/library_dictionary.a 
                    # library/library_programmer.a  \
                    # library/library_random.a 
library_library_seed_a_SOURCES = source/seed.c source/seed.h
library_library_seed_a_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS)\
         -Wstack-usage=256 # data bytes per warp

library_library_generic_a_SOURCES = source/generic.c source/generic.h
library_library_generic_a_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS)
      #   -Wstack-usage=256 # data bytes per warp

library_library_dictionary_a_SOURCES = source/dictionary.c \
                source/dictionary.h
library_library_dictionary_a_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS)\
         -Wstack-usage=32 # data bytes per warp

#library_library_programmer_a_SOURCES = source/machine_programmer/programmer.c
#library_library_programmer_a_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS)\
#         -Wstack-usage=256 # data bytes per warp

#library_library_random_a_SOURCES = source/machine_programmer/random.c
#library_library_random_a_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS)\
#         -Wstack-usage=256 # data bytes per warp

# vm 
bin_PROGRAMS = binary/programmer
binary_programmer_SOURCES = source/opencl_programmer.c 
binary_programmer_CFLAGS = -I$(top_srcdir) $(MY_CFLAGS) \
         -Wstack-usage=32768  #L1 Cache
binary_programmer_LDADD = library/library_seed.a \
          library/library_generic.a library/library_dictionary.a
# library/library_programmer.a library/library_random.a 

# TESTS
#TESTS = check_vm
#check_PROGRAMS = check_vm
#check_vm_SOURCES = check/check_ACC_vm.c \
#    $(top_builddir)/source/seed/seed.h
#check_vm_CFLAGS = @CHECK_CFLAGS@
#check_vm_LDADD = $(top_builddir)/library/library_seed.a @CHECK_LIBS@
