#include <iostream> //sta default folders gia libraries
#include <chrono>
#include <thread>
#include <math.h>
#include <string>


#include <list>
#include <map>
#include <algorithm>

using namespace std;

double k_syn = 666.0;
double c1 = 666.0;
double c2 = 20.6;
double mRNA = 0;
double DmRNA = 0.41; // m mol / min 
double a_prot = 720.0; // aminoacids / min
double L = 666.0; // mikos
double D_prot = 0.0000139; // mol / min
double k0 = 79000; // min ^ -1
double n0 = 666.0; // starting quantity of miRNA
double n1 = 666.0; // exosome number
double k1 = 666.0; // degradation rate of complex / target
double kts = 666.0; //idk
double kts = 666.0; //idk

double eq_mRNA1 (double n, double kts, double DmRNA, double mRNA1, double ksyn, double t)
{
    double mRNA1 = n* kts * t - DmRNA * t - ksyn * mRNA * t;

    return mRNA1;
}

double eq_miRNA (double c1, double tx0,  double mRNA1, double ksyn, double t)
{
    double miRNA = ksyn * mRNA1 * t - c1 * tx0 * miRNA * t;

    return miRNA;
}

double eq_P (double a_prot, double L, double mRNA1, double mRNA2, double D_prot, double c2, double tx0, double t)
{
    double P = (a_prot/L) * mRNA1 * mRNA2 * t - D_prot * P * t - c2 * tx0 * P * t;

    return P;
}

double eq_tx0 (double k0, double t)
{
    double tx0 = k0 * t;

    return tx0;
}

double eq_target (double n0, double n1, double c1, double miRNA, double k1, double t)
{
    double target = n0 * t + c1 * miRNA * n1 * t - k1 * target * t;

    return target;
}

double eq_mRNA2 (double ksyn, double mRNA1, double DmRNA, double mRNA2, double t)
{
    double mRNA2 = ksyn * mRNA1 * t - DmRNA * mRNA2 * t;

    return mRNA2;
}

int main()
{

}