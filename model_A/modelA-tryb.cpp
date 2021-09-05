#include <iostream> //sta default folders gia libraries
#include <math.h>
#include <string>
#include <fstream>

#include <algorithm>

using namespace std;

//assumption: [miRNA]/t equally distributed to num of exosomes/t

double k_syn = 0.5;
double c1 = 0.6;
double c2 = 0.6;
double DmRNA = 0.41; // m mol / min 
double a_prot = 720.0; // aminoacids / min
double L = 680.0; // mikos
double D_prot = 0.1; // mol / min
double k0 = 79000; // min ^ -1
double n0 = 0; // starting quantity of miRNA
double n1 = 1.0; // exosome number
double k1 = 0.5; // degradation rate of complex / target
double kts = 7.0; //idk
double kp = 8.0;

double eq_mRNA1 (double n, double kts, double DmRNA, double k_syn, double t, double mRNA1)
{
    double mRNA1_rate=  n * kts - DmRNA * mRNA1 - k_syn * mRNA1; //mRNA1_rate= rate of mRNA1 change per time

    return mRNA1_rate;
}

double eq_miRNA (double c1, double mRNA1, double k_syn, double t, double miRNA) //sugkentrosi miRNA per t 
{
    double miRNA_rate = k_syn * mRNA1 - c1 *  miRNA; //B = rate of miRNA change per time

    return miRNA_rate;
}

double eq_mRNA2 (double k_syn, double mRNA1, double DmRNA, double t, double mRNA2)
{
    double mRNA2_rate = k_syn * mRNA1 - DmRNA * mRNA2; //C = rate of mRNA2 change per time

    return mRNA2_rate;
}

double eq_P (double a_prot, double L, double mRNA1, double mRNA2, double D_prot, double c2, double t, double P) 
{

    double P_rate = (a_prot/L) * kp * (mRNA1 + mRNA2) - D_prot * P - c2 * P; //D = rate of P change per time

    return P_rate;
}

double eq_target (double n0, double n1, double c1, double miRNA, double k1, double t, double target)
{
    double target_rate = n0 + c1 * miRNA * n1 - k1 * target; //E = rate of target change per time

    return target_rate;
}

double eq_Exo (double k0, double t) //num of exosomes at t - k0 exosomes per t
{
    double Exo = k0 * t;

    return Exo;
}

bool equilibrium (double prev_value, double now_value)
{
    bool equi;

    if(prev_value - now_value == 0)
    {
        equi = true;
    }
    else
    {
       equi = false;
    }

    return equi ;
}


int main()
{
    // initialize csv file
    std::ofstream file;
    file.open ("C:\\workspace\\iGEM\\----PROJECT-----\\DL\\model\\A\\code\\model_A_results_01.csv");
    file << "time, mRNA1, miRNA, P, Exo, target, mRNA2, miRNA in exosomes, protein in exosomes, eq in mRNA1, eq in miRNA, eq in P, eq in target, eq in mRNA2\n";

    double mRNA1 = 0;
    double mRNA1_rate = 0; // mRNA1 rate

    double miRNA = 0;
    double miRNA_rate = 0; //miRNA rate

    double P = 0;
    double P_rate = 0;// rate of P

    double Exo = 0;

    double target = 0;
    double target_rate = 0; //rate of target

    double mRNA2 = 0;
    double mRNA2_rate = 0; //rate of mRNA2

    double miRNA_exo = 0;
    double P_exo = 0;

    

    for (int t=0; t <100; t=t+1)
    {
        //counting prev values to calculate equilibrim

        double mRNA1_prev = mRNA1;
        double mRNA2_prev = mRNA2;
        double miRNA_prev = miRNA;
        double target_prev = target;
        double P_prev = P;
        
        mRNA1_rate = eq_mRNA1 (1.0, kts, DmRNA, k_syn, t, mRNA1);
        mRNA1 = mRNA1 + mRNA1_rate;

        miRNA_rate = eq_miRNA (c1, mRNA1, k_syn, t, miRNA);
        miRNA = miRNA + miRNA_rate;

        mRNA2_rate = eq_mRNA2 (k_syn, mRNA1, DmRNA, t, mRNA2);
        mRNA2 = mRNA2 + mRNA2_rate;

        P_rate = eq_P (a_prot, L, mRNA1, mRNA2, D_prot, c2, t, P);
        P = P + P_rate;
        
        target = eq_target (n0, n1, c1, miRNA, k1, t, target);
        target = target + target_rate;

        Exo = eq_Exo (k0, t);

        //calc protein and miRNA in exosomes
        miRNA_exo = c1 * miRNA / k0;
        P_exo = c2 * P / k0;

        //add stuff to excel
        file << t << " ,";
        file << mRNA1 << " ,";
        file << miRNA << " ,";
        file << P << " ,";
        file << Exo << " ,";
        file << target << " ,";
        file << mRNA2 << " ,";
        file << miRNA_exo << " ,";
        file << P_exo << " ," ;

        //calculate equilibrium
        if(equilibrium(mRNA1_prev, mRNA1) == true)
        {
            file << t << " ,";
        }  
        else
        {
            file << "not yet" << " ,";
        }
        
        if(equilibrium(miRNA_prev, miRNA) == true)
        {
            file << t << " ,";
        }  
        else
        {
            file << "not yet" << " ,";
        }
        if(equilibrium(P_prev, P) == true)
        {
            file << t << " ,";
        }  
        else
        {
            file << "not yet" << " ,";
        }
        if(equilibrium(target_prev, target) == true)
        {
            file << t << " ,";
        }  
        else
        {
            file << "not yet" << " ,";
        }
        if(equilibrium(mRNA2_prev, mRNA2) == true)
        {
            file << t << " ,\n";
        }  
        else
        {
            file << "not yet" << " ,\n";
        }

    }

    file.close();
}