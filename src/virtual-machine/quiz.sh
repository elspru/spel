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
# update source file format
FILES="source/virtual-machine.c source/seed/seed.c source/seed/seed.h \
 source/machine_programmer/programmer.c source/machine_programmer/programmer.h \
  source/machine_programmer/prng.c source/machine_programmer/prng.h"
for i in $FILES
do
  clang-format $i > tmp;
  mv tmp $i;
done

# recompile
make clean && make && valgrind -q binary/virtual-machine 
