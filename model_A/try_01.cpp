#include <iostream> //sta default folders gia libraries
#include <chrono>
#include <thread>
#include <math.h>
#include <string>
#include <fstream>

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

double eq_mRNA1 (double n, double kts, double DmRNA, double k_syn, double t)
{
    double mRNA1 = n* kts * t - DmRNA * t - k_syn * mRNA * t;

    return mRNA1;
}

double eq_miRNA (double c1, double tx0,  double mRNA1, double k_syn, double t)
{
    double miRNA = k_syn * mRNA1 * t - c1 * tx0 * miRNA * t;

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

double eq_mRNA2 (double k_syn, double mRNA1, double DmRNA, double t)
{
    double mRNA2 = k_syn * mRNA1 * t - DmRNA * mRNA2 * t;

    return mRNA2;
}

int main()
{
    // initialize csv file
    std::ofstream file;
    file.open ("C:\\workspace\\iGEM\\----PROJECT-----\\DL\\model\\A\\code\\model_A_results_01.csv");
    file << "time, mRNA1, miRNA, P, tx0, target, mRNA2\n";

    double mRNA1;
    double miRNA;
    double P;
    double tx0;
    double target;
    double mRNA2;


    for (int t=0; t <10; t++)
    {
        mRNA1 = eq_mRNA1 (1.0, kts, DmRNA, k_syn, t);
        miRNA = eq_miRNA (c1, tx0, mRNA1, k_syn, t);
        P = eq_P (a_prot, L, mRNA1, mRNA2, D_prot, c2, tx0, t);
        tx0 = eq_tx0 (k0, t);
        target = eq_target (n0, n1, c1, miRNA, k1, t);
        mRNA2 = eq_mRNA2 (k_syn, mRNA1, DmRNA, t);

        cout << "mRNA1" << mRNA1 << endl;
        cout << "miRNA" << miRNA << endl;
        cout << "P" << P << endl;
        cout << "tx0" << tx0 << endl;
        cout << "target" << target << endl;
        cout << "mRNA2" << mRNA2 << endl;


        file << mRNA1, miRNA, P, tx0, target, mRNA2 ;

    }
}