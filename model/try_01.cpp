#include <iostream> //sta default folders gia libraries
#include <math.h>
#include <string>
#include <fstream>

#include <algorithm>

using namespace std;

//assumption: [miRNA]/t equally distributed to num of exosomes/t

double k_syn = 0.5;
double c1 = 0.6;
double c2 = 20.6;

double DmRNA = 0.41; // m mol / min 
double a_prot = 720.0; // aminoacids / min
double L = 680.0; // mikos
double D_prot = 0.0000139; // mol / min
double k0 = 79000; // min ^ -1
double n0 = 0; // starting quantity of miRNA
double n1 = 1.0; // exosome number
double k1 = 0.5; // degradation rate of complex / target
double kts = 7.0; //idk

//initialize
double mRNA1 = 0;
double mRNA2 = 0;
double P = 0;
double miRNA = 0;
double target = 0;
double Exo = 0;


double eq_mRNA1 (double n, double kts, double DmRNA, double k_syn, double t, double mRNA1_prev)
{
    mRNA1 = n * kts * t - DmRNA * mRNA1_prev * t - k_syn * mRNA1_prev * t;

    cout << "mRNA1 value after calc at t=" << t <<" is " << mRNA1 <<endl;

    return mRNA1;
}

double eq_miRNA (double c1, double mRNA1, double k_syn, double Exo, double t, double miRNA_prev) //sugkentrosi miRNA per t 
{
    miRNA = k_syn * mRNA1 * t - c1 *  miRNA_prev * t; //*Exo

    return miRNA;
}

double eq_P (double a_prot, double L, double mRNA1, double mRNA2, double D_prot, double c2, double Exo,  double t, double P_prev) 
{

    P = (a_prot/L) * (mRNA1 + mRNA2) * t - D_prot * P_prev * t - c2 * P_prev * t; //*Exo

    cout << "P value after calc at t=" << t <<" is " << P << endl;

    return P;
}

double eq_Exo (double k0, double t) //num of exosomes at t - k0 exosomes per t
{
    Exo = k0 * t;

    return Exo;
}

double eq_target (double n0, double n1, double c1, double miRNA, double k1, double t, double target_prev)
{
    target = n0 * t + c1 * miRNA * n1 * t - k1 * target_prev * t;

    return target;
}

double eq_mRNA2 (double k_syn, double mRNA1, double DmRNA, double t, double mRNA2_prev)
{
    mRNA2 = k_syn * mRNA1 * t - DmRNA * mRNA2_prev * t;

    return mRNA2;
}

int main()
{
    // initialize csv file
    std::ofstream file;
    file.open ("C:\\workspace\\iGEM\\----PROJECT-----\\DL\\model\\A\\code\\model_A_results_01.csv");
    file << "time, mRNA1, miRNA, P, Exo, target, mRNA2\n";

    double mRNA1 = 0;
    double miRNA = 0;
    double P = 0;
    double Exo = 0;
    double target = 0;
    double mRNA2 = 0;


    for (int t=0; t <10; t=t+1)
    {
        cout << "mRNA1 " << mRNA1 << endl;
        cout << "miRNA " << miRNA << endl;
        cout << "P " << P << endl;
        cout << "Exo " << Exo << endl;
        cout << "target " << target << endl;
        cout << "mRNA2 " << mRNA2 << endl;
        
        double mRNA1_prev = mRNA1;
        double mRNA2_prev = mRNA2;
        double miRNA_prev = miRNA;
        double target_prev = target;
        double P_prev = P;

        cout << "for:mRNA1 pre calc " << mRNA1 << endl;
        mRNA1 = eq_mRNA1 (1.0, kts, DmRNA, k_syn, t, mRNA1_prev);
        cout << "for:mRNA1 post calc " << mRNA1 << endl;

        cout << "for:mRNA1 pre calc for miRNA " << mRNA1 << endl;
        miRNA = eq_miRNA (c1, Exo, mRNA1, k_syn, t, miRNA_prev);
        cout << "for:mRNA1 post calc for miRNA " << mRNA1 << endl;

        mRNA2 = eq_mRNA2 (k_syn, mRNA1, DmRNA, t, mRNA2_prev);
        P = eq_P (a_prot, L, mRNA1, mRNA2, D_prot, c2, Exo, t,P_prev);
        
        target = eq_target (n0, n1, c1, miRNA, k1, t, target_prev);
        Exo = eq_Exo (k0, t);

        

        
        file << t << " ,";
        file << mRNA1 << " ,";
        file << miRNA << " ,";
        file << P << " ,";
        file << Exo << " ,";
        file << target << " ,";
        file << mRNA2 << " , \n" ;
        
        }

    file.close();
}