#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
//#define M_PI 3.14159265358979323846 
static double fRand(double fMin, double fMax)
{
 double f = (double)rand() / RAND_MAX;
 return fMin + f * (fMax - fMin);
}
int main() {
    srand((unsigned int) time(NULL));
    printf("%f\n",-log(fRand(1,208))*sin(2*M_PI*fRand(1,208)));
    return 0;
}
